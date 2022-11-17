# Copyright (c) 2022, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from datetime import date, timedelta
from frappe import get_request_header, msgprint, _
from frappe.utils import cstr, cint, getdate
from frappe.utils import cstr, add_days, date_diff, getdate, get_last_day,get_first_day
from datetime import date, timedelta, datetime


def execute(filters=None):
	columns, data = [], []
	columns = get_columns()
	data = get_data(filters)
	return columns, data


def get_columns():
	columns = [
		_("Employee") + ":Link/Employee:100",
		_("In time") + ":Data:100",
		_("Out time") + ":Data:100",

	]
	return columns
def get_data(filters):
	data = []
	if filters.employee:
		attendance = frappe.get_all('Attendance',{'employee':filters.employee,'attendance_date':filters.from_date},['*'])
	else:
		attendance = frappe.db.get_all('Attendance',{'attendance_date':filters.from_date},['*'])
	for att in attendance:
		emp = frappe.get_doc('Employee',att.employee,['*'])
		if att.in_time and att.out_time:
			frappe.errprint('Check')
			pass
			row = [emp.employee,att.in_time,att.out_time]
		data.append(row)
	return data
