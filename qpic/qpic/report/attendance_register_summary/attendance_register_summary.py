# Copyright (c) 2022, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
from functools import total_ordering
from itertools import count
import frappe
from frappe import permissions
from frappe.utils import cstr, cint, getdate, get_last_day, get_first_day, add_days
from frappe.utils import cstr, add_days, date_diff, getdate, format_date
from math import floor
from frappe import msgprint, _
from calendar import month, monthrange
from datetime import date, timedelta, datetime,time
from numpy import true_divide

import pandas as pd

status_map = {
    'Permission Request' :'PR',
    'On Duty':'OD',
    'Half Day':'HD',
    "Absent": "A",
	"Half Day": "HD",
	"Holiday": "HH",
	"Weekly Off": "WW",
    "Present": "P",
    "None" : "",
    "Leave Without Pay": "LOP",
    "Casual Leave": "CL",
    "Earned Leave": "EL",
    "Sick Leave": "SL",
    "Emergency -1": 'EML-1',
    "Emergency -2": 'EML-2',
    "Paternal Leave": 'PL',
    "Marriage Leave":'ML',
    "Paternity Leave":'PTL',
    "Education Leave":'EL',
    "Maternity Leave":'MTL',
    "Covid -19": "COV-19",
    "Privilege Leave": "PVL",
    "Compensatory Off": "C-OFF",
    "BEREAVEMENT LEAVE":'BL'
}
def execute(filters=None):
    columns = get_columns(filters)
    data = get_data(filters)
    return columns, data

def get_columns(filters):
    columns = []
    columns += [
        _("Employee ID") + ":Data/:150",_("Employee Name") + ":Data/:200",_("Department") + ":Data/:150",_("Grade") + ":Data/:150",_("DOJ") + ":Date/:100",_("") + ":Data/:150",
    ]
    dates = get_dates(filters.from_date,filters.to_date)
    for date in dates:
        date = datetime.strptime(date,'%Y-%m-%d')
        day = datetime.date(date).strftime('%d')
        month = datetime.date(date).strftime('%b')
        columns.append(_(day + '/' + month) + ":Data/:70")
    columns.append(_("Present") + ":Data/:100")
    columns.append(_('Half Day') +':Data/:100')
    columns.append(_('On Duty') + ':Data/:100')
    # columns.append(_('Permission') + ':Data/:100')
    columns.append(_("Absent") + ":Data/:100")
    columns.append(_('Weekoff')+ ':Data/:100')
    columns.append(_('Holiday')+ ':Data/:100')
    columns.append(_('Paid Leave')+ ':Data/:150')
    columns.append(_('LOP')+ ':Data/:150')
    columns.append(_('OT Hours')+ ':Data/:100')
    columns.append(_('WOT')+ ':Data/:100')
    columns.append(_('HOT')+ ':Data/:100')
    columns.append(_('Total Payment Days')+ ':Data/:100')
    # columns.append(_('Late')+ ':Data/:100')
    # columns.append(_('Late Deduct')+ ':Data/:150')
    # columns.append(_('Permission Hours')+ ':Data/:150')
    # columns.append(_('Night Shift')+ ':Data/:150')
    
    return columns

def get_data(filters):
    data = []
    emp_status_map = []
    employees = get_employees(filters)
    for emp in employees:
        dates = get_dates(filters.from_date,filters.to_date)
        row1 = [emp.name,emp.employee_name,emp.department,emp.grade,emp.date_of_joining,"Status"]
        row2 = ["","","","","","In Time"]
        row3 = ["","","","","","Out Time"]
        row4 = ["","","","","","Shift"]
        total_present = 0
        total_half_day = 0
        total_absent = 0
        total_holiday = 0
        total_weekoff = 0
        total_ot = 0
        total_wot =0
        total_hot =0
        total_od = 0
        # total_permission = 0
        total_lop = 0
        total_paid_leave = 0
        total_combo_off = 0
        c_shift = 0
        # total_late = pd.to_datetime('00:00:00').time()
        total_late = timedelta(0,0,0)
        total_late_deduct = timedelta(0,0)
        ww = 0
        twh = 0
        ot = 0
        total_days = 0
        
        for date in dates:
            att = frappe.db.get_value("Attendance",{'attendance_date':date,'employee':emp.name},['status','in_time','out_time','shift','employee','attendance_date','name','ot_hours','week_end_ot','holiday_ot','absent_on_holiday','leave_type']) or ''
            if att:
                status = status_map.get(att[0], "")
                # if att[0]:
                #     hh = check_holiday(date,emp.name)
                #     if hh:
                #         if hh == 'WW':
                #             total_weekoff +=1
                #         elif hh == 'HH':
                #             total_holiday +=1   
                #         row1.append(hh)
                #     else:    
                #         row1.append('OD')
                #         total_od = total_od + 1  
                # elif att[10]:
                #     hh = check_holiday(date,emp.name)
                #     if hh:
                #         if hh == 'WW':
                #             total_weekoff +=1
                #         elif hh == 'HH':
                #             total_holiday +=1   
                #         row1.append(hh)
                #     else:      
                #         row1.append('P/P')
                #         total_present +=  1
                #         total_permission += 1

                if att[7]:
                    total_ot =total_ot + int(att[7])
                
                if att[8]:
                    total_wot = total_wot + int(att[8])

                if att[9]:
                    total_hot = total_hot + int(att[9])





                    
                if status == 'P':
                    # doj = frappe.db.get_value("Employee",{'name':emp},'date_of_joining')
                    
                    hh = check_holiday(date,emp.name)
                
                    if hh :
                        if hh == 'WW':
                            total_weekoff +=1
                        elif hh == 'HH':
                            total_holiday +=1
                          
                        row1.append(hh )   
                    else:  
                        row1.append(status)
                        total_present = total_present + 1  
                        

                    
                # elif status == 'HD':
                #     # doj=  frappe.db.get_value("Employee",{'name':emp},'date_of_joining')
                    
                #     hh = check_holiday(date,emp.name)
                
                #     if hh  :
                #         if hh == 'WW':
                #             total_weekoff += 1
                #         elif hh == 'HH':
                #             total_holiday += 1
                #         else:
                #             hh= "-"
                #         row1.append(hh)
                    
                    # else:
                    #     if att[11]:
                    #         row1.append('P/L')
                    #         total_present = total_present + 0.5
                    #         total_paid_leave = total_paid_leave + 0.5
                    #     else:
                    #         row1.append('P/A')
                    #         total_present = total_present + 0.5
                    #         total_half_day = total_half_day + 0.5
                elif status == 'A':
                    # doj= frappe.db.get_value("Employee",{'name':emp},'date_of_joining')
                    if not att[10]:
                        hh = check_holiday(date,emp.name)
                        # if doj > date:
                        if hh:
                            if hh == 'WW':
                                total_weekoff += 1
                            elif hh == 'HH':
                                total_holiday += 1
                            
                            row1.append(hh)
                        else: 
                            row1.append(status or '-')
                            total_absent = total_absent + 1 
                    else: 
                        row1.append('-')
                        total_absent = total_absent + 1 
                                          
                elif att[11]:
                    hh = check_holiday(date,emp.name)
                    if hh:
                        if hh == 'WW':
                            total_weekoff += 1
                        elif hh == 'HH':
                            total_holiday += 1
                        row1.append(hh)
                    else:    
                        status = status_map.get(att[11], "")
                        if status != 'LOP':
                            if status == 'C-OFF':
                                total_combo_off += 1
                            else:
                                total_paid_leave += 1
                        else:                        
                            total_lop += 1
                        row1.append(status)
                else:
                    row1.append('-')
                if att[1] is not None and att[0] != 'Absent':
                    row2.append(att[1].strftime('%H:%M'))
                else:
                    row2.append('-')
                if att[2] is not None:
                    row3.append(att[2].strftime('%H:%M'))
                else:
                    row3.append('-')
                
                if att[3]:
                    row4.append(att[3])
                else:
                    row4.append('-')

                if att[3] == 'C':
                    c_shift += 1   

                # This is the Late Hours Condition    
                # if att[2]:
                #     hh = check_holiday(date,emp.name)
                #     if hh:
                #         if hh == 'WW':
                #             total_weekoff += 1
                #         elif hh == 'HH':
                #             total_holiday += 1
                #         row5.append('-')    
                #     else:    
                #         late = datetime.strptime(str(att[2]),'%H:%M:%S').strftime('%H:%M:%S')
                #         row5.append(late)
                #         total_late = total_late + att[2]
                # else:
                #     row5.append('-')

                # This is the Late Deduct condition        
                # if att[16]:
                #     hh = check_holiday(date,emp.name)
                #     if hh:
                #         if hh == 'WW':
                #             total_weekoff += 1
                #         elif hh == 'HH':
                #             total_holiday += 1
                #         row6.append('-')
                #     else:
                #         str_time = datetime.strptime(att[16],'%H:%M').time()
                #         time_time_delta = timedelta(hours=str_time.hour,minutes=str_time.minute,seconds=0)
                #         row6.append(att[16]) 
                #         #late_deduct column to add_time
                #         total_late_deduct = total_late_deduct + time_time_delta
                    
                # else:
                #     row6.append('-')      

                # if att[7] is not None and att[0] != 'Absent':
                #     hh = att[7].seconds//3600
                #     mm = (att[7].seconds//60)%60
                #     twh = str(hh) + ":" + str(mm)
                #     row7.append(twh) 
                # else:
                #     row7.append('-')    

                # if att[5]:    
                #     row8.append(att[5])
                #     total_ot += att[5]
                # else:
                #     row8.append('-')
                                 
            else:
                # frappe.errprint('No Present')
                # doj =frappe.db.get_value("Employee",{'name':emp},'date_of_joining')
                hh = check_holiday(date,emp.name)
                frappe.errprint(hh)
                if hh :
                    if hh == 'WW': 
                        total_weekoff += 1
                    elif hh == 'HH':
                        total_holiday += 1
                    # else:
                    #     hh = '-'
                    row1.append(hh)
                else:
                    row1.append('-')
                

                row2.append('-')
                row3.append('-')
                row4.append('-')
                
        total_days = total_present+total_holiday+total_weekoff+total_paid_leave
        # permission_hours = frappe.db.sql("""select sum(hours) as sum from `tabPermission Request` where permission_date between '%s' and '%s' and employee_id = '%s' and docstatus = '1' """%(filters.from_date,filters.to_date,emp.name),as_dict=True)[0].sum or 0
        row1.extend([total_present,total_half_day,total_od,total_absent,total_weekoff,total_holiday,total_paid_leave,total_lop,total_ot,total_wot,total_hot,total_days or ""])
        row2.extend(['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'])
        row3.extend(['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'])
        row4.extend(['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'])
        



        data.append(row1)
        data.append(row2)
        data.append(row3)
        data.append(row4)
        
    return data

def get_dates(from_date,to_date):
    no_of_days = date_diff(add_days(to_date, 1), from_date)
    dates = [add_days(from_date, i) for i in range(0, no_of_days)]
    return dates

def get_employees(filters):
    conditions = ''
    # if filters.department:
    #     conditions += "and department = '%s' " % filters.department
    # if filters.employee_type:
    #     conditions += "and employee_type = '%s' "%filters.employee_type
    left_employees = []
    if filters.employee:
        conditions += "and employee = '%s' " % (filters.employee)
    if filters.grade:
        conditions += "and grade = '%s' " % (filters.grade)  
    if filters.department:
        conditions += "and department = '%s' " % (filters.department)      

    employees = frappe.db.sql("""select name, employee_name, department,grade,date_of_joining,holiday_list from `tabEmployee` where status = 'Active' %s order by department  """ % (conditions), as_dict=True)
    left_employees = frappe.db.sql("""select name, employee_name, department, date_of_joining from `tabEmployee` where status = 'Left' and relieving_date >= '%s' %s order by department """ %(filters.from_date,conditions),as_dict=True)
    employees.extend(left_employees)
    return employees
  
@frappe.whitelist()
def get_to_date(from_date):
    day = from_date[-2:]
    if int(day) > 21:
        d = add_days(get_last_day(from_date),21)
        return d
    if int(day) <= 21:
        d = add_days(get_first_day(from_date),21)
        return d

def check_holiday(date,emp):

    holiday_list = frappe.db.get_value('Employee',{'name':emp},'holiday_list')
    holiday = frappe.db.sql("""select `tabHoliday`.holiday_date,`tabHoliday`.weekly_off from `tabHoliday List` 
    left join `tabHoliday` on `tabHoliday`.parent = `tabHoliday List`.name where `tabHoliday List`.name = '%s' and holiday_date = '%s' """%(holiday_list,date),as_dict=True)
    doj= frappe.db.get_value("Employee",{'name':emp},"date_of_joining")
    status = ''
    if holiday :
        frappe.errprint(doj)
        frappe.errprint( holiday[0].holiday_date)
        if doj < holiday[0].holiday_date:
            if holiday[0].weekly_off == 1:
                status = "WW"
            # elif holiday[0].att == 1:
            #     return 'C-OFF'         
            else:
                status = "HH"
        else:
            status = 'Not Joined'
    return status
    




