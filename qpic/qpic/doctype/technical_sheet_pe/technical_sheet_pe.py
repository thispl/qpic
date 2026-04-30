# Copyright (c) 2026, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

from frappe.utils import flt

class TechnicalSheetPE(Document):
	def before_insert(self):
		if self.technical_sheet_type == "PE Roll":
			self.naming_series = "TS-PE-ROLL-.YYYY.-"
		else:
			self.naming_series = "TS-PE-BAG-.YYYY.-"
   
	def validate(self):
		# if not frappe.db.exists("Costing Sheet PE", {"technical_sheet": self.name}):
		# 	first_row = self.items[0]
		# 	qty = first_row.qty
		# 	self.pe_roll_in_kg = qty
   
		self.calculate_totals()
		self.calculate_mmt()
  
	def on_submit(self):
		self.make_costing_sheet()
  
	def calculate_totals(self):
		self.calculate_raw_material_combination()
		self.calculate_pe_roll_items()

	def calculate_raw_material_combination(self):
		"""
			Calculates the total dosage, total quantity in kg, 
   			total quantity in kgmt, and total quantity in kgso 
	  		for each raw material combination.
  		"""
		
		total_density = total_qty_kgmt = 0
		for rm in self.raw_material_combination:
			# rm.total_dosage = (rm.layer_1_dosage or 0) + (rm.layer_2_dosage or 0) + (rm.layer_3_dosage or 0)
			rm.total_qty_kg = (rm.layer_1_qty or 0) + (rm.layer_2_qty or 0) + (rm.layer_3_qty or 0)
			rm.total_qty_kgmt = (rm.total_dosage or 0) / 100 * 1000
			rm.total_qty_kgso = ((rm.total_qty_kgmt or 0) * (self.pe_roll_in_kg or 0) / 1000) * (1 + self.production_wastage_roll / 100)
			rm.density = rm.total_qty_kgmt / rm.volume
			total_qty_kgmt += rm.total_qty_kgmt
			total_density += rm.density
   
		self.density_kgcbm = (total_qty_kgmt / total_density) if total_density > 0 else 0
   
	def calculate_pe_roll_items(self):
		"""
			Calculates the total material cost and base material cost for the PE Roll Items.
		"""
  
		material_cost = 0
		base_material_cost = 0
		overhead = 0
  
		for item in self.pe_roll_items:
			material_cost += flt(item.amount)
			base_material_cost += flt(item.base_amount)
   
		for other in self.pe_roll_others:
			overhead += flt(other.amount)

		self.material_cost = material_cost
		self.base_material_cost = base_material_cost
		self.overhead = overhead
		self.selling_price = (material_cost + overhead) * 1.06
		self.conversion = self.selling_price - self.material_cost
	
	def calculate_mmt(self):
		first_row = self.items[0]
		min_conversion = first_row.minimum_conversion
		fieldname = first_row.conversion_from_cw
		if fieldname:
			if self.get(fieldname) > 0:
				mmt = max(min_conversion, self.get(fieldname))
			else:
				mmt = 0
			self.mmt = mmt
			self.conversion_quot_currencymt = mmt
			self.conversion_quot_currencypcs = mmt * self.bag_weight / 1000000

	def calculate_quantity_and_hours(self):
		"""
			Calculations for the Quantity and Hours sections
			from  Costing Sheet
  		"""
		
		first_row = self.items[0]
		uom = first_row.uom
		pe_roll_sfg_qty = frappe.db.get_value("Technical Sheet PE Bag Item", {"item_code": self.pe_roll, "parent": self.name}, "qty") or 0
		self.pe_roll_in_kg = 0
		self.blown_film_operator = 0
		self.printing_machine_operator = 0
		self.conversion_machine_operator = 0
		self.helper = 0
		self.printing_machine = 0
		self.conversion_machine = 0
  
		if self.technical_sheet_type == "PE Roll":
			if uom == "Kg":
				self.pe_roll_in_kg = self.costing_sheet_qty
			self.blown_film_operator = get_qty_from_item_table(self, "blown_film_operator", "Technical Sheet PE Roll Others") * self.pe_roll_in_kg / 1000
			self.printing_machine_operator = get_qty_from_item_table(self, "printing_machine_operator", "Technical Sheet PE Roll Others") * self.costing_sheet_qty / 1000
			self.helper = get_qty_from_item_table(self, "helper", "Technical Sheet PE Roll Others") * self.pe_roll_in_kg / 1000
			self.printing_machine = self.printing_hrsmt * self.pe_roll_in_kg / 1000
   
		if self.technical_sheet_type == "PE Bag":
			if uom == "Nos":
				self.pe_roll_in_kg = pe_roll_sfg_qty * self.costing_sheet_qty / 1000
				self.blown_film_operator = (get_qty_from_item_table(self, "blown_film_operator", "Technical Sheet PE Roll Others") / 1000) * (self.bag_weight * self.costing_sheet_qty / 1000)
				self.printing_machine_operator = get_qty_from_item_table(self, "printing_machine_operator", "Technical Sheet PE Bag Others") * self.costing_sheet_qty
				self.conversion_machine_operator = get_qty_from_item_table(self, "conversion_machine_operator", "Technical Sheet PE Bag Others") * self.costing_sheet_qty
				self.helper = ((get_qty_from_item_table(self, "Packing Helper", "Technical Sheet PE Bag Others", 1) + get_qty_from_item_table(self, "Additional Packing Helper", "Technical Sheet PE Bag Others", 1) + get_qty_from_item_table(self, "Helper - D cut", "Technical Sheet PE Bag Others", 1)) * self.pe_roll_in_kg) + (get_qty_from_item_table(self, "helper", "Technical Sheet PE Roll Others") * self.pe_roll_in_kg / 1000)    
				self.conversion_machine =  self.costing_sheet_qty / self.conversion_bags__hr
    
			elif uom == "Kg":
				self.pe_roll_in_kg = (pe_roll_sfg_qty / self.bag_weight) * self.costing_sheet_qty
				self.blown_film_operator = get_qty_from_item_table(self, "blown_film_operator", "Technical Sheet PE Roll Others") * self.pe_roll_in_kg / 1000
				self.printing_machine_operator = (get_qty_from_item_table(self, "printing_machine_operator", "Technical Sheet PE Bag Others") / self.bag_weight) * self.pe_roll_in_kg * 1000
				self.conversion_machine_operator = (get_qty_from_item_table(self, "conversion_machine_operator", "Technical Sheet PE Bag Others") / self.bag_weight) * self.pe_roll_in_kg * 1000
				self.helper = ((get_qty_from_item_table(self, "Packing Helper", "Technical Sheet PE Bag Others", 1) + get_qty_from_item_table(self, "Additional Packing Helper", "Technical Sheet PE Bag Others", 1) + get_qty_from_item_table(self, "Helper - D cut", "Technical Sheet PE Bag Others", 1)) / self.bag_weight * self.pe_roll_in_kg * 1000) + (get_qty_from_item_table(self, "helper", "Technical Sheet PE Roll Others") * self.pe_roll_in_kg / 1000)
				self.conversion_machine = self.pe_roll_in_kg / (self.conversion_bags__hr * self.bag_weight / 1000)
    
			self.printing_machine = 1000 * self.printing_hrs_bag / self.bag_weight * self.pe_roll_in_kg
   
		self.pe_roll_in_mtr = self.pe_roll_in_kg * 1000 / self.wtmtr_g
		self.blown_film_machine = self.pe_roll_in_kg / self.output_kghr
  
		# Since the document might be submitted, used db_set
		self.db_set({
			"pe_roll_in_kg": self.pe_roll_in_kg,
			"pe_roll_in_mtr": self.pe_roll_in_mtr,
			"blown_film_operator": self.blown_film_operator,
			"printing_machine_operator": self.printing_machine_operator,
			"conversion_machine_operator": self.conversion_machine_operator,
			"helper": self.helper,
			"blown_film_machine": self.blown_film_machine,
			"printing_machine": self.printing_machine,
			"conversion_machine": self.conversion_machine,
		})

	@frappe.whitelist()
	def make_costing_sheet(self):
		"""
			Create costing sheet on submission of the Technical Sheet PE
		"""
  
		cs = frappe.new_doc("Costing Sheet PE")
		# naming series will be auto set on before submit, so have not defined here
		cs.costing_sheet_type = self.technical_sheet_type
		cs.company = self.company
		cs.opportunity = self.opportunity
		cs.opportunity_owner = self.opportunity_owner
		cs.lead = self.lead
		cs.customer = self.customer
		cs.technical_sheet = self.name

		# Items table ---------------------
		for item in self.items:
			cs.append("items", {
				"item_code": item.item_code,
				"item_name": item.item_name,
				"item_group": item.item_group,
				"sub_group": item.sub_group,
				"uom": item.uom,
				"qty": item.qty,
				"qty_as_per_stock_uom": item.qty_as_per_stock_uom,
				"stock_uom": item.stock_uom,
				"conversion_factor": item.conversion_factor,
				"country": item.country,
				"sales_person": item.sales_person,
			})

		# Currency Section ----------------
		cs.currency = self.currency
		cs.exchange_rate = self.exchange_rate
		cs.company_currency = "QAR"
  
		# Dimensions Section ----------------
		cs.width_cm = str(self.width) + " (" + str(self.gusset) +")"
  

		if self.technical_sheet_type == "PE Bag":
			cs.print = self.printing
			cs.cutting = self.cutting
			cs.bag_weight = self.bag_weight
			cs.pcs_mt = 1000000 / cs.bag_weight
   
			# Dimensions Section --------------
			cs.length_cm = self.external_length
			cs.thickness = self.thickness
			cs.banana_cut = self.t_cut
			cs.limb = self.hook_
			cs.d_cut = self.d_cut
   
			# Price Section -------------------
			cs.rm_cost = self.material_cost_currencymt
			cs.conversion = self.conversion_quot_currencymt
			cs.price_mt_exf = cs.rm_cost + cs.conversion
			cs.price_pcs_exf = self.material_cost_currencypiece + self.conversion_quot_currencypcs
			cs.price_pcs = (cs.price_pcs_exf + (cs.total_currency_mt + cs.freight_cost_mt)*(cs.bag_weight / 1000000))+((cs.price_mt_exf + cs.total_currency_mt+ cs.freight_cost_mt) * cs.total_percentage) * (cs.bag_weight / 1000000)
   
		elif self.technical_sheet_type == "PE Roll":
			cs.print = self.roll_printing
			cs.cutting = ""
			cs.bag_weight = ""
			cs.pcs_mt = 0
   
			# Dimensions Section --------------
			cs.length_cm = 0
			cs.thickness = 0
			cs.banana_cut = ""
			cs.limb = ""
			cs.d_cut = ""
   
			# Price Section -------------------
			cs.rm_cost = self.material_cost
			cs.conversion = self.mmt
			cs.price_mt_exf = cs.rm_cost + cs.conversion
			cs.price_pcs_exf = 0
			cs.price_pcs = 0
   
		else:
			cs.print = ""
			cs.cutting = ""
			cs.bag_weight = ""
			cs.pcs_mt = 0
   
			# Dimensions Section ---------------
			cs.length_cm = 0
			cs.thickness = 0
			cs.banana_cut = ""
			cs.limb = ""
			cs.d_cut = ""
   
			# Price Section -------------------
			cs.rm_cost = 0
			cs.conversion = 0
			cs.price_mt_exf = 0
			cs.price_pcs_exf = 0
			cs.price_pcs = 0

		cs.price_mt = (cs.price_mt_exf + cs.total_currency_mt + cs.mt_cnt) + ((cs.price_mt_exf + cs.total_currency_mt + cs.mt_cnt) * cs.total_percentage)
		cs.base_price_mt = self.exchange_rate * cs.price_mt
		cs.base_rm_cost = self.exchange_rate * cs.rm_cost
		cs.base_conversion = self.exchange_rate * cs.conversion
		cs.base_price_mt_exf = self.exchange_rate * cs.price_mt_exf
		cs.base_price_pcs_exf = self.exchange_rate * cs.price_pcs_exf
		cs.base_price_pcs = self.exchange_rate * cs.price_pcs
  
		# Order Details Section
		first_row = self.items[0]
		uom = first_row.uom
		order_quantity = 0
		order_value = 0
		by_product = None
  
		if uom == "Kg":
			order_quantity = first_row.qty
			order_value = cs.ask_price_exf * first_row.qty / 1000
			by_product = self.mt_per_container
		elif uom == "Nos":
			order_quantity = cs.bag_weight * first_row.qty / 1000
			order_value = first_row.qty * cs.ask_price_exf		
			by_product = round((self.pieces_per_container / cs.pcs_mt), 2)
		else:
			order_quantity = cs.bag_weight * first_row.qty / 1000
			order_value = first_row.qty * cs.ask_price_exf
			by_product = "False"
   
		cs.order_quantity = order_quantity
		cs.order_value = order_value
		cs.mt_cnt_by_product = by_product
		
		# Costing Sheet PE Roll Item
		for rm in self.raw_material_combination:
			qty = 0
			pe_roll_item_qty = frappe.db.get_value("Technical Sheet PE Roll Item", {"parent": self.name, "item_code": rm.item_code}, "qty")
			pe_roll_sfg_qty = frappe.db.get_value("Technical Sheet PE Bag Item", {"parent": self.name, "item_code": self.pe_roll}, "qty")
			rate_details = frappe.db.get_value("Technical Sheet PE Roll Item", {"parent": self.name, "item_code": rm.item_code}, ["base_rate", "rate"], as_dict=1)
			rate = rate_details.rate or 0
			base_rate = rate_details.base_rate or 0
   
			if self.technical_sheet_type == "PE Roll":
				qty = (pe_roll_item_qty) * 1000
			else:
				qty = (pe_roll_item_qty * pe_roll_sfg_qty / self.bag_weight) * 1000

			cs.append("pe_roll", {
				"item_code": rm.item_code,
				"item_name": rm.item_name,
				"description": rm.item_name,
				"item_group": rm.item_group,
				"uom": rm.uom,
				"cons__": rm.total_dosage,
				"qty_in_kgs_mt": qty,
				"rate": rate,
				"base_rate": base_rate,
				"amount": (rate * qty) / 1000,
				"base_amount": (base_rate * qty) / 1000,
			})
   
		# Costing Sheet Core & Ink
		for ci in self.pe_bag_items:
			if ci.item_code != self.pe_roll:
				qty = 0
				pe_roll_item_qty = frappe.db.get_value("Technical Sheet PE Roll Item", {"parent": self.name, "item_code": ci.item_code}, "qty")
				if self.technical_sheet_type == "PE Roll":
					qty = (pe_roll_item_qty) * 1000
				else:
					qty = (ci.qty * cs.pcs_mt / 1000) / 1000
	 
				base_rate = frappe.db.get_value("Item Price", {"item_code": ci.item_code}, "price_list_rate") or 0
				rate = base_rate / self.exchange_rate
				cs.append("core_and_ink", {
					"item_code": ci.item_code,
					"item_name": ci.item_name,
					"description": ci.item_name,
					"item_group": ci.item_group,
					"uom": ci.uom,
					"qty_in_kgs_mt": qty,
					"rate": rate,
					"base_rate": base_rate,
					"amount": rate * qty,
					"base_amount": base_rate * qty,
				})

		# Core item
		core_item_details = frappe.db.get_value(
	  		"Technical Sheet PE Roll Item", 
			{"parent": self.name, "item_code": ["like", "%core%"]},
			["item_code", "item_name", "item_group", "uom", "rate", "base_rate", "qty"],
			as_dict=1
		)
		if core_item_details:
			cs.append("core_and_ink", {
				"item_code": core_item_details.item_code,
				"item_name": core_item_details.item_name,
				"description": core_item_details.item_name,
				"item_group": core_item_details.item_group,
				"uom": core_item_details.uom,
				# "qty_in_kgs_mt": qty,
				# "rate": rate,
				# "base_rate": base_rate,
				# "amount": rate * qty,
				# "base_amount": base_rate * qty,
			})
  
		cs.insert()
		return cs.name
  

@frappe.whitelist()  
def get_item_details_for_pe_bag(printing, external_length, price_list, exchange_rate):
	"""
		Get item details for the item Printing and Thinner
	"""
	
	exchange_rate = flt(exchange_rate)
	items = ["RM-PI-0001", "RM-TH-0001"]
	item_details = []
	for item in items:
		item_code = item
		master = frappe.db.get_value("Item", item_code, ["item_name", "item_group"], as_dict=1)
		
		item_name = master.item_name
		item_group = master.item_group
		uom = "Gram"
		ink_qty = frappe.db.get_value("PE Print", printing, "ink") or 0
		qty = (flt(ink_qty) * flt(external_length) / 100) or 0
		item_price = frappe.db.get_value("Item Price", {"item_code": item_code, "price_list": price_list}, "price_list_rate") or 0
		base_rate = item_price / 1000000
		base_amount = qty * base_rate
		rate = base_rate * exchange_rate
		amount = base_amount * exchange_rate
		
		item_details.append({
			"item_code": item_code,
			"item_name": item_name,
			"item_group": item_group,
			"uom": uom,
			"qty": qty,
			"rate": rate,
			"base_rate": base_rate,
			"amount": amount,
			"base_amount": base_amount,
		})
		
	return item_details

def get_qty_from_item_table(self, field_name, doctype, ignore_get_label=0):
	"""
		Returns the quantity from the PE Item's table
	"""
	if ignore_get_label:
		item_name = "%" + field_name.lower() + "%"
	else:
		item_name = "%" + self.meta.get_label(field_name).lower() + "%"
	qty = frappe.db.get_value(doctype, {"item_name": ["like", item_name], "parent": self.name}, "qty") or 0
 
	return qty
		