# Copyright (c) 2026, TEAMPRO and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class PECutting(Document):
	def validate(self):
		self.no_of_bags__hour = self.pcs__minute * 60
