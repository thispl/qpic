# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import calendar
class FullandFinalSettlement(Document):
	pass

@frappe.whitelist()
def get_reg_form(employee):
    frappe.errprint(employee)
    name_reg = frappe.db.sql(
        """select name,hods_relieving_date,actual_relieving_date from `tabResignation Form` where employee = %s """ % (employee), as_dict=True)[0]
    current_date = name_reg.actual_relieving_date
    first_day_of_month = current_date.replace(day=1)
    return name_reg.name, first_day_of_month, name_reg.actual_relieving_date

@frappe.whitelist()
def calculate_attendance(employee):
    name_reg = frappe.db.sql(
        """select name,hods_relieving_date,actual_relieving_date from `tabResignation Form` where employee = %s """ % (employee), as_dict=True)[0]
    current_date = name_reg.actual_relieving_date
    first_day_of_month = current_date.replace(day=1)
    hod_date = str(first_day_of_month)
    app_date = str(name_reg.actual_relieving_date)
    frappe.errprint(hod_date)
    frappe.errprint(app_date)
    frappe.errprint(type(app_date))
    if name_reg:
        att = frappe.db.sql("""select count(*) as count from `tabAttendance` where attendance_date between '%s' and '%s' and status = 'Present'  and employee = %s""" %
                            (hod_date, app_date, employee), as_dict=True)[0]
        cal = att
        return cal, name_reg

@frappe.whitelist()
def get_current_month_date(employee):
    ff = frappe.get_value('Resignation Form', {'employee': employee}, [
                          'actual_relieving_date'])
    frappe.errprint(ff)
    now = ff
    days = calendar.monthrange(now.year, now.month)[1]
    return(days)