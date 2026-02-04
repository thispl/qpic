# Copyright (c) 2025, TEAMPRO and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class Thread(Document):
	def validate(self):
		self.calculate_wtmg()

	def calculate_wtmg(self):
		if self.denier >= 0:
			self.wtmg = self.denier / 9000
