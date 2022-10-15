# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ProbationEvaluationForm(Document):
	def on_update(self):
		emp = frappe.get_doc('Employee',self.employee)
		emp.employment_type = self.employment_type
		
		emp.save(ignore_permissions=True)


