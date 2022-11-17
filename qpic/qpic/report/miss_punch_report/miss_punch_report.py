# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt
import frappe
from frappe import _, msgprint
from erpnext.setup.doctype.holiday_list.holiday_list import is_holiday
# from frappe.utils import data, format_datetime, add_days,today


def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    return columns, data


def get_columns():
    columns = [
        _("Employee No") + ":Data:150",
        _("Employee Name") + ":Data:300",
        _("Grade") + ":Data:150",
        _("Department") + ":Data:150",
        _("Date") + ":Data:150",
        _("In Time") + ":Dtae Time:150",
        _("Out Time") + ":Date Time:150"

    ]
    return columns


def get_data(filters):
    data = []
    employee = frappe.db.sql(""" select name,grade,department,holiday_list from `tabEmployee` where status = 'Active' and grade in('Factory Staff','Labour')""", as_dict=True)
    for emp in employee:
        att = frappe.db.sql(""" select employee,employee_name,attendance_date,in_time,out_time from `tabAttendance` where attendance_date between '%s' and '%s' and employee = '%s' and (in_time and out_time) is null  and status not in ("On Leave","Present") and docstatus !=2 """ % (
            filters.from_date, filters.to_date, emp.name), as_dict=True)
        for at in att:
            if not is_holiday(emp.holiday_list,at.attendance_date):
                data.append([at.employee, at.employee_name,emp.grade,emp.department,at.attendance_date, at.in_time, at.out_time])
                frappe.errprint(type(at.out_time))
    return data
