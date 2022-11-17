from os import name
# from pandas.core.tools.datetimes import to_datetime
from os import name
import frappe
from numpy import empty
import pandas as pd
import json
import datetime
from frappe.permissions import check_admin_or_system_manager
from frappe.utils.csvutils import read_csv_content
from six.moves import range
from six import string_types
from frappe.utils import (getdate, cint, add_months, date_diff, add_days,getdate,
    nowdate, get_datetime_str, cstr, get_datetime, now_datetime, format_datetime)
from datetime import datetime
from calendar import monthrange
from frappe import _, msgprint
from frappe.utils import flt
from frappe.utils import cstr, cint, getdate,get_first_day, get_last_day, today, time_diff_in_hours
import requests
from datetime import date, timedelta,time
from frappe.utils.background_jobs import enqueue
from frappe.utils import get_url_to_form
import math

@frappe.whitelist()
def submit_att_datewise():
    # cur_date = today()
    # to_date = add_days(cur_date,-1)
    from_date= '2022-10-01'
    to_date = '2022-10-31'
    attendance = frappe.db.sql("""select name,employee from `tabAttendance` where docstatus = 0  and attendance_date between '%s' and '%s' """ % (from_date,to_date),as_dict=1)
    for att in attendance:
        status = frappe.db.get_value('Employee',att.employee,'status')
        print(status)
        if status == 'Active':
            at_id = frappe.get_doc('Attendance',att.name)
            at_id.submit()
            frappe.db.commit()

@frappe.whitelist()
def mark_att_datewise():
    # cur_date = today()
    # to_date = add_days(cur_date,-1)
    from_date= '2022-10-31'
    to_date = '2022-11-01'
    
    admin_office_checkins = frappe.db.sql(""" select * from `tabEmployee Checkin` where date(time) between '%s' and '%s' and device_id in ('ADMIN OFFICE','Admin Office out') order by time"""%(from_date,to_date),as_dict = 1)
    checkins = frappe.db.sql("""select * from `tabEmployee Checkin` where date(time) between '%s' and '%s' order by time """%(from_date,to_date),as_dict=True) 
    attendance = frappe.db.sql("""select name,employee,shift,in_time,out_time,attendance_date,ot_hours from `tabAttendance` where docstatus != 2  and attendance_date between '%s' and '%s' """ % (from_date,to_date),as_dict=1)

    if checkins:
        date = checkins[0].time
        from_date = datetime.strftime(date,'%Y-%m-%d')
        
        for c in checkins:
            mark_attendance_from_checkin(c.name,c.employee,c.time,c.device_id)
      
    if admin_office_checkins:
        for c in admin_office_checkins:
            mark_admin_office_from_checkin(c.name,c.employee,c.time)

@frappe.whitelist()
def mark_auto_attendance():
    from_date= '2022-10-01'
    to_date = '2022-10-31'
    employee = frappe.db.sql("""select * from `tabEmployee` where name in ('2065','2099')""",as_dict =1)
    for emp in employee:
        dates = get_dates(from_date,to_date)
        for date in dates:
            date = datetime.strptime(date,'%Y-%m-%d')
            day = date.date()
            emp_doj = frappe.get_value('Employee',emp.name,'date_of_joining')
            if day >= emp_doj:
                emp_holiday_list = frappe.get_value('Employee',emp.name,'holiday_list')
                holiday = frappe.db.sql("""select `tabHoliday`.holiday_date,`tabHoliday`.weekly_off from `tabHoliday List` 
                left join `tabHoliday` on `tabHoliday`.parent = `tabHoliday List`.name where `tabHoliday List`.name = '%s' and holiday_date = '%s' """%(emp_holiday_list,day),as_dict=True)
                if not holiday:
                    att_doc = frappe.new_doc('Attendance')
                    att_doc.employee = emp.name
                    att_doc.attendance_date = day
                    att_doc.status = 'Present'
                    att_doc.save(ignore_permissions=True)
                    if att_doc.docstatus == 0:
                        att_doc.submit()
                        frappe.db.commit()

def mark_absent_datewise():
    from_date= '2022-10-01'
    to_date = '2022-10-31'
    employee = frappe.db.sql("""select * from `tabEmployee` where status = 'Active'""",as_dict =1)
    for emp in employee:
        dates = get_dates(from_date,to_date)
        for date in dates:
            date = datetime.strptime(date,'%Y-%m-%d')
            day = date.date()
            emp_doj = frappe.get_value('Employee',emp.name,'date_of_joining')
            if day >= emp_doj:
                emp_holiday_list = frappe.get_value('Employee',emp.name,'holiday_list')
                holiday = frappe.db.sql("""select `tabHoliday`.holiday_date,`tabHoliday`.weekly_off from `tabHoliday List` 
                left join `tabHoliday` on `tabHoliday`.parent = `tabHoliday List`.name where `tabHoliday List`.name = '%s' and holiday_date = '%s' """%(emp_holiday_list,day),as_dict=True)
                if not holiday:
                    att = frappe.db.exists("Attendance",{'employee':emp.name,'attendance_date':day})
                    if not att:
                        att_doc = frappe.new_doc('Attendance')
                        att_doc.employee = emp.name
                        att_doc.attendance_date = day
                        att_doc.status = 'Absent'
                        att_doc.save(ignore_permissions=True)
                        att_doc.submit()
                        frappe.db.commit()


def mark_ot_datewise():
    from_date= '2022-10-01'
    to_date = '2022-10-31'
    attendance = frappe.db.sql("""select name,employee,shift,in_time,out_time,attendance_date,ot_hours,grade from `tabAttendance` where docstatus != 2  and attendance_date between '%s' and '%s' """ % (from_date,to_date),as_dict=1)
    for att in attendance:
        print(att.attendance_date)
        if att.in_time and att.out_time:
            if att.grade != 'Office Staff': 
                hh = check_holiday(att.attendance_date,att.employee)
                if hh:
                    if hh == 'HH':   
                        total_wh = att.out_time - att.in_time  
                        diff =total_wh.total_seconds()           
                        wh = round(diff/3600)
                        if wh > 11 :
                            wh = 11
                            frappe.db.set_value("Attendance",att.name,'holiday_ot',wh)
                        else:
                            frappe.db.set_value("Attendance",att.name,'holiday_ot',wh)
                
                    elif hh == 'WW':
                        total_wh = att.out_time - att.in_time  
                        diff =total_wh.total_seconds()           
                        wh = round(diff/3600)
                        if wh > 11:
                            wh = 11
                            frappe.db.set_value("Attendance",att.name,'week_end_ot',wh)
                        else:
                            frappe.db.set_value("Attendance",att.name,'week_end_ot',wh)
                else:
                    total_wh = att.out_time - att.in_time  
                    diff =total_wh.total_seconds() 
                    print(diff)          
                    wh = round(diff/3600)-(9)
                    print(wh)
                    if wh <=3 and wh > 0:
                        print(wh)
                        frappe.db.set_value("Attendance",att.name,'ot_hours',wh)
                        print('three')   
                    if wh > 3:
                        wh = 3
                        frappe.db.set_value("Attendance",att.name,'ot_hours',wh)

@frappe.whitelist()
def mark_att():
    to_date = today()
    from_date = add_days(to_date,-1)
    # to_date = today()
    # from_date= get_first_day(today())
    admin_office_checkins = frappe.db.sql(""" select * from `tabEmployee Checkin` where date(time) between '%s' and '%s' and device_id in ('ADMIN OFFICE','Admin Office out') order by time"""%(from_date,to_date),as_dict = 1)
    checkins = frappe.db.sql("""select * from `tabEmployee Checkin` where date(time) between '%s' and '%s' order by time """%(from_date,to_date),as_dict=True) 
    attendance = frappe.db.sql("""select name,employee,shift,in_time,out_time,attendance_date,ot_hours from `tabAttendance` where docstatus != 2  and attendance_date between '%s' and '%s' """ % (from_date,to_date),as_dict=1)

    if checkins:
        date = checkins[0].time
        from_date = datetime.strftime(date,'%Y-%m-%d')
        
        for c in checkins:
            mark_attendance_from_checkin(c.name,c.employee,c.time,c.device_id)
      
    if admin_office_checkins:
        for c in admin_office_checkins:
            mark_admin_office_from_checkin(c.name,c.employee,c.time)
      
            
def mark_admin_office_from_checkin(checkin,employee,time):
    att_time = time.time()
    att_date = time.date()
    doj = frappe.get_value('Employee',employee,'date_of_joining')
    if att_date > doj: 
        in_time = ''
        out_time = ''
        checkins = frappe.db.sql(""" select name,time from `tabEmployee Checkin` where employee = '%s' and date(time)  = '%s' order by time """%(employee,att_date),as_dict=True)
        if checkins:
            if len(checkins) >= 2:
                in_time = checkins[0].time
                out_time = checkins[-1].time
            elif len(checkins) == 1:
                in_time = checkins[0].time
                out_time = checkins[-1].time
            attn = frappe.db.exists('Attendance',{'employee':employee,'attendance_date':att_date,'docstatus':0})
            if in_time:
                status = 'Present'
            else:
                status = 'Absent'
            if not attn:
                att = frappe.new_doc('Attendance')
                att.employee = employee
                att.attendance_date = att_date
                att.status = status
                att.shift = 'Office Shift A'
                att.in_time = in_time
                att.out_time = out_time
                att.save(ignore_permissions=True)
                frappe.db.commit()
            else:
                if in_time:
                    frappe.db.set_value('Attendance',attn,'in_time',in_time)
                if out_time:
                    frappe.db.set_value('Attendance',attn,'out_time',out_time)
                frappe.db.set_value("Attendance",attn,'shift','Office Shift A')
                frappe.db.set_value("Attendance",attn,'status',status)
            for c in checkins:
                print(c)
                frappe.db.set_value("Employee Checkin",c.name,"skip_auto_attendance",'1')
                frappe.db.set_value("Employee Checkin",c.name,"attendance",attn)



def mark_attendance_from_checkin(checkin,employee,time,device):
    att_time = time.time()
    att_date = time.date()      
    doj = frappe.get_value('Employee',employee,'date_of_joining')
    if att_date > doj: 
        if device in ['ZONE 1 IN','ZONE 2 IN']:
            if datetime.strptime('05:30:00','%H:%M:%S').time() < att_time < datetime.strptime('10:30:00','%H:%M:%S').time():
                shift ='A'
                attendance = frappe.db.exists('Attendance',{'employee':employee,'attendance_date':att_date,'docstatus':('!=','2')})        
                if not attendance:          
                    att = frappe.new_doc('Attendance')
                    att.employee = employee
                    att.attendance_date = att_date
                    att.status = 'Present'
                    att.shift = 'A'
                    att.in_time = time
                    att.total_wh = ''
                    att.late_hours = ''
                    att.save(ignore_permissions=True)
                    frappe.db.commit()
                    frappe.db.set_value("Employee Checkin",checkin, "attendance", att.name)
                    frappe.db.set_value('Employee Checkin',checkin,'skip_auto_attendance','1') 
                    return att
            elif datetime.strptime('16:30:00','%H:%M:%S').time() < att_time < datetime.strptime('22:30:00','%H:%M:%S').time():
                shift ='B'
                current_day = frappe.db.exists('Attendance',{'employee':employee,'attendance_date':att_date,'docstatus':('!=','2')})
                
                if not current_day:          
                    att = frappe.new_doc('Attendance')
                    att.employee = employee
                    att.attendance_date = att_date
                    att.status = 'Present'
                    att.shift = 'B'
                    att.in_time = time
                    att.total_wh = ''
                    att.late_hours = ''
                    att.save(ignore_permissions=True)
                    frappe.db.commit()
                    frappe.db.set_value("Employee Checkin",checkin, "attendance", att.name)
                    frappe.db.set_value('Employee Checkin',checkin,'skip_auto_attendance','1') 
                    return att
            else:    
                current_day = frappe.db.exists('Attendance',{'employee':employee,'attendance_date':att_date,'docstatus':('!=','2')})
                if not current_day:
                    att = frappe.new_doc('Attendance')
                    att.employee = employee
                    att.attendance_date = att_date
                    att.status = 'Present'
                    att.shift = 'X'
                    att.in_time = time
                    att.total_wh = ''
                    att.late_hours = ''
                    att.save(ignore_permissions=True)
                    frappe.db.commit()

                    frappe.db.set_value("Employee Checkin",checkin, "attendance", att.name)
                    frappe.db.set_value('Employee Checkin',checkin,'skip_auto_attendance','1') 
                    return att

        if device in ['ZONE 1 OUT','ZONE 2 OUT']:
            max_out = datetime.strptime('11:30:00', '%H:%M:%S').time()
            
            if att_time < max_out:
                yesterday = add_days(att_date,-1)
                checkins = frappe.db.sql("select name,time from `tabEmployee Checkin` where employee = '%s' and device_id in ('ZONE 1 OUT','ZONE 2 OUT') and date(time) = '%s' and time(time) < '%s' order by time "%(employee,att_date,max_out),as_dict=True)            
                att = frappe.db.exists("Attendance",{'employee':employee,'attendance_date':yesterday})
                if att:
                    att = frappe.get_doc("Attendance",att)
                    if att.docstatus == 0:
                        if not att.out_time:
                            if len(checkins) > 0:
                                att.out_time = checkins[-1].time
                            else:
                                att.out_time = checkins[-1].time
                            att.save(ignore_permissions=True)
                            frappe.db.commit()
                            frappe.db.set_value("Employee Checkin",checkins[0].name, "attendance", att.name)
                            return att
                        else:
                            return att
                else:
                    att = frappe.new_doc("Attendance")
                    att.employee = employee
                    att.attendance_date = yesterday
                    att.status = 'Absent'
                    if len(checkins) > 0:
                        att.out_time = checkins[-1].time
                    else:
                        att.out_time = checkins[-1].time
                    att.save(ignore_permissions=True)
                    frappe.db.commit()
                    frappe.db.set_value("Employee Checkin",checkins[0].name, "attendance", att.name)
                    return att
            else:
                checkins = frappe.db.sql("select name,time,docstatus from `tabEmployee Checkin` where employee ='%s' and device_id in ('ZONE 1 OUT','ZONE 2 OUT') and date(time) = '%s' order by time "%(employee,att_date),as_dict=True)
                att = frappe.db.exists("Attendance",{'employee':employee,'attendance_date':att_date})
                if att:
                    att = frappe.get_doc("Attendance",att)
                    if att.docstatus == 0:
                        if not att.out_time:
                            if len(checkins) > 0:
                                att.out_time = checkins[-1].time
                            else:
                                att.out_time = checkins[-1].time
                            att.save(ignore_permissions=True)
                            frappe.db.commit()
                            frappe.db.set_value("Employee Checkin",checkins[0].name, "attendance", att.name)
                            return att
                        else:
                            return att
                else:
                    att = frappe.new_doc("Attendance")
                    att.employee = employee
                    att.attendance_date = att_date
                    att.status = 'Absent'
                    if len(checkins) > 0:
                        att.out_time = checkins[-1].time
                    else:
                        att.out_time = checkins[-1].time
                    att.save(ignore_permissions=True)
                    frappe.db.commit()
                    frappe.db.set_value("Employee Checkin",checkins[0].name, "attendance", att.name)
                    return att       


def get_dates(from_date,to_date):
    no_of_days = date_diff(add_days(to_date, 1), from_date)
    dates = [add_days(from_date, i) for i in range(0, no_of_days)]
    return dates

def mark_absent_employee():
    # to_date = '2022-09-30'
    # from_date= '2022-09-01'
    to_date = today()
    from_date = add_days(to_date,-1)
    employee = frappe.db.sql("""select * from `tabEmployee` where status = 'Active'""",as_dict =1)
    for emp in employee:
        dates = get_dates(from_date,to_date)
        # dates = get_dates(yesterday,att_date)
        for date in dates:
            date = datetime.strptime(date,'%Y-%m-%d')
            day = date.date()
            emp_doj = frappe.get_value('Employee',emp.name,'date_of_joining')
            if day >= emp_doj:
                emp_holiday_list = frappe.get_value('Employee',emp.name,'holiday_list')
                holiday = frappe.db.sql("""select `tabHoliday`.holiday_date,`tabHoliday`.weekly_off from `tabHoliday List` 
                left join `tabHoliday` on `tabHoliday`.parent = `tabHoliday List`.name where `tabHoliday List`.name = '%s' and holiday_date = '%s' """%(emp_holiday_list,day),as_dict=True)
                if not holiday:
                    att = frappe.db.exists("Attendance",{'employee':emp.name,'attendance_date':day})
                    if not att:
                        att_doc = frappe.new_doc('Attendance')
                        att_doc.employee = emp.name
                        att_doc.attendance_date = day
                        att_doc.status = 'Absent'
                        att_doc.save(ignore_permissions=True)
                        # att_doc.submit()
                        # frappe.db.commit()


def mark_ot():
    to_date = '2022-10-31'
    from_date = '2022-10-01'
    attendance = frappe.db.sql("""select name,employee,shift,in_time,out_time,attendance_date,ot_hours,grade from `tabAttendance` where docstatus != 2  and attendance_date between '%s' and '%s' """ % (from_date,to_date),as_dict=1)
    for att in attendance:
        if att.in_time and att.out_time:
            if att.grade != 'Office Staff':
                hh = check_holiday(att.attendance_date,att.employee)
                if hh:
                    if hh == 'HH':   
                        total_wh = att.out_time - att.in_time  
                        diff =total_wh.total_seconds()           
                        wh = round(diff/3600)
                        if wh > 11 :
                            wh = 11
                            frappe.db.set_value("Attendance",att.name,'holiday_ot',wh)
                        else:
                            frappe.db.set_value("Attendance",att.name,'holiday_ot',wh)
                
                    elif hh == 'WW':
                        total_wh = att.out_time - att.in_time  
                        diff =total_wh.total_seconds()           
                        wh = round(diff/3600)
                        if wh > 11:
                            wh = 11
                            frappe.db.set_value("Attendance",att.name,'week_end_ot',wh)
                        else:
                            frappe.db.set_value("Attendance",att.name,'week_end_ot',wh)
                else:
                    total_wh = att.out_time - att.in_time  
                    diff =total_wh.total_seconds() 
                    print(diff)          
                    wh = round(diff/3600)-(9)
                    print(wh)
                    if wh <=3 and wh > 0:
                        print(wh)
                        frappe.db.set_value("Attendance",att.name,'ot_hours',wh)
                        print('three')   
                    if wh > 3:
                        wh = 3
                        frappe.db.set_value("Attendance",att.name,'ot_hours',wh)

def create_hooks():
    job = frappe.db.exists('Scheduled Job Type', 'missed_punch_alert')
    if not job:
        sjt = frappe.new_doc("Scheduled Job Type")
        sjt.update({
            "method": 'qpic.email_alerts.missed_punch_alert',
            "frequency": 'Cron',
            "cron_format": '00 11 * * *'
        })
        sjt.save(ignore_permissions=True)

def check_holiday(date,employee):
    holiday_list = frappe.db.get_value('Employee',{'employee':employee},'holiday_list')
    holiday = frappe.db.sql("""select `tabHoliday`.holiday_date,`tabHoliday`.weekly_off from `tabHoliday List` 
    left join `tabHoliday` on `tabHoliday`.parent = `tabHoliday List`.name where `tabHoliday List`.name = '%s' and holiday_date = '%s' """%(holiday_list,date),as_dict=True)
    if holiday:
        print(holiday)
        if holiday[0].weekly_off == 1:
            return "WW"
        else:
            return "HH"
    
    
    
    