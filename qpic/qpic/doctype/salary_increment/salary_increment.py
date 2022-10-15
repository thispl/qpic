# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class SalaryIncrement(Document):
	pass

@frappe.whitelist()
def update_mis_basic(doc,method):
    salary_inc = frappe.db.exists('Employee',{'employee':doc.employee_number})
    frappe.errprint(salary_inc)
    if salary_inc:
        emp = frappe.get_doc('Employee',salary_inc)
        frappe.errprint(emp.basic)
        emp.append("revised_salary_table",{
            'old_basic':doc.basic
        })
        # emp.save()
        emp.basic = doc.basic_1
        emp.hra = doc.hra_1
        emp.transportation = doc.transportation_1
        
        emp.save()
