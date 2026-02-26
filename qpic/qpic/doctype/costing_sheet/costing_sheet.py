# Copyright (c) 2026, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CostingSheet(Document):
	def before_insert(self):
		if self.costing_sheet_type == "Small Bag":
			self.naming_series = "CS-SB-.YYYY.-"
		if self.costing_sheet_type == "Fabric":
			self.naming_series = "CS-FB-.YYYY.-"
		if self.costing_sheet_type == "FIBC":
			self.naming_series = "CS-FIBC-.YYYY.-"
	def validate(self):
		if self.technical_sheet:
			conversion_fab=frappe.db.get_value("Technical Sheet",self.technical_sheet,"conversion_act_lamination")
			conversion_bag=frappe.db.get_value("Technical Sheet",self.technical_sheet,"convsn_quot_usdmt")
			if self.costing_sheet_type=="Fabric":
				self.conversion=conversion_fab
			elif self.costing_sheet_type=="Small Bag":
				self.conversion=conversion_bag
