# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import cstr, add_days, date_diff,format_datetime
from datetime import date, timedelta, datetime, time
class AttendanceSummary(Document):
    pass

@frappe.whitelist()
def get_data_system(emp,from_date,to_date):
    
    no_of_days = date_diff(add_days(to_date, 1), from_date)
    dates = [add_days(from_date, i) for i in range(0, no_of_days)]

    emp_details = frappe.db.get_value('Employee',emp,['employee_name','department'])

    data = "<table class='table table-bordered=1'>"
    data += "<tr><td style = 'border: 1px solid black;background-color:#ffedcc'><b>ID</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'><b>%s</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'><b>Name</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'><b>%s</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'><b>Dept</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'colspan=2><b>%s</b></td></tr>"%(emp,emp_details[0],emp_details[1])
    # data += "<tr><td style = 'border: 1px solid black;'><b>Attendance</b></td><td style = 'border: 1px solid black;'><b><center>Total Hours</center></b></td><tr>"
    data += "<tr><td style = 'border: 1px solid black;background-color:#ffedcc'><b>Date</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'><b>Day</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'><b>Working</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'><b>In Time</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'><b>Out Time</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'><b>Status</b></td><td style = 'border: 1px solid black;background-color:#ffedcc;'><b><center>OT Hours</center></b></td></tr>"

    for date in dates:
        dt = datetime.strptime(date,'%Y-%m-%d')
        d = dt.strftime('%d-%b')
        day = datetime.date(dt).strftime('%a')
        holiday  = check_holiday(date)
        in_time = frappe.db.get_value('Attendance' ,{'employee':emp,"attendance_date":date},'in_time') or ''
        out_time = frappe.db.get_value('Attendance' ,{'employee':emp,"attendance_date":date},'out_time') or ''
        status_format = get_status(emp,date) 
        ot_hrs = frappe.db.get_value('Attendance',{'attendance_date':date,'employee':emp},['ot_hours'])or ''

        data += "<tr><td style = 'border: 1px solid black;'>%s</td><td style = 'border: 1px solid black;'>%s</td><td style = 'border: 1px solid black;'>%s</td><td style = 'border: 1px solid black;'>%s</td><td style = 'border: 1px solid black;'>%s</td><td style = 'border: 1px solid black;'>%s</td><td style = 'border: 1px solid black;'>%s</td></tr>"%(d,day,holiday or 'W',(format_datetime(in_time)) or '',(format_datetime(out_time)) or '',status_format,ot_hrs)
    data += "</table>"
    return data

def check_holiday(date):
    holiday_list = frappe.db.get_value('Company','Qatar Polymer Industrial Company','default_holiday_list')
    holiday = frappe.db.sql("""select `tabHoliday`.holiday_date,`tabHoliday`.weekly_off from `tabHoliday List` 
    left join `tabHoliday` on `tabHoliday`.parent = `tabHoliday List`.name where `tabHoliday List`.name = '%s' and holiday_date = '%s' """%(holiday_list,date),as_dict=True)
    if holiday:
        if holiday[0].weekly_off == 1:
            return "WW"
        else:
            return "HH"

def get_status(emp,date):
    status = ''
    if frappe.db.exists('Attendance',{'employee':emp,'attendance_date':date,'docstatus':['!=','2']}):
        att = frappe.db.get_value('Attendance',{'employee':emp,'attendance_date':date,'docstatus':['!=','2']},['status']) or ''
        if att:
            if att == 'Present':
                hh = check_holiday(date)
                if hh:
                    if hh == 'WW':
                       status = "WW"
                    else:
                        hh == 'HH'
                        status = "HH"  
                else:
                    status = "P"
            elif att == "Absent":
                hh = check_holiday(date)
                if hh:
                    if hh == 'WW':
                       status = "WW"
                    else:
                        hh == 'HH' 
                else:
                    status = "A"
            elif att == "Half Day":
                hh = check_holiday(date)
                if hh:
                    if hh == 'WW':
                       status = "WW"
                    else:
                        hh == 'HH' 
                else:
                    status = "HD"

            else:
                att == "On Leave"
                hh = check_holiday(date)
                if hh:
                    if hh == 'WW':
                       status = "WW"
                    else:
                        hh == 'HH' 
                else:
                    if att[1] == 'Casual Leave':
                        status = "CL"
                    elif att[1] == "Sick Leave":
                        status = "SL"
                    elif att[1] == "Earned Leave":
                        status = "EL"
                    elif att[1] == "Leave Without Pay":
                        status = "LOP"     
                        
    return status
