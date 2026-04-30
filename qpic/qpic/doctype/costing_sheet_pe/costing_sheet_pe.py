# Copyright (c) 2026, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CostingSheetPE(Document):
	def before_insert(self):
		if self.costing_sheet_type == "PE Roll":
			self.naming_series = "CS-PE-ROLL-.YYYY.-"
		else:
			self.naming_series = "CS-PE-BAG-.YYYY.-"
   
	def validate(self):
		self.calculate_totals()
		self.update_technical_sheet()

	def calculate_totals(self):
		qty = 0
		amount = 0
  
		for rm in self.pe_roll:
			qty += rm.qty_in_kgs_mt
			amount += rm.amount

		for ci in self.core_and_ink:
			qty += ci.qty_in_kgs_mt
			amount += ci.amount
   
		self.total_quantity = qty
		self.total_cost = amount
  
	@frappe.whitelist()
	def get_commission_total(self):
		pe_roll_in_kg = frappe.db.get_value("Technical Sheet PE", self.technical_sheet, "pe_roll_in_kg")
		commission_total = pe_roll_in_kg / 1000 * self.commission_total_currency_mt
		return commission_total
	
	def update_technical_sheet(self):
		first_row = self.items[0]
		qty = first_row.qty
		frappe.db.set_value("Technical Sheet PE", self.technical_sheet, "costing_sheet_qty", qty) or 0 # update the qty to technical sheet
  
		# Trigger technical sheet's Qty & Hrs calculation
		if frappe.db.exists("Technical Sheet PE", self.technical_sheet):
			tspe = frappe.get_doc("Technical Sheet PE", self.technical_sheet)
			tspe.calculate_quantity_and_hours()
		
