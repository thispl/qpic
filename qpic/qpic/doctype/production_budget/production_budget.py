# Copyright (c) 2023, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ProductionBudget(Document):
	def on_submit(self):
		route_sequence_one = []
		if int(self.weft_routing_sequence) == 1:
			route_sequence_one.append(self.weft_workstation)
			route_sequence_one.append("Weft(----)")
			route_sequence_one.append(self.weft_output)
			route_sequence_one.append(self.weft_raw_material)
			route_sequence_one.append(self.weft_parent_workstation)
		if int(self.warp_routing_sequence) == 1:
			route_sequence_one.append(self.warp_workstation)
			route_sequence_one.append("Warp (|||)")
			route_sequence_one.append(self.warp_output)
			route_sequence_one.append(self.warp_raw_material)
			route_sequence_one.append(self.warp_parent_workstation)
		if int(self.strip_routing_sequence) == 1:
			route_sequence_one.append(self.strip_workstation)
			route_sequence_one.append("Strip (Warp)")
			route_sequence_one.append(self.strip_output)
			route_sequence_one.append(self.strip_raw_material)
			route_sequence_one.append(self.strip_parent_workstation)
		if int(self.liner_routing_sequence) == 1:
			route_sequence_one.append(self.liner_workstation)
			route_sequence_one.append("Liner")
			route_sequence_one.append(self.liner_output)
			route_sequence_one.append(self.liner_raw_material)
			route_sequence_one.append(self.liner_parent_workstation)
		if int(self.lamination_routing_sequence) == 1:
			route_sequence_one.append(self.lamination_workstation)
			route_sequence_one.append("Lamination")
			route_sequence_one.append(self.lamination_output)
			route_sequence_one.append(self.lamination_raw_material)
			route_sequence_one.append(self.lamination_parent_workstation)
		if int(self.loom_routing_sequence) == 1:
			route_sequence_one.append(self.loom_workstation)
			route_sequence_one.append("Loom")
			route_sequence_one.append(self.loom_output)
			route_sequence_one.append(self.loom_raw_material)
			route_sequence_one.append(self.loom_parent_workstation)
		if int(self.cutting_routing_sequence) == 1:
			route_sequence_one.append(self.cutting_workstation)
			route_sequence_one.append("Cutting")
			route_sequence_one.append(self.cutting_output)
			route_sequence_one.append(self.cutting_raw_material)
			route_sequence_one.append(self.cutting_parent_workstation)
		if int(self.stitching_routing_sequence) == 1:
			route_sequence_one.append(self.stitching_workstation)
			route_sequence_one.append("Stitching")
			route_sequence_one.append(self.stitching_output)
			route_sequence_one.append(self.stitching_raw_material)
			route_sequence_one.append(self.stitching_parent_workstation)

		bom1 = frappe.new_doc("BOM")
		bom1.with_operations = 1
		ope = bom1.append("operations")
		ope.operation = route_sequence_one[1]
		ope.workstation = route_sequence_one[0]		
		ope.parent_workstation = route_sequence_one[4]		
		for i in route_sequence_one[2]:
			if i.type == "Output":
				bom1.item = i.item_code
			if i.type == "Scrap":
				scr = bom1.append("scrap_items")
				scr.item_code = i.item_code
				scr.stock_qty = i.stock_qty
				
		for g in route_sequence_one[3]:
			bom1.append("items",{
				"item_code" : g.item_code,
				"qty": int(g.quantity_per_unit),
				"rate" : g.rate,
				"unit" : g.unit
			})
		bom1.save(ignore_permissions=True)
		bom1.submit()


		route_sequence_two = []
		if int(self.weft_routing_sequence) == 2:
			route_sequence_two.append(self.weft_workstation)
			route_sequence_two.append("Weft(----)")
			route_sequence_two.append(self.weft_output)
			route_sequence_two.append(self.weft_raw_material)
			route_sequence_two.append(self.weft_parent_workstation)
		if int(self.warp_routing_sequence) == 2:
			route_sequence_two.append(self.warp_workstation)
			route_sequence_two.append("Warp (|||)")
			route_sequence_two.append(self.warp_output)
			route_sequence_two.append(self.warp_raw_material)
			route_sequence_two.append(self.warp_parent_workstation)
		if int(self.strip_routing_sequence) == 2:
			route_sequence_two.append(self.strip_workstation)
			route_sequence_two.append("Strip (Warp)")
			route_sequence_two.append(self.strip_output)
			route_sequence_two.append(self.strip_raw_material)
			route_sequence_two.append(self.strip_parent_workstation)
		if int(self.liner_routing_sequence) == 2:
			route_sequence_two.append(self.liner_workstation)
			route_sequence_two.append("Liner")
			route_sequence_two.append(self.liner_output)
			route_sequence_two.append(self.liner_raw_material)
			route_sequence_two.append(self.liner_parent_workstation)
		if int(self.lamination_routing_sequence) == 2:
			route_sequence_two.append(self.lamination_workstation)
			route_sequence_two.append("Lamination")
			route_sequence_two.append(self.lamination_output)
			route_sequence_two.append(self.lamination_raw_material)
			route_sequence_two.append(self.lamination_parent_workstation)
		if int(self.loom_routing_sequence) == 2:
			route_sequence_two.append(self.loom_workstation)
			route_sequence_two.append("Loom")
			route_sequence_two.append(self.loom_output)
			route_sequence_two.append(self.loom_raw_material)
			route_sequence_two.append(self.loom_parent_workstation)
		if int(self.cutting_routing_sequence) == 2:
			route_sequence_two.append(self.cutting_workstation)
			route_sequence_two.append("Cutting")
			route_sequence_two.append(self.cutting_output)
			route_sequence_two.append(self.cutting_raw_material)
			route_sequence_two.append(self.cutting_parent_workstation)
		if int(self.stitching_routing_sequence) == 2:
			route_sequence_two.append(self.stitching_workstation)
			route_sequence_two.append("Stitching")
			route_sequence_two.append(self.stitching_output)
			route_sequence_two.append(self.stitching_raw_material)
			route_sequence_two.append(self.stitching_parent_workstation)

		bom2 = frappe.new_doc("BOM")
		bom2.with_operations = 1
		ope = bom2.append("operations")
		ope.operation = route_sequence_two[1]
		ope.parent_workstation = route_sequence_two[4]
		ope.workstation = route_sequence_two[0]		
		for i in route_sequence_two[2]:
			if i.type == "Output":
				bom2.item = i.item_code
			if i.type == "Scrap":
				scr = bom2.append("scrap_items")
				scr.item_code = i.item_code
				scr.stock_qty = i.stock_qty
				
		for g in route_sequence_two[3]:
			if g.idx == 1:
				bom2.append("items",{
					"item_code" : g.item_code,
					# "bom_no": bom1.name,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
			if g.idx >1:
				bom2.append("items",{
					"item_code" : g.item_code,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
		bom2.save(ignore_permissions=True)
		bom2.submit()

		route_sequence_three = []
		if int(self.weft_routing_sequence) == 3:
			route_sequence_three.append(self.weft_workstation)
			route_sequence_three.append("Weft(----)")
			route_sequence_three.append(self.weft_output)
			route_sequence_three.append(self.weft_raw_material)
			route_sequence_three.append(self.weft_parent_workstation)
		if int(self.warp_routing_sequence) == 3:
			route_sequence_three.append(self.warp_workstation)
			route_sequence_three.append("Warp (|||)")
			route_sequence_three.append(self.warp_output)
			route_sequence_three.append(self.warp_raw_material)
			route_sequence_three.append(self.warp_parent_workstation)
		if int(self.strip_routing_sequence) == 3:
			route_sequence_three.append(self.strip_workstation)
			route_sequence_three.append("Strip (Warp)")
			route_sequence_three.append(self.strip_output)
			route_sequence_three.append(self.strip_raw_material)
			route_sequence_three.append(self.strip_parent_workstation)
		if int(self.liner_routing_sequence) == 3:
			route_sequence_three.append(self.liner_workstation)
			route_sequence_three.append("Liner")
			route_sequence_three.append(self.liner_output)
			route_sequence_three.append(self.liner_raw_material)
			route_sequence_three.append(self.liner_parent_workstation)
		if int(self.lamination_routing_sequence) == 3:
			route_sequence_three.append(self.lamination_workstation)
			route_sequence_three.append("Lamination")
			route_sequence_three.append(self.lamination_output)
			route_sequence_three.append(self.lamination_raw_material)
			route_sequence_three.append(self.lamination_parent_workstation)
		if int(self.loom_routing_sequence) == 3:
			route_sequence_three.append(self.loom_workstation)
			route_sequence_three.append("Loom")
			route_sequence_three.append(self.loom_output)
			route_sequence_three.append(self.loom_raw_material)
			route_sequence_three.append(self.loom_parent_workstation)
		if int(self.cutting_routing_sequence) == 3:
			route_sequence_three.append(self.cutting_workstation)
			route_sequence_three.append("Cutting")
			route_sequence_three.append(self.cutting_output)
			route_sequence_three.append(self.cutting_raw_material)
			route_sequence_three.append(self.cutting_parent_workstation)
		if int(self.stitching_routing_sequence) == 3:
			route_sequence_three.append(self.stitching_workstation)
			route_sequence_three.append("Stitching")
			route_sequence_three.append(self.stitching_output)
			route_sequence_three.append(self.stitching_raw_material)
			route_sequence_three.append(self.stitching_parent_workstation)

		bom3 = frappe.new_doc("BOM")
		bom3.with_operations = 1
		ope = bom3.append("operations")
		ope.operation = route_sequence_three[1]
		ope.workstation = route_sequence_three[0]	
		ope.parent_workstation = route_sequence_three[4]
		for i in route_sequence_three[2]:
			if i.type == "Output":
				bom3.item = i.item_code
			if i.type == "Scrap":
				scr = bom3.append("scrap_items")
				scr.item_code = i.item_code
				scr.stock_qty = i.stock_qty
				
		for g in route_sequence_three[3]:
			if g.idx == 1:
				bom3.append("items",{
					"item_code" : g.item_code,
					# "bom_no": bom2.name,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
			if g.idx >1:
				bom3.append("items",{
					"item_code" : g.item_code,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
		bom3.save(ignore_permissions=True)
		bom3.submit()

		route_sequence_four = []
		if int(self.weft_routing_sequence) == 4:
			route_sequence_four.append(self.weft_workstation)
			route_sequence_four.append("Weft(----)")
			route_sequence_four.append(self.weft_output)
			route_sequence_four.append(self.weft_raw_material)
			route_sequence_four.append(self.weft_parent_workstation)
		if int(self.warp_routing_sequence) == 4:
			route_sequence_four.append(self.warp_workstation)
			route_sequence_four.append("Warp (|||)")
			route_sequence_four.append(self.warp_output)
			route_sequence_four.append(self.warp_raw_material)
			route_sequence_four.append(self.warp_parent_workstation)
		if int(self.strip_routing_sequence) == 4:
			route_sequence_four.append(self.strip_workstation)
			route_sequence_four.append("Strip (Warp)")
			route_sequence_four.append(self.strip_output)
			route_sequence_four.append(self.strip_raw_material)
			route_sequence_four.append(self.strip_parent_workstation)
		if int(self.liner_routing_sequence) == 4:
			route_sequence_four.append(self.liner_workstation)
			route_sequence_four.append("Liner")
			route_sequence_four.append(self.liner_output)
			route_sequence_four.append(self.liner_raw_material)
			route_sequence_four.append(self.liner_parent_workstation)
		if int(self.lamination_routing_sequence) == 4:
			route_sequence_four.append(self.lamination_workstation)
			route_sequence_four.append("Lamination")
			route_sequence_four.append(self.lamination_output)
			route_sequence_four.append(self.lamination_raw_material)
			route_sequence_four.append(self.lamination_parent_workstation)
		if int(self.loom_routing_sequence) == 4:
			route_sequence_four.append(self.loom_workstation)
			route_sequence_four.append("Loom")
			route_sequence_four.append(self.loom_output)
			route_sequence_four.append(self.loom_raw_material)
			route_sequence_four.append(self.loom_parent_workstation)
		if int(self.cutting_routing_sequence) == 4:
			route_sequence_four.append(self.cutting_workstation)
			route_sequence_four.append("Cutting")
			route_sequence_four.append(self.cutting_output)
			route_sequence_four.append(self.cutting_raw_material)
			route_sequence_four.append(self.cutting_parent_workstation)
		if int(self.stitching_routing_sequence) == 4:
			route_sequence_four.append(self.stitching_workstation)
			route_sequence_four.append("Stitching")
			route_sequence_four.append(self.stitching_output)
			route_sequence_four.append(self.stitching_raw_material)
			route_sequence_four.append(self.stitching_parent_workstation)

		bom4 = frappe.new_doc("BOM")
		bom4.with_operations = 1
		ope = bom4.append("operations")
		ope.operation = route_sequence_four[1]
		ope.parent_workstation = route_sequence_four[4]
		ope.workstation = route_sequence_four[0]	
		for i in route_sequence_four[2]:
			if i.type == "Output":
				bom4.item = i.item_code
			if i.type == "Scrap":
				scr = bom4.append("scrap_items")
				scr.item_code = i.item_code
				scr.stock_qty = i.stock_qty
				
		for g in route_sequence_four[3]:
			if g.idx == 1:
				bom4.append("items",{
					"item_code" : g.item_code,
					# "bom_no": bom3.name,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
			if g.idx >1:
				bom4.append("items",{
					"item_code" : g.item_code,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
		bom4.save(ignore_permissions=True)
		bom4.submit()

		route_sequence_five = []
		if int(self.weft_routing_sequence) == 5:
			route_sequence_five.append(self.weft_workstation)
			route_sequence_five.append("Weft(----)")
			route_sequence_five.append(self.weft_output)
			route_sequence_five.append(self.weft_raw_material)
			route_sequence_five.append(self.weft_parent_workstation)
		if int(self.warp_routing_sequence) == 5:
			route_sequence_five.append(self.warp_workstation)
			route_sequence_five.append("Warp (|||)")
			route_sequence_five.append(self.warp_output)
			route_sequence_five.append(self.warp_raw_material)
			route_sequence_five.append(self.warp_parent_workstation)
		if int(self.strip_routing_sequence) == 5:
			route_sequence_five.append(self.strip_workstation)
			route_sequence_five.append("Strip (Warp)")
			route_sequence_five.append(self.strip_output)
			route_sequence_five.append(self.strip_raw_material)
			route_sequence_five.append(self.strip_parent_workstation)
		if int(self.liner_routing_sequence) == 5:
			route_sequence_five.append(self.liner_workstation)
			route_sequence_five.append("Liner")
			route_sequence_five.append(self.liner_output)
			route_sequence_five.append(self.liner_raw_material)
			route_sequence_five.append(self.liner_parent_workstation)
		if int(self.lamination_routing_sequence) == 5:
			route_sequence_five.append(self.lamination_workstation)
			route_sequence_five.append("Lamination")
			route_sequence_five.append(self.lamination_output)
			route_sequence_five.append(self.lamination_raw_material)
			route_sequence_five.append(self.lamination_parent_workstation)
		if int(self.loom_routing_sequence) == 5:
			route_sequence_five.append(self.loom_workstation)
			route_sequence_five.append("Loom")
			route_sequence_five.append(self.loom_output)
			route_sequence_five.append(self.loom_raw_material)
			route_sequence_five.append(self.loom_parent_workstation)
		if int(self.cutting_routing_sequence) == 5:
			route_sequence_five.append(self.cutting_workstation)
			route_sequence_five.append("Cutting")
			route_sequence_five.append(self.cutting_output)
			route_sequence_five.append(self.cutting_raw_material)
			route_sequence_five.append(self.cutting_parent_workstation)
		if int(self.stitching_routing_sequence) == 5:
			route_sequence_five.append(self.stitching_workstation)
			route_sequence_five.append("Stitching")
			route_sequence_five.append(self.stitching_output)
			route_sequence_five.append(self.stitching_raw_material)
			route_sequence_five.append(self.stitching_parent_workstation)

		bom5 = frappe.new_doc("BOM")
		bom5.with_operations = 1
		ope = bom5.append("operations")
		ope.operation = route_sequence_five[1]
		ope.parent_workstation = route_sequence_five[4]
		ope.workstation = route_sequence_five[0]
		for i in route_sequence_five[2]:
			if i.type == "Output":
				bom5.item = i.item_code
			if i.type == "Scrap":
				scr = bom5.append("scrap_items")
				scr.item_code = i.item_code
				scr.stock_qty = i.stock_qty
		for g in route_sequence_five[3]:
			if g.idx == 1:
				bom5.append("items",{
					"item_code" : g.item_code,
					# "bom_no": bom4.name,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
			if g.idx >1:
				bom5.append("items",{
					"item_code" : g.item_code,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
		bom5.save(ignore_permissions=True)
		bom5.submit()



		route_sequence_six = []
		if int(self.weft_routing_sequence) == 6:
			route_sequence_six.append(self.weft_workstation)
			route_sequence_six.append("Weft(----)")
			route_sequence_six.append(self.weft_output)
			route_sequence_six.append(self.weft_raw_material)
			route_sequence_six.append(self.weft_parent_workstation)
		if int(self.warp_routing_sequence) == 6:
			route_sequence_six.append(self.warp_workstation)
			route_sequence_six.append("Warp (|||)")
			route_sequence_six.append(self.warp_output)
			route_sequence_six.append(self.warp_raw_material)
			route_sequence_six.append(self.warp_parent_workstation)
		if int(self.strip_routing_sequence) == 6:
			route_sequence_six.append(self.strip_workstation)
			route_sequence_six.append("Strip (Warp)")
			route_sequence_six.append(self.strip_output)
			route_sequence_six.append(self.strip_raw_material)
			route_sequence_six.append(self.strip_parent_workstation)
		if int(self.liner_routing_sequence) == 6:
			route_sequence_six.append(self.liner_workstation)
			route_sequence_six.append("Liner")
			route_sequence_six.append(self.liner_output)
			route_sequence_six.append(self.liner_raw_material)
			route_sequence_six.append(self.liner_parent_workstation)
		if int(self.lamination_routing_sequence) == 6:
			route_sequence_six.append(self.lamination_workstation)
			route_sequence_six.append("Lamination")
			route_sequence_six.append(self.lamination_output)
			route_sequence_six.append(self.lamination_raw_material)
			route_sequence_six.append(self.lamination_parent_workstation)
		if int(self.loom_routing_sequence) == 6:
			route_sequence_six.append(self.loom_workstation)
			route_sequence_six.append("Loom")
			route_sequence_six.append(self.loom_output)
			route_sequence_six.append(self.loom_raw_material)
			route_sequence_six.append(self.loom_parent_workstation)
		if int(self.cutting_routing_sequence) == 6:
			route_sequence_six.append(self.cutting_workstation)
			route_sequence_six.append("Cutting")
			route_sequence_six.append(self.cutting_output)
			route_sequence_six.append(self.cutting_raw_material)
			route_sequence_six.append(self.cutting_parent_workstation)
		if int(self.stitching_routing_sequence) == 6:
			route_sequence_six.append(self.stitching_workstation)
			route_sequence_six.append("Stitching")
			route_sequence_six.append(self.stitching_output)
			route_sequence_six.append(self.stitching_raw_material)
			route_sequence_six.append(self.stitching_parent_workstation)

		bom6 = frappe.new_doc("BOM")
		bom6.with_operations = 1
		ope = bom6.append("operations")
		ope.operation = route_sequence_six[1]
		ope.workstation = route_sequence_six[0]	
		ope.parent_workstation = route_sequence_six[4]
		for i in route_sequence_six[2]:
			if i.type == "Output":
				bom6.item = i.item_code
			if i.type == "Scrap":
				scr = bom6.append("scrap_items")
				scr.item_code = i.item_code
				scr.stock_qty = i.stock_qty
				
		for g in route_sequence_six[3]:
			if g.idx == 1:
				bom6.append("items",{
					"item_code" : g.item_code,
					# "bom_no": bom5.name,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
			if g.idx >1:
				bom6.append("items",{
					"item_code" : g.item_code,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
		bom6.save(ignore_permissions=True)
		bom6.submit()



		route_sequence_seven = []
		if int(self.weft_routing_sequence) == 7:
			route_sequence_seven.append(self.weft_workstation)
			route_sequence_seven.append("Weft(----)")
			route_sequence_seven.append(self.weft_output)
			route_sequence_seven.append(self.weft_raw_material)
			route_sequence_seven.append(self.weft_parent_workstation)
		if int(self.warp_routing_sequence) == 7:
			route_sequence_seven.append(self.warp_workstation)
			route_sequence_seven.append("Warp (|||)")
			route_sequence_seven.append(self.warp_output)
			route_sequence_seven.append(self.warp_raw_material)
			route_sequence_seven.append(self.warp_parent_workstation)
		if int(self.strip_routing_sequence) == 7:
			route_sequence_seven.append(self.strip_workstation)
			route_sequence_seven.append("Strip (Warp)")
			route_sequence_seven.append(self.strip_output)
			route_sequence_seven.append(self.strip_raw_material)
			route_sequence_seven.append(self.strip_parent_workstation)
		if int(self.liner_routing_sequence) == 7:
			route_sequence_seven.append(self.liner_workstation)
			route_sequence_seven.append("Liner")
			route_sequence_seven.append(self.liner_output)
			route_sequence_seven.append(self.liner_raw_material)
			route_sequence_seven.append(self.liner_parent_workstation)
		if int(self.lamination_routing_sequence) == 7:
			route_sequence_seven.append(self.lamination_workstation)
			route_sequence_seven.append("Lamination")
			route_sequence_seven.append(self.lamination_output)
			route_sequence_seven.append(self.lamination_raw_material)
			route_sequence_seven.append(self.lamination_parent_workstation)
		if int(self.loom_routing_sequence) == 7:
			route_sequence_seven.append(self.loom_workstation)
			route_sequence_seven.append("Loom")
			route_sequence_seven.append(self.loom_output)
			route_sequence_seven.append(self.loom_raw_material)
			route_sequence_seven.append(self.loom_parent_workstation)
		if int(self.cutting_routing_sequence) == 7:
			route_sequence_seven.append(self.cutting_workstation)
			route_sequence_seven.append("Cutting")
			route_sequence_seven.append(self.cutting_output)
			route_sequence_seven.append(self.cutting_raw_material)
			route_sequence_seven.append(self.cutting_parent_workstation)
		if int(self.stitching_routing_sequence) == 7:
			route_sequence_seven.append(self.stitching_workstation)
			route_sequence_seven.append("Stitching")
			route_sequence_seven.append(self.stitching_output)
			route_sequence_seven.append(self.stitching_raw_material)
			route_sequence_seven.append(self.stitching_parent_workstation)

		bom7 = frappe.new_doc("BOM")
		bom7.with_operations = 1
		ope = bom7.append("operations")
		ope.operation = route_sequence_seven[1]
		ope.parent_workstation = route_sequence_seven[4]
		ope.workstation = route_sequence_seven[0]	
		for i in route_sequence_seven[2]:
			if i.type == "Output":
				bom7.item = i.item_code
			if i.type == "Scrap":
				scr = bom7.append("scrap_items")
				scr.item_code = i.item_code
				scr.stock_qty = i.stock_qty
				
		for g in route_sequence_seven[3]:
			if g.idx == 1:
				bom7.append("items",{
					"item_code" : g.item_code,
					# "bom_no": bom6.name,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
			if g.idx >1:
				bom7.append("items",{
					"item_code" : g.item_code,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
		bom7.save(ignore_permissions=True)
		bom7.submit()



		route_sequence_eight = []
		if int(self.weft_routing_sequence) == 8:
			route_sequence_eight.append(self.weft_workstation)
			route_sequence_eight.append("Weft(----)")
			route_sequence_eight.append(self.weft_output)
			route_sequence_eight.append(self.weft_raw_material)
			route_sequence_eight.append(self.weft_parent_workstation)
		if int(self.warp_routing_sequence) == 8:
			route_sequence_eight.append(self.warp_workstation)
			route_sequence_eight.append("Warp (|||)")
			route_sequence_eight.append(self.warp_output)
			route_sequence_eight.append(self.warp_raw_material)
			route_sequence_eight.append(self.warp_parent_workstation)
		if int(self.strip_routing_sequence) == 8:
			route_sequence_eight.append(self.strip_workstation)
			route_sequence_eight.append("Strip (Warp)")
			route_sequence_eight.append(self.strip_output)
			route_sequence_eight.append(self.strip_raw_material)
			route_sequence_eight.append(self.strip_parent_workstation)
		if int(self.liner_routing_sequence) == 8:
			route_sequence_eight.append(self.liner_workstation)
			route_sequence_eight.append("Liner")
			route_sequence_eight.append(self.liner_output)
			route_sequence_eight.append(self.liner_raw_material)
			route_sequence_eight.append(self.liner_parent_workstation)
		if int(self.lamination_routing_sequence) == 8:
			route_sequence_eight.append(self.lamination_workstation)
			route_sequence_eight.append("Lamination")
			route_sequence_eight.append(self.lamination_output)
			route_sequence_eight.append(self.lamination_raw_material)
			route_sequence_eight.append(self.lamination_parent_workstation)
		if int(self.loom_routing_sequence) == 8:
			route_sequence_eight.append(self.loom_workstation)
			route_sequence_eight.append("Loom")
			route_sequence_eight.append(self.loom_output)
			route_sequence_eight.append(self.loom_raw_material)
			route_sequence_eight.append(self.loom_parent_workstation)
		if int(self.cutting_routing_sequence) == 8:
			route_sequence_eight.append(self.cutting_workstation)
			route_sequence_eight.append("Cutting")
			route_sequence_eight.append(self.cutting_output)
			route_sequence_eight.append(self.cutting_raw_material)
			route_sequence_eight.append(self.cutting_parent_workstation)
		if int(self.stitching_routing_sequence) == 8:
			route_sequence_eight.append(self.stitching_workstation)
			route_sequence_eight.append("Stitching")
			route_sequence_eight.append(self.stitching_output)
			route_sequence_eight.append(self.stitching_raw_material)
			route_sequence_eight.append(self.stitching_parent_workstation)

		bom8 = frappe.new_doc("BOM")
		bom8.with_operations = 1
		ope = bom8.append("operations")
		ope.operation = route_sequence_eight[1]
		ope.parent_workstation = route_sequence_eight[4]
		ope.workstation = route_sequence_eight[0]	
		for i in route_sequence_eight[2]:
			if i.type == "Output":
				bom8.item = i.item_code
			if i.type == "Scrap":
				scr = bom8.append("scrap_items")
				scr.item_code = i.item_code
				scr.stock_qty = i.stock_qty
				
		for g in route_sequence_eight[3]:
			if g.idx == 1:
				bom8.append("items",{
					"item_code" : g.item_code,
					# "bom_no": bom7.name,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
			if g.idx >1:
				bom8.append("items",{
					"item_code" : g.item_code,
					"qty": int(g.quantity_per_unit),
					"rate" : g.rate,
					"unit" : g.unit
				})
		bom8.save(ignore_permissions=True)
		bom8.submit()


@frappe.whitelist()
def get_tech_sheet_name(sales_order):
    sale = frappe.get_doc("Sales Order Item",{'parent':sales_order})
    return sale

@frappe.whitelist()
def get_item_conv_factor(item_code):
    item = frappe.get_doc("Item",item_code)
    return item.uoms






