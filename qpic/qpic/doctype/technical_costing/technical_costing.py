# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class TechnicalCosting(Document):
	def on_submit(self):
		for opp_item in self.technical_costing_item:
			tc_id = frappe.db.exists('Commercial Costing',{'name': self.name,'opportunity':self.opportunity}, ['*'])
			if not tc_id:
				tc = frappe.new_doc("Commercial Costing")
				tc.opportunity = self.opportunity
				tc.technical_costing = self.name
				tc.one = self.one
				tc.warp = self.warp
				tc.weft = self.weft
				tc.width = self.width
				tc.length = self.length
				tc.top = self.top
				tc.extra = self.extra
				tc.bottom = self.bottom
				tc.print = self.print
				tc.unit_weight = self.unit_weight
				tc.top_length = self.top_length
				tc.bottom_length = self.bottom_length
				tc.top_thread = self.top_thread
				tc.bottom_thread = self.bottom_thread
				tc.thread_and_others = self.thread_and_others
				tc.production_size_cut_leng_y = self.production_size_cut_leng_y
				tc.lamination_optional = self.lamination_optional
				tc.coating_side = self.coating_side
				tc.coating_gsm = self.coating_gsm
				tc.lamination_wt_per_pcs_gms = self.lamination_wt_per_pcs_gms
				tc.liner_weight_gms = self.liner_weight_gms
				tc.lamination_gms = self.lamination_gms
				tc.liner_optional = self.liner_optional
				tc.production_size_cut_leng_x = self.production_size_cut_leng_x
				tc.fabric_gms = self.fabric_gms
				tc.lamination_gms = self.lamination_gms
				tc.liner_gms = self.liner_gms
				tc.other_gms = self.other_gms
				tc.total = self.total
				tc.loom_machine_hours = self.loom_machine_hours
				tc.tape_machine_hours = self.warp_machine_hours +self.strip_machine_hours+self.weft_machine_hours
				tc.lamination_machine_hours = self.lam_machine_hours
				tc.printing_machine_hours = self.printing_machine_hours
				tc.liner_cutting_machine_hours = self.machine_hours_liner
				tc.blown_film_machine_hours = self.liner_machine_hours
				tc.cutting_machine_hours = self.cutting_machine_hours
				tc.stitching_machine_hours = self.stitching_manhour
				tc.bailing_machine_hours = self.bailing_required_manhours
				tc.freight_machine_hours = self.freight_no_of_cntrtruck_required
				tc.quantity_per_cntrtruck = self.freight_quantity_per_cntrtruck
				tc.no_of_units = self.no_of_units
				tc.item_code = opp_item.item_code
				tc.item_name = opp_item.item_name
				tc.item_group = opp_item.item_group
				tc.uom = opp_item.uom
				tc.order_quantity = opp_item.qty
				self.commercial_costing = tc.name
				tc.append("commercial_costing_item",{
						"item_code": opp_item.item_code,
						"item_name": opp_item.item_name,
						"item_group": opp_item.item_group,
						"sub_group": opp_item.sub_group,
						"uom": opp_item.uom,
						"qty": opp_item.qty,
						"qty_as_per_stock_uom":opp_item.qty_as_per_stock_uom,
						"stock_uom":opp_item.stock_uom,
						"conversion_factor":opp_item.conversion_factor,
						"country":opp_item.country,
						"sales_person":opp_item.sales_person,
					})
				if self.laminationmaterial_combination:
					for lam in self.laminationmaterial_combination:
						tc.append("lamination_raw_material",{
								"item_code": lam.item_code,
								"item_description": lam.item_description,
								"dosage": lam.dosage,
								"qty": lam.qty,
								"unit": lam.unit,
							})
				else:
					skipping_loop = "sample"

				if self.weftmaterial_combination:
					for weft in self.weftmaterial_combination:
						tc.append("weft_raw_material",{
								"item_code": weft.item_code,
								"item_description": weft.item_description,
								"dosage": weft.dosage,
								"qty": weft.qty,
								"unit": weft.unit,
							})
				else:
					skipping_loop = "sample"
				if self.warpmaterial_combination:
					for warp in self.warpmaterial_combination:
						tc.append("warp_raw_material",{
								"item_code": warp.item_code,
								"item_description": warp.item_description,
								"dosage": warp.dosage,
								"qty": warp.qty,
								"unit": warp.unit,
							})
				else:
					skipping_loop = "sample"
				if self.stripmaterial_combination:
					for strip in self.stripmaterial_combination:
						tc.append("strip_raw_material",{
								"item_code": strip.item_code,
								"item_description": strip.item_description,
								"dosage": strip.dosage,
								"qty": strip.qty,
								"unit": strip.unit,
							})
				else:
					skipping_loop = "sample"
				if self.linermaterial_combination:
					for liner in self.linermaterial_combination:
						tc.append("liner_raw_material",{
								"item_code": liner.item_code,
								"item_description": liner.item_description,
								"dosage": liner.dosage,
								"qty": liner.qty,
								"unit": liner.unit,
							})
				else:
					skipping_loop = "sample"
					
				tc.save(ignore_permissions=True)

