# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CommercialCosting(Document):
	def on_submit(self):
		opp = frappe.get_all('Opportunity',{'name':self.opportunity},['*'])
		for i in opp:
			for opp_item in self.commercial_costing_item:
				tc_id = frappe.db.exists('Quotation',{'opportunity':self.opportunity})
				if tc_id:
					doc = frappe.get_doc('Quotation',{'name':tc_id})
					doc.append("items",{
								"item_code": opp_item.item_code,
								"item_name": opp_item.item_name,
								# "item_group": opp_item.item_group,
								# "sub_group": opp_item.sub_group,
								"cost":self.cost_per_unit,
								"uom": opp_item.uom,
								"qty": opp_item.qty,
								# "qty_as_per_stock_uom":opp_item.qty_as_per_stock_uom,
								# "stock_uom":opp_item.stock_uom,
								# "conversion_factor":opp_item.conversion_factor,
								# "country":opp_item.country,
								# "sales_person":opp_item.sales_person,
							})
					doc.save(ignore_permissions=True)

				if not tc_id:
					tc = frappe.new_doc("Quotation")
					tc.commercial_costing = self.name
					tc.technical_costing = self.technical_costing
					tc.opportunity = self.opportunity
					tc.quotation_to = i.opportunity_from
					tc.party_name = i.party_name
					tc.delivery_term = i.delivery_term
					tc.order_type = i.opportunity_type
					tc.currency = "QAR"
					tc.selling_price_list = "Standard Selling"
					tc.status = "Draft"
					tc.append("items",{
							"item_code": opp_item.item_code,
							"item_name": opp_item.item_name,
							# "item_group": opp_item.item_group,
							# "sub_group": opp_item.sub_group,
							"cost":self.cost_per_unit,
							"uom": opp_item.uom,
							"qty": opp_item.qty,
							# "qty_as_per_stock_uom":opp_item.qty_as_per_stock_uom,
							# "stock_uom":opp_item.stock_uom,
							# "conversion_factor":opp_item.conversion_factor,
							# "country":opp_item.country,
							# "sales_person":opp_item.sales_person,
						})
					tc.save(ignore_permissions=True)
