# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class UpdateEmployeePersonalInfo(Document):
	pass

@frappe.whitelist()
def update_employee(doc, method):
    employee_update = frappe.db.exists('Update Employee Personal Info', {'employee': doc.employee_number})
    frappe.errprint(employee_update)
    if employee_update:
        frappe.errprint(employee_update)
        emp = frappe.get_doc('Employee')
        emp.update({
            'employee_number': doc.employee_number,
            'first_name': doc.first_name,
            'middle_name': doc.middle_name,
            'last_name': doc.last_name,
            'sponsor_company': doc.sponsor_company,
            'passport_number': doc.passport_number,
            'date_of_issue': doc.date_of_issue,
            'valid_upto': doc.valid_upto,
            'place_of_issue': doc.place_of_issue,
            'marital_status': doc.marital_status,
            'blood_group': doc.blood_group,
            'date_of_birth': doc.date_of_birth,
            'religion': doc.religion,
            'family_background': doc.family_background,
            'health_details': doc.health_details,
            'bio': doc.bio,
            'person_to_be_contacted': doc.person_to_be_contacted,
            'relation': doc.relation,
            'emergency_phone_number': doc.emergency_phone_number,
            'cell_number': doc.cell_number,
            'prefered_email': doc.prefered_email,
            'personal_email': doc.personal_email,
            'permanent_address': doc.permanent_address,
            'prefered_contact_email': doc.prefered_contact_email,
            'company_email': doc.company_email,
            'current_address': doc.current_address
        })