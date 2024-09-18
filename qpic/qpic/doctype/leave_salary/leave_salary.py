# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
import datetime
from datetime import datetime, timedelta, date
from frappe.utils import now_datetime, nowdate
from frappe.model.document import Document

class LeaveSalary(Document):
	pass

@frappe.whitelist()
def get_leave_application(employee):
    # employee = frappe.db.sql("""select * from `tabEmployee` where status ='Active' """,as_dict =1)
    # for emp in employee:
    leave_application = frappe.get_all('Leave Application', {'employee': employee, 'docstatus': 1}, ['*'])
    if leave_application:
        for lap in leave_application:
            from_date = lap.custom_from_date
            first_of_month = from_date.replace(day=1)
            to_date = lap.from_date
            before_day = to_date - timedelta(days=1)
            attendance = frappe.db.sql("""select count(*) as count, sum(ot_hours) as ot ,sum(week_end_ot) as wot,sum(holiday_ot) as hot from `tabAttendance` where docstatus != 2 and employee = '%s' and  attendance_date between '%s' and '%s' """ % (employee, first_of_month, before_day), as_dict=1)[0]
            abs1 = frappe.db.sql("""select count(*) as count from `tabAttendance` where docstatus != 2 and employee = '%s' and  attendance_date between '%s' and '%s' and status = 'Absent' """ % (employee, first_of_month, before_day), as_dict=1)[0]
            abs2 = frappe.db.sql("""select count(*) as count from `tabAttendance` where docstatus != 2 and employee = '%s' and  attendance_date between '%s' and '%s' and status = 'On Leave' and leave_type = 'Leave Without Pay' """ % (employee, first_of_month, before_day), as_dict=1)[0]
            return first_of_month, before_day,lap.custom_from_date, lap.custom_to_date,attendance.count, attendance.ot or 0, attendance.wot or 0, attendance.hot or 0, lap.lop_days, lap.custom_total_leave_days, lap.leave_balance, lap.leave_type, abs1.count, abs2.count

