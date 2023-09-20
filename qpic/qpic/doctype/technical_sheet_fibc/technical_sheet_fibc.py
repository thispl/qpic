# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class TechnicalSheetFIBC(Document):
	def on_submit(self):
		warp = frappe.db.sql(""" select `tabTape Raw Material`.item_code ,`tabTape Raw Material`.item_description,`tabTape Raw Material`.dosage,
		sum(`tabTape Raw Material`.qty) as qty,`tabTape Raw Material`.unit,`tabTape Raw Material`.currency,`tabTape Raw Material`.rate,sum(`tabTape Raw Material`.amount) as amount
		from `tabSub Commercial Costing`
		left join `tabTape Raw Material` on `tabSub Commercial Costing`.name = `tabTape Raw Material`.parent where opportunity = '%s' group by item_code """ %(self.opportunity), as_dict=True)

		weft = frappe.db.sql(""" select `tabWeft Raw Material`.item_code ,`tabWeft Raw Material`.item_description,`tabWeft Raw Material`.dosage,
		sum(`tabWeft Raw Material`.qty) as qty,`tabWeft Raw Material`.unit,`tabWeft Raw Material`.currency,`tabWeft Raw Material`.rate,sum(`tabWeft Raw Material`.amount) as amount
		from `tabSub Commercial Costing`
		left join `tabWeft Raw Material` on `tabSub Commercial Costing`.name = `tabWeft Raw Material`.parent where opportunity = '%s' group by item_code """ %(self.opportunity), as_dict=True)

		strip = frappe.db.sql(""" select `tabStrip Raw Material`.item_code ,`tabStrip Raw Material`.item_description,`tabStrip Raw Material`.dosage,
		sum(`tabStrip Raw Material`.qty) as qty,`tabStrip Raw Material`.unit,`tabStrip Raw Material`.currency,`tabStrip Raw Material`.rate,sum(`tabStrip Raw Material`.amount) as amount
		from `tabSub Commercial Costing`
		left join `tabStrip Raw Material` on `tabSub Commercial Costing`.name = `tabStrip Raw Material`.parent where opportunity = '%s' group by item_code """ %(self.opportunity), as_dict=True)

		liner = frappe.db.sql(""" select `tabLiner Raw Material`.item_code ,`tabLiner Raw Material`.item_description,`tabLiner Raw Material`.dosage,
		sum(`tabLiner Raw Material`.qty) as qty,`tabLiner Raw Material`.unit,`tabLiner Raw Material`.currency,`tabLiner Raw Material`.rate,sum(`tabLiner Raw Material`.amount) as amount
		from `tabSub Commercial Costing`
		left join `tabLiner Raw Material` on `tabSub Commercial Costing`.name = `tabLiner Raw Material`.parent where opportunity = '%s' group by item_code """ %(self.opportunity), as_dict=True)
		
		lam = frappe.db.sql(""" select `tabLamination Raw Material`.item_code ,`tabLamination Raw Material`.item_description,`tabLamination Raw Material`.dosage,
		sum(`tabLamination Raw Material`.qty) as qty,`tabLamination Raw Material`.unit,`tabLamination Raw Material`.currency,`tabLamination Raw Material`.rate,sum(`tabLamination Raw Material`.amount) as amount
		from `tabSub Commercial Costing`
		left join `tabLamination Raw Material` on `tabSub Commercial Costing`.name = `tabLamination Raw Material`.parent where opportunity = '%s' group by item_code """ %(self.opportunity), as_dict=True)
		
		nl = frappe.db.sql(""" select `tabNeedle Loom Raw Material`.item_code ,`tabNeedle Loom Raw Material`.item_description,`tabNeedle Loom Raw Material`.dosage,
		sum(`tabNeedle Loom Raw Material`.qty) as qty,`tabNeedle Loom Raw Material`.unit,`tabNeedle Loom Raw Material`.currency,`tabNeedle Loom Raw Material`.rate,sum(`tabNeedle Loom Raw Material`.amount) as amount
		from `tabSub Commercial Costing`
		left join `tabNeedle Loom Raw Material` on `tabSub Commercial Costing`.name = `tabNeedle Loom Raw Material`.parent where opportunity = '%s' group by item_code """ %(self.opportunity), as_dict=True)
		
		
		
		sub = frappe.db.sql(""" select `tabTechnical Costing Item`.item_code ,`tabTechnical Costing Item`.item_name,`tabTechnical Costing Item`.item_group,`tabTechnical Costing Item`.uom,
		`tabTechnical Costing Item`.qty,`tabTechnical Costing Item`.sub_group,`tabTechnical Costing Item`.qty_as_per_stock_uom,`tabTechnical Costing Item`.conversion_factor,
		`tabTechnical Costing Item`.country,`tabTechnical Costing Item`.sales_person,
		company,opportunity_owner,customer,posting_date,costing_currency,incoterms,notes,

		sum(total_quantity_weft) as total_quantity_weft,
		sum(weft_raw_material_) as weft_raw_material_,
		sum(weft_cost_pu) as weft_cost_pu,
		sum(weft_cost_pmt) as weft_cost_pmt,
		sum(total_quantity_warp) as total_quantity_warp,
		sum(warp_raw_material_) as warp_raw_material_,
		sum(warp_cost_pu) as warp_cost_pu,
		sum(warp_cost_pmt) as warp_cost_pmt,
		sum(total_quantity_strip) as total_quantity_strip,
		sum(strip_raw_material_) as strip_raw_material_,
		sum(strip_cost_pu) as strip_cost_pu,
		sum(strip_cost_pmt) as strip_cost_pmt,
		sum(total_quantity_nl) as total_quantity_nl,
		sum(nl_raw_material_) as nl_raw_material_,
		sum(nl_cost_pu) as nl_cost_pu,
		sum(nl_cost_pmt) as nl_cost_pmt,
		sum(total_quantity_lamination) as total_quantity_lamination,
		sum(lamination_raw_material_) as lamination_raw_material_,
		sum(lam_cost_pu) as lamination_cost_pu,
		sum(lam_cost_pmt) as lamination_cost_pmt,
		sum(total_quantity_liner) as total_quantity_liner,
		sum(liner_raw_material_) as liner_raw_material_,
		sum(liner_cost_pu) as liner_cost_pu,
		sum(liner_cost_pmt) as liner_cost_pmt,
		sum(total_raw_material_cost) as total_raw_material_cost,
		sum(cost_pu_raw) as cost_pu_raw,
		sum(cost_pmt_raw) as cost_pmt_raw,
		sum(cost_pu_man) as cost_pu_man,
		sum(cost_pmt_man) as cost_pmt_man,
		sum(cost_pu_freight) as cost_pu_freight,
		sum(cost_pmt_freight) as cost_pmt_freight,
		sum(loom_machine_hours) as loom_machine_hours,

		sum(tape_machine_hours) as tape_machine_hours,
		sum(lamination_machine_hours) as lamination_machine_hours,
		sum(needle_loom_machine_hours) as needle_loom_machine_hours,
		sum(blown_film_machine_hours) as blown_film_machine_hours,
		sum(liner_cutting_machine_hours) as liner_cutting_machine_hours,
		sum(printing_machine_hours) as printing_machine_hours,
		sum(cutting_machine_hours) as cutting_machine_hours,
		sum(stitching_machine_hours) as stitching_machine_hours,
		sum(bailing_machine_hours) as bailing_machine_hours,
		sum(loommachine_hours) as loommachine_hours,
		sum(cuttingmachine_hours) as cuttingmachine_hours,
		sum(blownfilm_machine_hours) as blownfilm_machine_hours,
		sum(total_overhead) as total_overhead,
		sum(cost_pu_over) as cost_pu_over,
		sum(cost_pmt_over) as cost_pmt_over,
		sum(total_manpower) as total_manpower,

		sum(raw_material_cost) as raw_material_cost,
		sum(raw_material_cost_pu) as raw_material_cost_pu,
		sum(raw_material_cost_pmt) as raw_material_cost_pmt,

		sum(manpower_cost) as manpower_cost,
		sum(manpower_cost_pu) as manpower_cost_pu,
		sum(manpower_cost_pmt) as manpower_cost_pmt,

		sum(overhead_cost) as overhead_cost,
		sum(overhead_cost_pu) as overhead_cost_pu,
		sum(overhead_cost_pmt) as overhead_cost_pmt,

		sum(freight_cost) as freight_cost,
		sum(freight_cost_pu) as freight_cost_pu,
		sum(freight_cost_pmt) as freight_cost_pmt,

		sum(cost_per_order) as cost_per_order,
		avg(discount_tolerance) as discount_tolerance,
		sum(cost_per_metric_ton) as cost_per_metric_ton,
		sum(cost_per_metric_ton_usd) as cost_per_metric_ton_usd,
		sum(cost_per_unit) as cost_per_unit,
		sum(cost_per_unit_usd) as cost_per_unit_usd,
		

		avg(fabric_gms) as fabric_gms,
		avg(lamination_gms) as lamination_gms,
		avg(liner_gms) as liner_gms,
		avg(other_gms) as other_gms,
		avg(total) as total,
		avg(no_of_units) as no_of_units,





		sum(dis_comp_cost_pmt) as dis_comp_cost_pmt,
		sum(dis_cost_pmt) as dis_cost_pmt,
		sum(dis_comp_cost_pu) as dis_comp_cost_pu,
		sum(dis_cost_pu) as dis_cost_pu,
		avg(warp) as warp,
		avg(order_quantity) as order_quantity,
		avg(weft) as weft,
		avg(width) as width,
		avg(length) as length,
		avg(top_length) as top_length,
		avg(bottom_length) as bottom_length,
		avg(top_thread) as top_thread,
		avg(bottom_thread) as bottom_thread,
		avg(unit_weight) as unit_weight,
		avg(production_size_cut_leng_x) as production_size_cut_leng_x,
		avg(production_size_cut_leng_y) as production_size_cut_leng_y


		from `tabSub Commercial Costing`
		left join `tabTechnical Costing Item` on `tabSub Commercial Costing`.name = `tabTechnical Costing Item`.parent where opportunity = '%s' """ %(self.opportunity), as_dict=True)	
		sb = frappe.new_doc('Commercial Costing FIBC')
		for co_cost in sub:
			sb.technical_sheet_fibc = self.name
			sb.company = co_cost.company
			sb.opportunity_owner = co_cost.opportunity_owner
			sb.customer = co_cost.customer
			sb.posting_date = co_cost.posting_date
			sb.append('commercial_costing_item',{
				'item_code':co_cost.item_code,
				'item_name':co_cost.item_name,
				'item_group':co_cost.item_group,
				'uom':co_cost.uom,
				'qty':co_cost.qty,
				'sales_person':co_cost.sales_person,
				'qty_as_per_stock_uom':co_cost.qty_as_per_stock_uom,
				'stock_uom':co_cost.stock_uom,
				'conversion_factor':co_cost.conversion_factor,
				'country':co_cost.country,
			})
			for i in warp:
				if i.item_code:
					sb.append('warp_raw_material',{
					'item_code':i.item_code,
					'item_description':i.item_description,
					'dosage':i.dosage,
					'qty':i.qty,
					'unit':i.unit,
					'currency':i.currency,
					'rate':i.rate,
					'amount':i.amount
			})
			for i in weft:
				if i.item_code:
					sb.append('weft_raw_material',{
					'item_code':i.item_code,
					'item_description':i.item_description,
					'dosage':i.dosage,
					'qty':i.qty,
					'unit':i.unit,
					'currency':i.currency,
					'rate':i.rate,
					'amount':i.amount
			})
			for i in strip:
				if i.item_code:
					sb.append('strip_raw_material',{
					'item_code':i.item_code,
					'item_description':i.item_description,
					'dosage':i.dosage,
					'qty':i.qty,
					'unit':i.unit,
					'currency':i.currency,
					'rate':i.rate,
					'amount':i.amount
			})
			for i in liner:
				if i.item_code:
					sb.append('liner_raw_material',{
					'item_code':i.item_code,
					'item_description':i.item_description,
					'dosage':i.dosage,
					'qty':i.qty,
					'unit':i.unit,
					'currency':i.currency,
					'rate':i.rate,
					'amount':i.amount
			})
			for i in lam:
				if i.item_code:
					sb.append('lamination_raw_material',{
					'item_code':i.item_code,
					'item_description':i.item_description,
					'dosage':i.dosage,
					'qty':i.qty,
					'unit':i.unit,
					'currency':i.currency,
					'rate':i.rate,
					'amount':i.amount
			})
			for i in nl:
				if i.item_code:
					sb.append('needle_loom_raw_material',{
					'item_code':i.item_code,
					'item_description':i.item_description,
					'dosage':i.dosage,
					'qty':i.qty,
					'unit':i.unit,
					'currency':i.currency,
					'rate':i.rate,
					'amount':i.amount
			})
			sb.incoterms = co_cost.incoterms
			sb.total_raw_material_cost = co_cost.total_raw_material_cost
			sb.cost_pu_raw = co_cost.cost_pu_raw
			sb.cost_pmt_raw = co_cost.cost_pmt_raw
			sb.cost_pmt_man = co_cost.cost_pmt_man
			sb.cost_pu_man = co_cost.cost_pu_man
			sb.cost_pu_freight = co_cost.cost_pu_freight
			sb.cost_pmt_freight = co_cost.cost_pmt_freight
			sb.notes = co_cost.notes
			sb.total_quantity_weft = co_cost.total_quantity_weft
			sb.weft_raw_material_ = co_cost.weft_raw_material_
			sb.weft_cost_pu = co_cost.weft_cost_pu
			sb.weft_cost_pmt = co_cost.weft_cost_pmt

			sb.total_quantity_warp = co_cost.total_quantity_warp
			sb.warp_raw_material_ = co_cost.warp_raw_material_
			sb.warp_cost_pu = co_cost.warp_cost_pu
			sb.warp_cost_pmt = co_cost.warp_cost_pmt

			sb.total_quantity_strip = co_cost.total_quantity_strip
			sb.strip_raw_material_ = co_cost.strip_raw_material_
			sb.strip_cost_pu = co_cost.strip_cost_pu
			sb.strip_cost_pmt = co_cost.strip_cost_pmt

			sb.total_quantity_lamination = co_cost.total_quantity_lamination
			sb.lamination_raw_material_ = co_cost.lamination_raw_material_
			sb.lamination_cost_pu = co_cost.lamination_cost_pu
			sb.lamination_cost_pmt = co_cost.lamination_cost_pmt

			sb.total_quantity_nl = co_cost.total_quantity_nl
			sb.nl_raw_material_ = co_cost.nl_raw_material_
			sb.nl_cost_pu = co_cost.nl_cost_pu
			sb.nl_cost_pmt = co_cost.nl_cost_pmt

			sb.total_quantity_liner = co_cost.total_quantity_liner
			sb.liner_raw_material_ = co_cost.liner_raw_material_
			sb.liner_cost_pu = co_cost.liner_cost_pu
			sb.liner_cost_pmt = co_cost.liner_cost_pmt

			sb.loom_machine_hours = co_cost.loom_machine_hours
			sb.tape_machine_hours = co_cost.tape_machine_hours
			sb.lamination_machine_hours = co_cost.lamination_machine_hours
			sb.needle_loom_machine_hours = co_cost.needle_loom_machine_hours
			sb.blown_film_machine_hours = co_cost.blown_film_machine_hours
			sb.liner_cutting_machine_hours = co_cost.liner_cutting_machine_hours
			sb.printing_machine_hours = co_cost.printing_machine_hours
			sb.cutting_machine_hours = co_cost.cutting_machine_hours
			sb.stitching_machine_hours = co_cost.stitching_machine_hours
			sb.bailing_machine_hours = co_cost.bailing_machine_hours
			sb.loommachine_hours = co_cost.loommachine_hours
			sb.cuttingmachine_hours = co_cost.cuttingmachine_hours
			sb.blownfilm_machine_hours = co_cost.blownfilm_machine_hours
			sb.total_overhead = co_cost.total_overhead
			sb.cost_pu_over = co_cost.cost_pu_over
			sb.cost_pmt_over = co_cost.cost_pmt_over
			sb.raw_material_cost = co_cost.raw_material_cost
			sb.raw_material_cost_pu = co_cost.raw_material_cost_pu
			sb.raw_material_cost_pmt = co_cost.raw_material_cost_pmt

			sb.manpower_cost = co_cost.manpower_cost
			sb.manpower_cost_pu = co_cost.manpower_cost_pu
			sb.manpower_cost_pmt = co_cost.manpower_cost_pmt

			sb.overhead_cost = co_cost.overhead_cost
			sb.overhead_cost_pu = co_cost.overhead_cost_pu
			sb.overhead_cost_pmt = co_cost.overhead_cost_pmt

			sb.freight_cost = co_cost.freight_cost
			sb.freight_cost_pu = co_cost.freight_cost_pu
			sb.freight_cost_pmt = co_cost.freight_cost_pmt
			sb.total_manpower = co_cost.total_manpower


			sb.cost_per_order = co_cost.cost_per_order
			sb.discount_tolerance = co_cost.discount_tolerance
			sb.cost_per_metric_ton = co_cost.cost_per_metric_ton
			sb.cost_per_metric_ton_usd = co_cost.cost_per_metric_ton_usd
			sb.cost_per_unit = co_cost.cost_per_unit
			sb.cost_per_unit_usd = co_cost.cost_per_unit_usd
			sb.dis_comp_cost_pmt = co_cost.dis_comp_cost_pmt
			sb.dis_cost_pmt = co_cost.dis_cost_pmt
			sb.dis_comp_cost_pu = co_cost.dis_comp_cost_pu
			sb.dis_cost_pu = co_cost.dis_cost_pu

			sb.weft = co_cost.weft
			sb.warp = co_cost.warp
			sb.width = co_cost.width
			sb.length = co_cost.length
			sb.top_length = co_cost.top_length
			sb.bottom_length = co_cost.bottom_length
			sb.top_thread = co_cost.top_thread
			sb.bottom_thread = co_cost.bottom_thread
			sb.unit_weight = co_cost.unit_weight
			sb.production_size_cut_leng_y = co_cost.production_size_cut_leng_y
			sb.production_size_cut_leng_x = co_cost.production_size_cut_leng_x



			sb.fabric_gms = co_cost.fabric_gms
			sb.lamination_gms = co_cost.lamination_gms
			sb.liner_gms = co_cost.liner_gms
			sb.other_gms = co_cost.other_gms
			sb.total = co_cost.total
			sb.no_of_units = co_cost.no_of_units
			sb.order_quantity = co_cost.order_quantity

			sb.payment_terms_template = self.payment_terms_template
			sb.delivery_schedule = self.delivery_schedule
			sb.port = self.port
			sb.opportunity = self.opportunity
			sb.port_type = self.port_type
			sb.inco_terms = self.inco_terms
			sb.country = self.country
			sb.city = self.city
			for ps in self.payment_schedule:
				sb.append("payment_schedule",{
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
			sb.save(ignore_permissions=True)