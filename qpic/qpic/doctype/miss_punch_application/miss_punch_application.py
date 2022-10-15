# Copyright (c) 2022, teampro and contributors
# For license information, please see license.txt

from re import S
from time import strftime, strptime
import frappe
import math
import pandas as pd
from frappe.model.document import Document
import frappe,os,base64
import requests
import datetime
import json,calendar
from datetime import datetime,timedelta,date,time
import datetime as dt
from frappe.utils import cint,today,flt,date_diff,add_days,add_months,date_diff,getdate,formatdate,cint,cstr
from frappe.desk.notifications import delete_notification_count_for
from frappe.utils import cstr, cint, getdate,get_first_day, get_last_day, today
from frappe import _


class MissPunchApplication(Document):
   
    def on_submit(self):
        self.validate_att()
        self.validate_ot()


    def validate_att(self):
        att = frappe.db.exists('Attendance',{'attendance_date':self.date,'employee':self.employee})
        if att:
            frappe.errprint(att)
            frappe.db.set_value('Attendance',att,'in_time',self.in_time)
            frappe.db.set_value('Attendance',att,'out_time',self.out_time)
            frappe.db.set_value('Attendance',att,'shift',self.shift)
            frappe.db.set_value("Attendance",att,"status","Present")
            frappe.db.set_value('Attendance',att,'miss_punch_application_single',self.name)
            self.attendance = att
    def validate_ot(self):
        attendance = frappe.db.sql("""select name,employee,shift,in_time,out_time,attendance_date,ot_hours from `tabAttendance` where docstatus != 2  and attendance_date ='%s' and employee = '%s'""" %(self.date,self.employee),as_dict=1)        
        for att in attendance:
            frappe.errprint(att)
            if att.in_time and att.out_time:                
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

    def on_cancel(self):
        att = frappe.db.exists('Attendance',{'attendance_date':self.date,'employee':self.employee})
        if att:
            frappe.db.set_value('Attendance',att,'miss_punch_application_single','')   

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
    