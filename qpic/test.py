from itertools import zip_longest
from time import strptime
import frappe
import json
import datetime
from frappe.utils.csvutils import read_csv_content
from six.moves import range
from six import string_types
from frappe.utils import (getdate, cint, add_months, date_diff, add_days,
                          nowdate, get_datetime_str, cstr, get_datetime, now_datetime, format_datetime)
from datetime import datetime
from calendar import c, monthrange
from frappe import _, msgprint
from frappe.utils import flt
from frappe.utils import cstr, cint, getdate, get_first_day, get_last_day, today, time_diff_in_hours
import requests
from datetime import date, timedelta, time
from frappe.utils.background_jobs import enqueue
from frappe.utils import get_url_to_form


@frappe.whitelist()
def mark_att():
    # from_date = add_days(today(),-1)
    # to_date = today()
    from_date = '2022-07-01'
    to_date = '2022-07-31'
    admin_office_checkins = frappe.db.sql(""" select * from `tabEmployee Checkin` where date(time) between '%s' and '%s' and device_id in ('ADMIN OFFICE','Admin Office out') order by time"""%(from_date,to_date),as_dict = 1)
    # zone_checkins = frappe.db.sql(""" select *  from `tabEmployee Checkin` where skip_auto_attendance = 0 and date(time) between '%s' and '%s' and employee= '1593' and device_id != 'ADMIN OFFICE'  order by time """ % (from_date, to_date), as_dict=1)
    
    if admin_office_checkins:
        # print(admin_office_checkins)

        for c in admin_office_checkins:
            mark_admin_office_from_checkin(c.name,c.employee,c.time)
    # if zone_checkins:
    #     # print(zone_checkins)
        
    #     for c in zone_checkins:
    #         # print(c.device_id)
    #         mark_zone_checkin(c.name, c.employee, c.time,c.device_id)


def mark_admin_office_from_checkin(checkin,employee,time):
    att_time = time.time()
    att_date = time.date()
    in_time = ''
    out_time = ''
    checkins = frappe.db.sql(""" select name,time from `tabEmployee Checkin` where employee = '%s' and date(time)  = '%s' order by time """%(employee,att_date),as_dict=True)
    if checkins:
        # print(checkins)
        if len(checkins) >= 2:
            in_time = checkins[0].time
            out_time = checkins[-1].time
        elif len(checkins) == 1:
            in_time = checkins[0].time
            out_time = checkins[-1].time
        attn = frappe.db.exists('Attendance',{'employee':employee,'attendance_date':att_date,'docstatus':0})
        # print(attn)
        if in_time:
            status = 'Present'
        else:
            status = 'Absent'
        if not attn:
            # print(attn)
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


def mark_zone_checkin(checkin, employee, time,device_id):
    att_time = time.time()
    att_date = time.date()

    
    if datetime.strptime('04:45:00', '%H:%M:%S').time() < att_time < datetime.strptime('09:45:00', '%H:%M:%S').time():
        checkins = frappe.db.sql(""" select name,time from `tabEmployee Checkin` where employee = '%s' and date(time)  = '%s' order by time """%(employee,att_date),as_dict=True)
        print('bro')
        print(checkins[-1])
        if checkins:
            print(checkins)
            if len(checkins) >= 2:
                in_time = checkins[0].time
                
            elif len(checkins) == 1:
                in_time = checkins[0].time
            if in_time:
                status = 'Present'
            else:
                status= 'Absent'
            print(status)
            
        shift =''
        # out_time=''
        current_day = frappe.db.exists('Attendance', {'employee': employee, 'attendance_date': att_date, 'docstatus': 0})
        if not current_day:
            # print(status)

            att = frappe.new_doc('Attendance')
            att.employee = employee
            att.attendance_date = att_date
            att.status = status
            att.shift = 'A'
            att.in_time = in_time
            att.out_time = ''
            att.save(ignore_permissions=True)
            frappe.db.commit()
            frappe.db.set_value('Employee Checkin', checkins[-1],'skip_auto_attendance', '1')
            frappe.db.set_value('Employee Checkin', checkins[-1],'attendance', att.name)
            return att
        
        
    if datetime.strptime('16:45:00','%H:%M:%S').time() < att_time <  datetime.strptime('23:59:00','%H:%M:%S').time(): 
        checkins = frappe.db.sql(""" select name,time from `tabEmployee Checkin` where employee = '%s' and date(time)  = '%s' order by time """%(employee,att_date),as_dict=True)
        print('ki')
        print(checkins)
        # print(status)
        shift =''
        current_day = frappe.db.exists('Attendance', {'employee': employee, 'attendance_date': att_date, 'docstatus': 0})
      
        if current_day:
            att =frappe.get_doc('Attendance',current_day)
            if not att.out_time:
                if len(checkins) > 0:
                    att.out_time = checkins[-1].time
                    print(checkins[-1])
                else:
                    att.out_time = checkins[-1].time
                att.save(ignore_permissions=True)
                frappe.db.commit()
                frappe.db.set_value("Employee Checkin",checkins[-1].name, "attendance", att.name)
                frappe.db.set_value('Employee Checkin', checkins[-1].name,'skip_auto_attendance', '1')
                return att
            else:
                print('hi')
                return att
    #     #no need below
        # else:
        #     att = frappe.new_doc("Attendance")
        #     att.employee = employee    
        #     att.attendance_date = att_date
        #     att.status = 'Absent'
        #     if len(checkins) > 0:
        #         att.out_time = checkins[0].time
        #     else:
        #         att.out_time = checkins[0].time
        #     att.save(ignore_permissions=True)
        #     frappe.db.commit()
        #     frappe.db.set_value("Employee Checkin",checkins[0].name, "attendance", att.name)
        #     frappe.db.set_value('Employee Checkin', checkins[0].name,'skip_auto_attendance', '1')

        #     return att
        

            
    if datetime.strptime('16:45:00', '%H:%M:%S').time() < att_time < datetime.strptime('21:30:00', '%H:%M:%S').time():
        checkins = frappe.db.sql(""" select name,time from `tabEmployee Checkin` where employee = '%s' and date(time)  = '%s' order by time """%(employee,att_date),as_dict=True)
        print(checkins)
        
        if checkins:
            print(checkins)
            if len(checkins) >= 2:
                in_time = checkins[0].time
                
            elif len(checkins) == 1:
                in_time = checkins[0].time
            
            if in_time:
                status = 'Present'
            else:
                status ='Absent'
            print(status)

        shift =''
        # yesterday = add_days(att_date,-1)

        current_day = frappe.db.exists('Attendance', {'employee': employee, 'attendance_date': att_date, 'docstatus': 0})
        print(current_day)
        if not current_day:
            att = frappe.new_doc('Attendance')
            att.employee = employee
            att.attendance_date = att_date
            att.status = status
            att.shift = 'B'
            att.in_time = time
            att.out_time = ''
            att.save(ignore_permissions=True)
            frappe.db.commit()
            frappe.db.set_value('Employee Checkin', checkin,'skip_auto_attendance', '1')
            frappe.db.set_value('Employee Checkin', checkin,'attendance', att.name)
            return att

            
    if datetime.strptime('05:45:00','%H:%M:%S').time() < att_time <  datetime.strptime('09:30:00','%H:%M:%S').time(): 
        checkins = frappe.db.sql(""" select name,time from `tabEmployee Checkin` where device_id != 'ADMIN OFFICE' and employee = '%s' and date(time)  = '%s' order by time """%(employee,att_date),as_dict=True)
        # if checkins:

        #     if len(checkins) >= 2:
        #         in_time = checkins[0].time
        #         out_time = checkins[-1].time
        #     elif len(checkins) == 1:
        #         in_time = checkins[0].time
        #     if in_time:
        #         status = 'Present'
        #     else:
        #         status = 'Absent'
        yesterday = add_days(att_date,-1)
        att = frappe.db.exists("Attendance",{'employee':employee,'attendance_date':yesterday})
        if att:    
            att =frappe.get_doc('Attendance',att)            
            if not att.out_time:
                if len(checkins) > 0:
                    att.out_time = checkins[-1].time
                   
                else: 
                    att.out_time = checkins[-1].time
                att.save(ignore_permissions=True)
                frappe.db.commit()
                frappe.db.set_value('Employee Checkin', checkins[-1].name,'skip_auto_attendance', '1')   
                frappe.db.set_value("Employee Checkin",checkins[-1].name, "attendance", att.name)
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
            frappe.db.set_value("Employee Checkin",checkins[-1].name, "attendance", att.name)
            frappe.db.set_value('Employee Checkin', checkins[-1].name,'skip_auto_attendance', '1')

            return att

def mark_ot():
    from_date = '2022-07-01'
    to_date = '2022-08-01'
    attendance = frappe.db.sql(""" 
                    select name,employee,shift,in_time,out_time,attendance_date,ot_hours from `tabAttendance` where docstatus != 2  and attendance_date between '%s' and '%s' """ % (from_date,to_date),as_dict=1)
    for att in attendance:
        print(att.attendance_date)
        if att.in_time and att.out_time:
            
            hh = check_holiday(att.attendance_date,att.employee)
            # print(hh)
            if hh:
                # print(hh)
                if hh == 'HH':   
                    total_wh = att.out_time - att.in_time  
                    # print(total_wh)
                    diff =total_wh.total_seconds()           
                    wh = round(diff/3600)
                    # print(wh)
                    if wh > 11 :
                        wh = 11
                        frappe.db.set_value("Attendance",att.name,'holiday_ot',wh)
                    else:
                        frappe.db.set_value("Attendance",att.name,'holiday_ot',wh)

                        # print('one')
            
                elif hh == 'WW':
                    # print('li')
                    total_wh = att.out_time - att.in_time  
                    diff =total_wh.total_seconds()           
                    wh = round(diff/3600)
                    # print(wh)
                    if wh > 11:
                        wh = 11
                        # print('two')
                        frappe.db.set_value("Attendance",att.name,'week_end_ot',wh)
                    else:
                        frappe.db.set_value("Attendance",att.name,'week_end_ot',wh)
            else:
                # print('hh')
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



def check_holiday(date,employee):
    holiday_list = frappe.db.get_value('Employee',{'employee':employee},'holiday_list')
    # print(holiday_list)
    # print(date)
    # print(employee)
    holiday = frappe.db.sql("""select `tabHoliday`.holiday_date,`tabHoliday`.weekly_off from `tabHoliday List` 
    left join `tabHoliday` on `tabHoliday`.parent = `tabHoliday List`.name where `tabHoliday List`.name = '%s' and holiday_date = '%s' """%(holiday_list,date),as_dict=True)
    if holiday:
        print(holiday)
        if holiday[0].weekly_off == 1:
            return "WW"
        else:
            return "HH"