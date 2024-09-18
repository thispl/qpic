# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
class TechnicalSheetSB(Document):
	def on_submit(self):
		for opp_item in self.technical_costing_item:
			tc_id = frappe.db.exists('Commercial Costing',{'name': self.name,'opportunity':self.opportunity}, ['*'])
			if not tc_id:
				tc = frappe.new_doc("Commercial Costing")
				tc.opportunity = self.opportunity
				tc.company = self.company
				tc.customer = self.customer
				tc.lead = self.lead
				tc.opportunity_owner = self.opportunity_owner
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
				tc.notes = self.notes
				tc.loom_fabric_width = self.loom_fabric_width
				tc.loom_mesh = self.loom_mesh
				tc.loom_fabric_weight_pcs = self.loom_fabric_weight_pcs
				tc.loom_gsm = self.loom_gsm
				tc.loom_linear_meter_wt = self.loom_linear_meter_wt
				tc.loom_wastage_provision_finishing = self.loom_wastage_provision_finishing
				tc.loom_order_requirement = self.loom_order_requirement
				tc.loom_picks_per_min = self.loom_picks_per_min
				tc.loom_machine_hour = self.loom_machine_hours
				tc.loom_efficiency = self.loom_efficiency
				tc.cutting_width = self.cutting_width
				tc.cutting_length = self.cutting_length
				tc.cutting_cut_length = self.cutting_cut_length
				tc.cutting_fabric_thread_wt = self.cutting_fabric_thread_wt
				tc.cutting_liner_weight_gm = self.cutting_liner_weight_gm
				tc.cutting_bag_weight_gm = self.cutting_bag_weight_gm
				tc.cutting_top = self.cutting_top
				tc.cutting_bottom = self.cutting_bottom
				tc.cutting_thread_wtbag_gm = self.cutting_thread_wtbag_gm
				tc.cutting_order_requirement = self.cutting_order_requirement
				tc.cutting_machine_speed_bagsmin = self.cutting_machine_speed_bagsmin
				tc.cutting_efficiency = self.cutting_efficiency
				tc.cutting_machine_hour = self.cutting_machine_hours
				tc.stitching_order_requirement = self.stitching_order_requirement
				tc.stitching_bags_manhour = self.stitching_bags_manhour
				tc.stitching_manhour = self.stitching_manhour
				tc.item_code = opp_item.item_code
				tc.item_name = opp_item.item_name
				tc.item_group = opp_item.item_group
				tc.uom = opp_item.uom
				tc.order_quantity = opp_item.qty
				tc.payment_terms_template = self.payment_terms_template
				tc.delivery_schedule = self.delivery_schedule
				tc.port = self.port
				tc.port_type = self.port_type
				tc.inco_terms = self.inco_terms
				tc.country = self.country
				tc.city = self.city
				self.commercial_costing = tc.name
				for ps in self.payment_schedule:
					tc.append("payment_schedule",{
						"payment_term":ps.payment_term,
						"description":ps.description,
						"due_date":ps.due_date,
						"invoice_portion":ps.invoice_portion,
						"mode_of_payment":ps.mode_of_payment,
						"discount":ps.discount,
						"discount_type":ps.discount_type,
						"payment_amount":ps.payment_amount,
						"base_payment_amount":ps.base_payment_amount,
					})
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
