# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import flt	
from frappe.model.mapper import get_mapped_doc

class TechnicalSheet(Document):
        
    def validate(self):
        
        if self.cutting_operation:
            capacity = frappe.db.get_value(
                    "Operation SB Cut Stitch",
                    {
                        "parent": "Cutting",
                        "process_name":self.cutting_operation
                    },
                    "capacity"
                )
            hr_pcs = frappe.db.get_value(
                    "Operation SB Cut Stitch",
                    {
                        "parent": "Cutting",
                        "process_name":self.cutting_operation
                    },
                    "capacity"
                )
            power = frappe.db.get_value(
                    "Operation SB Cut Stitch",
                    {
                        "parent": "Cutting",
                        "process_name":self.cutting_operation
                    },
                    "power"
                )
            self.overhead_sb_conversion_qty=hr_pcs or 0
            self.depreciation_sb_conversion_qty=hr_pcs or 0
            self.supervisor_small_bag_conversion_qty = capacity or 0
            self.power_cost_qty=float(hr_pcs or 0)*float(power or 0)
        if self.technical_sheet_type=="Small Bag" and self.stitching=="Small Bag P/H  (502) w Tie":
            mp_val = frappe.db.get_value(
                    "Operation SB Cut Stitch",
                    {
                        "parent": "Tie Cutting",
                        "process_name":"Tie Cutting"
                    },
                    "mppcs"
                )
            self.helper_tie_cutting_qty = mp_val or 0
        if self.opportunity:
            process = frappe.db.get_value(
                "Opportunity Item",
                {"parent": self.opportunity},
                "sub_group"
            )
            if process:
                mp_val = frappe.db.get_value(
                    "Operation SB Cut Stitch",
                    {
                        "parent": "Bailing",
                        "process_name": process
                    },
                    "mppcs"
                )
                self.bailing_machine_operator_qty = mp_val or 0
        if self.technical_sheet_type=="Small Bag" and self.liner_insertion:
            mp_val = frappe.db.get_value(
                    "Operation SB Cut Stitch",
                    {
                        "parent": "Liner Insertion",
                        "process_name": self.liner_insertion
                    },
                    "mppcs"
                )
            self.helper__liner_insertion_qty = mp_val or 0
        if self.technical_sheet_type=="Small Bag" and self.cutting_operation:
            result = frappe.db.sql("""
                SELECT 
                    c.name,
                    cs.mppcs
                FROM `tabOperation` AS c
                LEFT JOIN `tabOperation SB Cut Stitch` AS cs
                    ON cs.parent = c.name
                WHERE c.name = "Cutting" and cs.process_name=%s
            """
            ,(self.cutting_operation,))
            if result:
                self.conversion_machine_operator_qty = result[0][1] or 0
                self.bundling_helper_qty = result[0][1] or 0
        if self.technical_sheet_type=="Small Bag":
            thread_val=0
            if self.thread:
                thread_val=frappe.db.get_value("Thread",self.thread,"denier")
            value=((self.external_width or 0)/100*5.6)*((self.no_of_stitch_top or 0)+(self.no_of_stitch_bottom or 0))*((thread_val or 0)/9000)
            self.mfpp_yarn_1200_denier_qty=value
        if self.technical_sheet_type=="Small Bag" and self.stitching_operation:
            result = frappe.db.sql("""
                SELECT 
                    c.name,
                    cs.mppcs
                FROM `tabOperation` AS c
                LEFT JOIN `tabOperation SB Cut Stitch` AS cs
                    ON cs.parent = c.name
                WHERE c.name = "Stitching" and cs.process_name=%s
            """
            ,(self.stitching_operation,))
            if result:
                self.tailor_qty = result[0][1] or 0
        # if not self.printing_ink:
        if frappe.db.exists("Item",{"item_name":"Printing Ink"}):
            self.printing_ink=frappe.db.get_value("Item",{"item_name":"Printing Ink"},["name"])
            self.printing_ink_uom=frappe.db.get_value("Item",{"item_name":"Printing Ink"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Printing Ink"},["valuation_rate"])
            if val_rate is not None:
                self.printing_ink_rate_qar=float(val_rate)/1000000
        # if not self.thinner:
        if frappe.db.exists("Item",{"item_name":"Thinner"}):
            self.thinner=frappe.db.get_value("Item",{"item_name":"Thinner"},["name"])
            self.thinner_uom=frappe.db.get_value("Item",{"item_name":"Thinner"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Thinner"},["valuation_rate"])
            if val_rate is not None:
                self.thinner_rate_qr=float(val_rate)/1000000
        # if not self.mfpp_yarn_1200_denier and self.thread:
        self.mfpp_yarn_1200_denier=frappe.db.get_value("Item",{"item_name":self.thread},["name"])
        self.mfpp_yarn_1200_denier_uom=frappe.db.get_value("Item",{"item_name":self.thread},["stock_uom"])
        val_rate=frappe.db.get_value("Item",{"item_name":self.thread},["valuation_rate"])
        if val_rate is not None:
            self.mfpp_yarn_1200_denier_rate_qr=float(val_rate)/1000000
        # if not self.conversion_machine_operator:
        if frappe.db.exists("Item",{"item_name":"Conversion machine operator"}):
            self.conversion_machine_operator=frappe.db.get_value("Item",{"item_name":"Conversion machine operator"},["name"])
            self.conversion_machine_operator_uom=frappe.db.get_value("Item",{"item_name":"Conversion machine operator"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Conversion machine operator"},["valuation_rate"])
            if val_rate is not None:
                self.conversion_machine_operator_rate_qr=float(val_rate)
        # if not self.bundling_helper:
        if frappe.db.exists("Item",{"item_name":"Bundling Helper"}):
            self.bundling_helper=frappe.db.get_value("Item",{"item_name":"Bundling Helper"},["name"])
            self.bundling_helper_uom=frappe.db.get_value("Item",{"item_name":"Bundling Helper"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Bundling Helper"},["valuation_rate"])
            if val_rate is not None:
                self.bundling_helper_rate_qr=float(val_rate)
        # if not self.tailor:
        if frappe.db.exists("Item",{"item_name":"Tailor"}):
            self.tailor=frappe.db.get_value("Item",{"item_name":"Tailor"},["name"])
            self.tailor_uom=frappe.db.get_value("Item",{"item_name":"Tailor"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Tailor"},["valuation_rate"])
            if val_rate is not None:
                self.tailor_rate_qr=float(val_rate)
        # if not self.printing_machine_operator:
        if frappe.db.exists("Item",{"item_name":"Printing machine operator"}):
            self.printing_machine_operator=frappe.db.get_value("Item",{"item_name":"Printing machine operator"},["name"])
            self.printing_machine_operator_uom=frappe.db.get_value("Item",{"item_name":"Printing machine operator"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Printing machine operator"},["valuation_rate"])
            if val_rate is not None:
                self.printing_machine_operator_rate_qr=float(val_rate)
        # if not self.bailing_machine_operator:
        if frappe.db.exists("Item",{"item_name":"Bailing machine operator"}):
            self.bailing_machine_operator=frappe.db.get_value("Item",{"item_name":"Bailing machine operator"},["name"])
            self.bailing_machine_operator_uom=frappe.db.get_value("Item",{"item_name":"Bailing machine operator"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Bailing machine operator"},["valuation_rate"])
            if val_rate is not None:
                self.bailing_machine_operator_rate_qr=float(val_rate)
        # if not self.helper_liner_insertion:
        if frappe.db.exists("Item",{"item_name":"Helper - Liner insertion"}):
            self.helper_liner_insertion=frappe.db.get_value("Item",{"item_name":"Helper - Liner insertion"},["name"])
            self.helper__liner_insertion_uom=frappe.db.get_value("Item",{"item_name":"Helper - Liner insertion"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Helper - Liner insertion"},["valuation_rate"])
            if val_rate is not None:
                self.helper__liner_insertion_rate_qr=float(val_rate)
        # if not self.helper_tie_cutting:
        if frappe.db.exists("Item",{"item_name":"Helper - Tie cutting"}):
            self.helper_tie_cutting=frappe.db.get_value("Item",{"item_name":"Helper - Tie cutting"},["name"])
            self.helper_tie_cutting_uom=frappe.db.get_value("Item",{"item_name":"Helper - Tie cutting"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Helper - Tie cutting"},["valuation_rate"])
            if val_rate is not None:
                self.helper_tie_cutting_rate_qr=float(val_rate)
        # if not self.supervisor_small_bag_conversion:
        if frappe.db.exists("Item",{"item_name":"Supervisor - Small bag conversion"}):
            self.supervisor_small_bag_conversion=frappe.db.get_value("Item",{"item_name":"Supervisor - Small bag conversion"},["name"])
            self.supervisor_small_bag_conversion_uom=frappe.db.get_value("Item",{"item_name":"Supervisor - Small bag conversion"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Supervisor - Small bag conversion"},["valuation_rate"])
            if val_rate is not None:
                self.supervisor_small_bag_conversion_rate_qr=float(val_rate)
        # if not self.power_cost:
        if frappe.db.exists("Item",{"item_name":"Power cost"}):
            self.power_cost=frappe.db.get_value("Item",{"item_name":"Power cost"},["name"])
            self.power_cost_uom=frappe.db.get_value("Item",{"item_name":"Power cost"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Power cost"},["valuation_rate"])
            if val_rate is not None:
                self.power_cost_rate_qr=float(val_rate)
        # if not self.overhead_sb_conversion:
        if frappe.db.exists("Item",{"item_name":"Overhead - SB Conversion"}):
            self.overhead_sb_conversion=frappe.db.get_value("Item",{"item_name":"Overhead - SB Conversion"},["name"])
            self.overhead_sb_conversion_uom=frappe.db.get_value("Item",{"item_name":"Overhead - SB Conversion"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Overhead - SB Conversion"},["valuation_rate"])
            if val_rate is not None:
                self.overhead_sb_conversion_rate_qr=float(val_rate)
        # if not self.depreciation_sb_conversion:
        if frappe.db.exists("Item",{"item_name":"Depreciation - SB Conversion"}):
            self.depreciation_sb_conversion=frappe.db.get_value("Item",{"item_name":"Depreciation - SB Conversion"},["name"])
            self.depreciation_sb_conversion_uom=frappe.db.get_value("Item",{"item_name":"Depreciation - SB Conversion"},["stock_uom"])
            val_rate=frappe.db.get_value("Item",{"item_name":"Depreciation - SB Conversion"},["valuation_rate"])
            if val_rate is not None:
                self.depreciation_sb_conversion_rate_qr=float(val_rate)
        self.set_conversion_items(price_list="Standard Buying")
        if self.laminationmaterial_combination:
            total_amt=0
            total_warp=0
            total_weft=0
            total_reenf=0
            total_weft_addn=0
            total_strip_1=0
            total_strip_2=0
            total_strip_3=0
            total_strip_4=0
            for i in self.laminationmaterial_combination:
                total_amt+=i.amount or 0
            if self.tape_item_details:
                for j in self.tape_item_details:
                    if j.type=="Warp":
                        total_warp+=j.qty or 0
                    if j.type=="Weft":
                        total_weft+=j.qty or 0
                    if j.type=="Reenf":
                        total_reenf+=j.qty or 0
                    if j.type=="Weft Addn":
                        total_weft_addn+=j.qty or 0
                    if j.type=="Strip 1":
                        total_strip_1+=j.qty or 0   
                    if j.type=="Strip 2":
                        total_strip_2+=j.qty or 0
                    if j.type=="Strip 3":
                        total_strip_3+=j.qty or 0
                    if j.type=="Strip 4":
                        total_strip_4+=j.qty or 0
            self.material_cost_lamination=total_amt+(total_warp*self.warp_tape_material_cost)+(total_weft*self.weft_tape_material_cost)+(total_strip_1*self.conversion_strip_one)+(total_strip_2*self.conversion_strip_two)+(total_strip_3*self.conversion_strip_three)+(total_strip_4*self.conversion_strip_four)
            printing_fabric_qty = 0
            printing_liner_qty = 0
            print_amt = 0
            if self.tape_item_details:
                for i in self.tape_item_details:
                    if i.type == "Fabric":
                        printing_fabric_qty += i.qty or 0
                    elif i.type == "Liner":
                        printing_liner_qty += i.qty or 0
            self.selling_price_lamination=(flt(self.conversion_usd_lamination)+flt(self.material_cost_lamination))*(1.06+flt(self.add_ons_percentage)/100)+flt(self.add_ons_usd_mt)
            self.conversion_act_lamination=flt(self.selling_price_lamination)-flt(self.material_cost_lamination)
            if self.technical_sheet_type=="Fabric":
                self.convsn_quot_usdpcs_lamination=flt(self.conversion_act_lamination)
            else:
                self.convsn_quot_usdpcs_lamination=0
            #  Calculate Printing Amount
            if self.printingmaterial_combination:
                for i in self.printingmaterial_combination:
                    print_amt += flt(i.base_amount or 0)/self.exchange_rate
            # Final Material Cost Calculation
            self.material_cost = (
                (self.lamination_material_cost or 0) * (printing_fabric_qty / 1000000))+ (printing_liner_qty * ((self.liner_material_cost or 0) / 1000000))+ print_amt
            frappe.errprint(self.lamination_material_cost)
            frappe.errprint(printing_fabric_qty)
            frappe.errprint(self.liner_material_cost)
            frappe.errprint(print_amt)
        if self.print:
            if frappe.db.exists("SB Print",self.print):
                self.printing_ink_qty=frappe.db.get_value("SB Print",self.print,"ink")
                self.thinner_qty=frappe.db.get_value("SB Print",self.print,"thinner")
                self.printing_machine_operator_qty=frappe.db.get_value("SB Print",self.print,"mpbag")
        self.cost_qrpcs=float(self.printing_ink_qty or 0)*float(self.printing_ink_rate_qar or 0)
        self.thinner_ink_cost_qrpcs=float(self.thinner_qty or 0)*float(self.thinner_rate_qr or 0)
        self.mfpp_yarn_1200_denier_cost_qrpcs=float(self.mfpp_yarn_1200_denier_qty or 0)*float(self.mfpp_yarn_1200_denier_rate_qr or 0)
        self.conversion_machine_operator_cost_qrpcs=float(self.conversion_machine_operator_qty or 0)*float(self.conversion_machine_operator_rate_qr or 0)
        self.bundling_helper_cost_qrpcs=float(self.bundling_helper_qty or 0)*float(self.bundling_helper_rate_qr or 0)
        self.tailor_cost_qrpcs=float(self.tailor_qty or 0)*float(self.tailor_rate_qr or 0)
        self.printing_machine_operator_cost_qrpcs=float(self.printing_machine_operator_qty or 0)*float(self.printing_machine_operator_rate_qr or 0)
        self.bailing_machine_operator_cost_qarpcs=float(self.bailing_machine_operator_qty or 0)*float(self.bailing_machine_operator_rate_qr or 0)
        self.helper__liner_insertion_cost_qrpcs=float(self.helper__liner_insertion_qty or 0)*float(self.helper__liner_insertion_rate_qr or 0)
        self.helper_tie_cutting_cost_qarpcs=float(self.helper_tie_cutting_qty or 0)*float(self.helper_tie_cutting_rate_qr or 0)
        self.supervisor_small_bag_conversion_cost_qrpcs=float(self.supervisor_small_bag_conversion_qty or 0)*float(self.supervisor_small_bag_conversion_rate_qr or 0)
        self.power_cost_cost_qarpcs=float(self.power_cost_qty or 0)*float(self.power_cost_rate_qr or 0)
        self.overhead_sb_conversion_cost_qrpcs=float(self.overhead_sb_conversion_qty or 0)*float(self.overhead_sb_conversion_rate_qr or 0)
        self.depreciation_sb_conversion_cost_qrpcs=float(self.depreciation_sb_conversion_qty or 0)*float(self.depreciation_sb_conversion_rate_qr or 0)
        if self.conversion_usd_lamination:
            fabric_qty=0
            liner_qty=0
            printing_cost=0
            if self.tape_item_details:
                for i in self.tape_item_details:
                    if i.type=="Fabric":
                        fabric_qty+=i.qty
                    if i.type=="Liner":
                        liner_qty+=i.qty
            if self.printing_others:
                for j in self.printing_others:
                    printing_cost+=j.amount
            self.cost_ot_rm=(self.conversion_usd_lamination*(fabric_qty/1000000))+(self.conversion_liner*(liner_qty/1000000))+printing_cost
        
        bag_weight = flt(self.bag_weight)

        if bag_weight > 0:
            self.cost_ot_rmmt = flt(self.cost_ot_rm) * 1000000 / bag_weight
            self.matl_costmt = flt(self.material_cost) * 1000000 / bag_weight
        else:
            self.cost_ot_rmmt = 0
            self.matl_costmt = 0
        self.costmt=flt(self.cost_ot_rmmt)+flt(self.matl_costmt)
        self.selling_price_act_usdmt=(flt(self.costmt)*(1.06+flt(self.add_ons_percentage)/100))+flt(self.add_ons_usd_mt)
        self.convsn_act_usdmt=flt(self.selling_price_act_usdmt)-flt(self.matl_costmt)
        self.convsn_quot_usdmt=round(self.convsn_act_usdmt)
        # Validate Warp Material Combination
        warp_dosage = 0
        amount = 0
        if self.warp_material_combination == 1:
            for row in self.warpmaterial_combination:
                warp_dosage += row.dosage
                amount += row.amount
            self.warp_tape_material_cost = amount
            if warp_dosage != 100:
                frappe.throw("Warp Material Combination's dosage should be 100")
        # Validate Weft Material Combination
        weft_dosage = 0
        amount = 0
        if self.weft_material_combination == 1:
            for row in self.weftmaterial_combination:
                weft_dosage += row.dosage
                amount += row.amount
            self.weft_tape_material_cost = amount
            if weft_dosage != 100:
                frappe.throw("Weft Material Combination's dosage should be 100")
    from frappe.utils import flt

    def set_conversion_items(self, price_list=None):

        def get_item_details(item_name, divide_by_million=False):
            if not item_name:
                return None, None, 0

            item = frappe.db.get_value(
                "Item",
                {"item_name": item_name},
                ["name", "stock_uom", "valuation_rate"],
                as_dict=True
            )

            if not item:
                return None, None, 0

            # 1️⃣ Try Item Price
            filters = {
                "item_code": item.name,
                "buying": 1
            }

            if price_list:
                filters["price_list"] = price_list

            item_price = frappe.db.get_value(
                "Item Price",
                filters,
                "price_list_rate"
            )

            # 2️⃣ Fallback to valuation_rate
            base_rate = flt(item_price) if item_price else flt(item.valuation_rate)

            # 3️⃣ Apply your calculation
            if divide_by_million:
                base_rate = base_rate / 1000000

            return item.name, item.stock_uom, base_rate

        # ======================================================
        # MATERIALS
        # ======================================================

        self.printing_ink, self.printing_ink_uom, self.printing_ink_rate_qar = \
            get_item_details("Printing Ink", divide_by_million=True)

        self.thinner, self.thinner_uom, self.thinner_rate_qr = \
            get_item_details("Thinner", divide_by_million=True)

        if self.thread:
            self.mfpp_yarn_1200_denier, \
            self.mfpp_yarn_1200_denier_uom, \
            self.mfpp_yarn_1200_denier_rate_qr = \
                get_item_details(self.thread, divide_by_million=True)

        # ======================================================
        # LABOUR
        # ======================================================

        self.conversion_machine_operator, \
        self.conversion_machine_operator_uom, \
        self.conversion_machine_operator_rate_qr = \
            get_item_details("Conversion machine operator")

        self.bundling_helper, \
        self.bundling_helper_uom, \
        self.bundling_helper_rate_qr = \
            get_item_details("Bundling Helper")

        self.tailor, \
        self.tailor_uom, \
        self.tailor_rate_qr = \
            get_item_details("Tailor")

        self.printing_machine_operator, \
        self.printing_machine_operator_uom, \
        self.printing_machine_operator_rate_qr = \
            get_item_details("Printing machine operator")

        self.bailing_machine_operator, \
        self.bailing_machine_operator_uom, \
        self.bailing_machine_operator_rate_qr = \
            get_item_details("Bailing machine operator")

        self.helper_liner_insertion, \
        self.helper__liner_insertion_uom, \
        self.helper__liner_insertion_rate_qr = \
            get_item_details("Helper - Liner insertion")

        self.helper_tie_cutting, \
        self.helper_tie_cutting_uom, \
        self.helper_tie_cutting_rate_qr = \
            get_item_details("Helper - Tie cutting")

        self.supervisor_small_bag_conversion, \
        self.supervisor_small_bag_conversion_uom, \
        self.supervisor_small_bag_conversion_rate_qr = \
            get_item_details("Supervisor - Small bag conversion")

        # ======================================================
        # OVERHEADS
        # ======================================================

        self.power_cost, \
        self.power_cost_uom, \
        self.power_cost_rate_qr = \
            get_item_details("Power cost")

        self.overhead_sb_conversion, \
        self.overhead_sb_conversion_uom, \
        self.overhead_sb_conversion_rate_qr = \
            get_item_details("Overhead - SB Conversion")

        self.depreciation_sb_conversion, \
        self.depreciation_sb_conversion_uom, \
        self.depreciation_sb_conversion_rate_qr = \
            get_item_details("Depreciation - SB Conversion")
    @frappe.whitelist()
    def on_submit(self):
        make_costing_sheet(self.name)
@frappe.whitelist()
def get_ppm(fabric_loom, fabric_speed_percentage):
    capacity = frappe.db.get_value("Workstation", fabric_loom, "capacity") or 0
    ppm = (capacity * flt(fabric_speed_percentage)) / 100
    # ppm = round(ppm, 0)
    return ppm	

@frappe.whitelist()
def get_tape_capacity_width(width, denier):
    value = frappe.db.get_value("Tape Capacity Width", {"tape_width": width}, str(denier)) or 0
    value = 1000 / flt(value) if value > 0 else 0
    return value

@frappe.whitelist()
def get_raw_materials(fg_item, operation,exchange_rate=None):
    exchange_rate = flt(exchange_rate) or 1
    items = frappe.db.sql("""
            SELECT bi.item_code, bi.item_name, bi.stock_uom, i.valuation_rate, i.description
            FROM `tabBOM` b
            INNER JOIN `tabBOM Item` bi
                ON bi.parent = b.name
            INNER JOIN `tabItem` i
                ON bi.item_code = i.name
            WHERE b.is_active = 1 AND b.is_default = 1
                AND b.item = %s AND bi.operation = %s
            """, (fg_item, operation), as_dict=1)
    data = []
    for item in items:
        item_price_rate = frappe.db.get_value(
            "Item Price",
            {
                "item_code": item.item_code,
                "selling": 0   # Buying price
            },
            "price_list_rate"
        )
        if item_price_rate:
            base_rate = flt(item_price_rate)
        else:
            base_rate = flt(item.valuation_rate)
        # base_rate = flt(item.valuation_rate)  # QAR
        usd_rate = base_rate / exchange_rate  # Convert to USD

        data.append({
            "item_code": item.item_code,
            "item_name": item.item_name,
            "uom": item.stock_uom,
            "base_rate": base_rate,   # QAR
            "rate": usd_rate,         # USD
            "description": item.description,
        })
        # base_rate = flt(item.valuation_rate)
        # data.append({
        #     "item_code": item.item_code,
        #     "item_name": item.item_name,
        #     "uom": item.stock_uom,
        #     "rate":base_rate * exchange_rate,
        #     "base_rate": item.valuation_rate,
        #     "amount": item.valuation_rate,
        #     "description": item.description,
        # })
    return data

@frappe.whitelist()
def get_overheads_and_others(operation, hrsmt, workstation=None, lamination_side=None, lamination_width=None, fabric_type=None,exchange_rate=None):
   
    items = frappe.db.get_all(
        "Item",
        {"operation": operation},
        ["name", "item_name", "stock_uom", "valuation_rate", "description", "operation"]
    )
    data = []
    exchange_rate = flt(exchange_rate) or 1
    for item in items:
        if not item.operation:
            return
        if not workstation:
            if item.operation == "Tape":
                workstation = "Tape Liner"
            if item.operation == "Liner":
                workstation = "Blown Film"
            if item.operation == "Lamination":
                workstation = "Lamination Machine"
            if item.operation == "Loom":
                workstation = "Small Loom"

        winder_qty = frappe.db.get_value("Workstation", workstation, "winder_conversion_shift") or 0
        operator_qty = frappe.db.get_value("Workstation", workstation, "operator_shift_mc") or 0
        helper_qty = frappe.db.get_value("Workstation", workstation, "helper_shift_mc") or 0
        supervisor_qty = frappe.db.get_value("Workstation", workstation, "supervision_shift_mc") or 0
        power_cost = frappe.db.get_value("Workstation", workstation, "power")
        item_name = (item.item_name or "").lower()
        
        if operation:
            if "winder" in item_name:
                qty = flt(winder_qty) * flt(hrsmt)
            elif "operator" in item_name:
                qty = flt(operator_qty) * flt(hrsmt)
            elif "helper" in item_name:
                qty = flt(helper_qty) * flt(hrsmt)
            elif "supervisor" in item_name:
                qty = flt(supervisor_qty) * flt(hrsmt)
            elif "power" in item_name:
                qty = flt(power_cost) * flt(hrsmt)
            elif "loom conversion" in item_name:
                qty = flt(winder_qty) * flt(hrsmt)
            else:
                qty = flt(hrsmt)
        else:
            qty = flt(hrsmt)
   
        if lamination_side and lamination_side != "No" and lamination_width:
            if fabric_type:
                machine_speed = frappe.db.get_value("Fabric Type", fabric_type, "speed")
                qty = qty / (machine_speed * 60)
            else:
                qty = 0

        item_price_rate = frappe.db.get_value(
            "Item Price",
            {
                "item_code": item.name,
                "buying": 1
            },
            "price_list_rate"
        )
        if item_price_rate:
            base_rate = flt(item_price_rate)
        else:
            base_rate = flt(item.valuation_rate)
        base_amount = qty * base_rate         # QAR
        rate = base_rate / exchange_rate
        amount = base_amount / exchange_rate
        data.append({
            "item_code": item.name,
            "item_name": item.item_name,
            "qty": qty,
            "uom": item.stock_uom,
            "base_rate": base_rate,      
            "rate": rate,             
            "base_amount": base_amount, 
            "amount": amount,          
            "description": item.description,
        })
    return data

def test_check():
    data = "amarkarthickp"
    if "amar" in data:
        print("ldmeflkem")
  
  
@frappe.whitelist()
def make_costing_sheet(source_name, target_doc=None):
    
    def set_missing_values(source, target):
        from erpnext.setup.utils import get_exchange_rate
        # exchange_rate = get_exchange_rate("USD", "QAR")
        exchange_rate=source.exchange_rate
        CW_SB_D228 = 0.1072
        CW_SB_K230 = 0.0785
  
        if source.technical_sheet_type == "Small Bag":
            target.width_cm = source.external_width
            target.length_cm = source.external_length
            target.price_pcs_exf = CW_SB_D228 + CW_SB_K230
            target.rm_cost = 1072.07 # Need to auto calculate
            target.base_rm_cost = 1072.07 / 0.274730907227063
        
            target.price_pcs = ((target.price_pcs_exf*(1+target.commission_percentage))+(target.commission_currency_mt*source.bag_weight/1000000)+(target.freight_cost_mt*source.bag_weight/1000000))
            target.fabric_weight_per_pieces = source.wtmtr * source.cut_length / 100
            target.lamination_weight_per_pieces = (source.lamination_wt_per_pcs_gms - source.wtmtr) * (source.cut_length / 100)
            if source.type != "No":
                target.liner_gsm_microns = source.thickness
    
        elif source.technical_sheet_type == "Fabric":
            target.width_cm = source.fabric_width_details
            target.length_cm = 100
            
            warp_weft = ((source.lamination_wt_ratio * (1 + (source.lamination_production_wastage/100))) * source.warp_tape_material_cost) + ((source.lamination_wt_ratio * (1 + (source.lamination_production_wastage/100))) * source.weft_tape_material_cost)
            target.rm_cost = (warp_weft + source.lamination_material_cost)
            target.base_rm_cost = (warp_weft +source.lamination_material_cost) * source.exchange_rate
            target.price_pcs_exf = 0
            target.fabric_weight_per_pieces = source.wtmtr * source.cut_length
            target.lamination_weight_per_pieces = (source.lamination_wt_per_pcs_gms - source.wtmtr)

        else:
            target.width_cm = 0
            target.length_cm = 0
            target.rm_cost = 0
            target.base_rm_cost = 0
            target.price_pcs_exf = 0
            target.fabric_weight_per_pieces = source.wtmtr * source.cut_length
            target.lamination_weight_per_pieces = (source.lamination_wt_per_pcs_gms - source.wtmtr)
        
        target.pcs_mt = 1000000 / source.bag_weight if source.bag_weight > 0 else 0
        target.mesh = str(round(source.tape_warp_mesh)) + " X " + str(round(source.tape_weft_mesh))
        target.tape_width = str(source.warp_tape_width) + " X " + str(source.weft_tape_width)
        target.denier = str(round(source.warp_denier)) + " X " + str(round(source.weft_denier))
        target.currency = source.currency
        target.exchange_rate = exchange_rate
        target.commission_currency_mt=source.commission_usd_mt
        target.addons_currency_mt=source.add_ons_usd_mt
        target.commision_percentage=source.commission_percentage
        target.addons_percentage=source.add_ons_percentage
        # target.conversion = 785
        if source.technical_sheet_type=="Fabric":
            target.conversion=source.conversion_act_lamination
        elif source.technical_sheet_type=="Small Bag":
            target.conversion=source.convsn_quot_usdmt
        target.base_conversion = target.conversion * exchange_rate
        target.price_mt_exf = target.rm_cost + target.conversion
        target.base_price_mt_exf = target.base_rm_cost + target.base_conversion
        target.price_mt = (target.price_mt_exf * (1 + target.commission_percentage)) + target.commission_currency_mt + target.freight_cost_mt
        target.base_price_mt = target.price_mt * exchange_rate	
        target.base_price_pcs_exf = target.price_pcs_exf * exchange_rate
        target.base_price_pcs = target.price_pcs * exchange_rate
        target.liner_weight_per_pieces = source.liner_weight_gms
        target.total_weight_per_pieces = target.liner_weight_per_pieces + target.lamination_weight_per_pieces + target.fabric_weight_per_pieces
        target.fabric_gsm_microns = source.fabric_gsm
        target.lamination_gsm_microns = source.coating_gsm if source.coating_side and source.coating_side != "No" else 0
  
  
    doc = get_mapped_doc(
        "Technical Sheet",
        source_name,
        {
            "Technical Sheet": {
                "doctype": "Costing Sheet",
                "field_map": {
                    "technical_sheet_type": "costing_sheet_type",
                    "name": "technical_sheet",
                },
                "field_no_map": [
                    "posting_date"
                ]
            },
            "Technical Costing Item": {
                "doctype": "Costing Sheet Item"
            }
        },
        target_doc,
        set_missing_values,
    )
    source = frappe.get_doc("Technical Sheet", source_name)

    # ---------------- FABRIC ITEMS ----------------
    if source.warpmaterial_combination:
        for i in source.warpmaterial_combination:
            strip_dosage = 0

            if source.stripmaterial_combination:
                match = next(
                    (s for s in source.stripmaterial_combination if s.item_code == i.item_code),
                    None
                )
                if match:
                    strip_dosage = match.dosage or 0

            cons_value = ""

            if i.item_code not in ["MB-W", "MB-C-L", "MB-C-D"]:
                cons_value = f"{i.dosage}/{strip_dosage}%"
            else:
                cons_value = f"{i.dosage}/{strip_dosage}%"

            doc.append("fabric_items", {
                "item_code": i.item_code,
                "item_name": i.item_name,
                "description": i.description,
                "rate": i.rate,
                "cons__": cons_value,
                "qty": i.qty,
                "uom": i.uom,
                "conversion_factor": i.conversion_factor
            })

    # ---------------- LAMINATION ITEMS ----------------
    if source.laminationmaterial_combination:
        for i in source.laminationmaterial_combination:
            cons = (float(i.dosage or 0) / 100) * 100

            doc.append("lamination_items", {
                "item_code": i.item_code,
                "item_name": i.item_name,
                "description": i.description,
                "rate": i.rate,
                "cons__": f"{cons}%",
                "qty": i.qty,
                "uom": i.uom,
                "conversion_factor": i.conversion_factor
            })

    # ---------------- LINER ITEMS ----------------
    if source.linermaterial_combination:
        for i in source.linermaterial_combination:
            cons = (float(i.dosage or 0) / 100) * 100

            doc.append("liner_items", {
                "item_code": i.item_code,
                "item_name": i.item_name,
                "description": i.description,
                "rate": i.rate,
                "cons__": f"{cons}%",
                "qty": i.qty,
                "uom": i.uom,
                "conversion_factor": i.conversion_factor
            })

    # ---------------- THREAD / PRINTING ITEMS ----------------
    if source.printingmaterial_combination:
        for i in source.printingmaterial_combination:
            doc.append("thread_ink_items", {
                "item_code": i.item_code,
                "item_name": i.item_name,
                "description": i.description,
                "rate": i.rate,
                "qty": i.qty,
                "uom": i.uom,
                "conversion_factor": i.conversion_factor
            })
    calculate_costing_from_source(doc, source)
    doc.insert(ignore_permissions=True)  
    return doc.name                     

def calculate_costing_from_source(doc, source):

    def flt(val):
        return float(val or 0)

    # ---------------- INITIALIZE ----------------
    fabric_rafia_qty = fabric_filler_qty = fabric_mbw_qty = 0
    fabric_mbcl_qty = fabric_mbcd_qty = fabric_uvpp_qty = 0
    fabric_tpt_filler_qty = fabric_reppmix_qty = fabric_rewhite_qty = 0
    fabric_anti_qty = 0

    fabric_rafia_row_value = fabric_filler_row_value = 0
    fabric_mbw_value = fabric_mbcl_value = fabric_mbcd_value = 0
    fabric_uvpp_value = fabric_tpt_filler_value = 0
    fabric_reppmix_value = fabric_rewhite_value = 0
    fabric_anti_value = 0

    pp_lamination_qty = ldpe_lamination_qty = 0
    pp_lamination_value = ldpe_lamination_value = 0

    printing_ink_qty = thinner_qty = mfpp_yarn_qty = 0

    ldpe_qty = lldpe_qty = hdpe_qty = bio_qty = 0
    liner_mbw_qty = liner_antistatic_qty = liner_filler_qty = antiblock_qty = 0
    re_pemix_qty = re_ppclear_qty = liner_tpt_qty = liner_uvpe_qty = 0

    # ---------------- LOOP SOURCE TABLE ----------------
    for row in source.tape_item_details:

        if row.type not in ["Fabric", "Lamination", "Printing", "Liner"]:
            fabric_rafia_qty += flt(row.pp_raffia_grade)
            fabric_filler_qty += flt(row.filler_masterbatch_pp)
            fabric_mbw_qty += flt(row.mb_w)
            fabric_mbcl_qty += flt(row.mb_c_l)
            fabric_mbcd_qty += flt(row.mb_c_d)
            fabric_uvpp_qty += flt(row.uv__pp)
            fabric_tpt_filler_qty += flt(row.tpt_filler_pp)
            fabric_reppmix_qty += flt(row.recycled_pp_mix)
            fabric_rewhite_qty += flt(row.recycled_pp_white)
            fabric_anti_qty += flt(row.antistatic_mb)

        if row.type == "Fabric":
            fabric_rafia_row_value = flt(row.pp_raffia_grade)
            fabric_filler_row_value = flt(row.filler_masterbatch_pp)
            fabric_mbw_value = flt(row.mb_w)
            fabric_mbcl_value = flt(row.mb_c_l)
            fabric_mbcd_value = flt(row.mb_c_d)
            fabric_uvpp_value = flt(row.uv__pp)
            fabric_tpt_filler_value = flt(row.tpt_filler_pp)
            fabric_reppmix_value = flt(row.recycled_pp_mix)
            fabric_rewhite_value = flt(row.recycled_pp_white)
            fabric_anti_value = flt(row.antistatic_mb)
            pp_lamination_value = flt(row.pp_lamination_grade)
            ldpe_lamination_value = flt(row.ldpe_lamination_grade)

        if row.type == "Lamination":
            if row.item == "PP Lamination Grade":
                pp_lamination_qty = flt(row.pp_lamination_grade)
            if row.item == "LDPE Lamination Grade":
                ldpe_lamination_qty = flt(row.ldpe_lamination_grade)

        if row.type == "Printing":
            if row.item == "Printing Ink":
                printing_ink_qty = flt(row.printing_ink)
            elif row.item == "Thinner":
                thinner_qty = flt(row.thinner)
            else:
                mfpp_yarn_qty = flt(row.mfpp_yarn_1200_denier)

        if row.type == "Liner":
            ldpe_qty = flt(row.ldpe)
            lldpe_qty = flt(row.lldpe)
            hdpe_qty = flt(row.hdpe)
            bio_qty = flt(row.biodegradable)
            liner_mbw_qty = flt(row.liner_mb_w)
            liner_antistatic_qty = flt(row.liner_antistatic_mb)
            liner_filler_qty = flt(row.liner_filler_masterbatch_pe)
            antiblock_qty = flt(row.antiblock)
            re_pemix_qty = flt(row.liner_recycled_pe_mix)
            re_ppclear_qty = flt(row.liner_recycled_pe_clear)
            liner_tpt_qty = flt(row.liner_tpt_filler__pe)
            liner_uvpe_qty = flt(row.liner_uv_pe)

    # ---------------- APPLY MULTIPLIER ----------------
    if doc.costing_sheet_type == "Fabric":
        result_raffia = fabric_rafia_qty * 1000
        result_filler = fabric_filler_qty * 1000
        result_mbw = fabric_mbw_qty * 1000
        result_mbcl = fabric_mbcl_qty * 1000
        result_mbcd = fabric_mbcd_qty * 1000
        result_uvpp = fabric_uvpp_qty * 1000
        result_tpt = fabric_tpt_filler_qty * 1000
        result_ppmix = fabric_reppmix_qty * 1000
        result_ppwhite = fabric_rewhite_qty * 1000
        result_anti = fabric_anti_qty * 1000
        result_pp_lamination = pp_lamination_qty * 1000
        result_ldpe_lamination = ldpe_lamination_qty * 1000
    else:
        result_raffia = fabric_rafia_row_value * 1000
        result_filler = fabric_filler_row_value * 1000
        result_mbw = fabric_mbw_value * 1000
        result_mbcl = fabric_mbcl_value * 1000
        result_mbcd = fabric_mbcd_value * 1000
        result_uvpp = fabric_uvpp_value * 1000
        result_tpt = fabric_tpt_filler_value * 1000
        result_ppmix = fabric_reppmix_value * 1000
        result_ppwhite = fabric_rewhite_value * 1000
        result_anti = fabric_anti_value * 1000
        result_pp_lamination = pp_lamination_value * 1000
        result_ldpe_lamination = ldpe_lamination_value * 1000

    # ---------------- UPDATE CHILD TABLES ----------------
    def apply_cost(rows, mapping):
        for r in rows:
            if r.item_name in mapping:
                r.qty_in_kgs_mt = mapping[r.item_name]
                r.cost__mt = (r.qty_in_kgs_mt * flt(r.rate)) / 1000

    apply_cost(doc.fabric_items, {
        "PP Raffia Grade": result_raffia,
        "Filler Masterbatch (PP)": result_filler,
        "MB-W": result_mbw,
        "MB-C-L": result_mbcl,
        "MB-C-D": result_mbcd,
        "UV - PP": result_uvpp,
        "TPT Filler - PP": result_tpt,
        "Recycled PP Mix": result_ppmix,
        "Recycled PP White": result_ppwhite,
        "Antistatic MB": result_anti,
    })

    apply_cost(doc.lamination_items, {
        "LDPE Lamination Grade": result_ldpe_lamination,
        "PP Lamination Grade": result_pp_lamination,
    })

    if doc.costing_sheet_type == "Small Bag":
        result_ink = printing_ink_qty * 1000
        result_thinner = thinner_qty * 1000
        result_denier = mfpp_yarn_qty * 1000
        result_ldpe = ldpe_qty * 1000
        result_lldpe = lldpe_qty * 1000
        result_hdpe = hdpe_qty * 1000
        result_bio = bio_qty * 1000
        result_liner_mbw = liner_mbw_qty * 1000
        result_antistatic = liner_antistatic_qty * 1000
        result_filler_master = liner_filler_qty * 1000
        result_antiblock = antiblock_qty * 1000
        result_re_pe_mix = re_pemix_qty * 1000
        result_re_pe_clear = re_ppclear_qty * 1000
        result_liner_tpt = liner_tpt_qty * 1000
        result_uvpe = liner_uvpe_qty * 1000
    else:
        result_ink = result_thinner = result_denier = 0
        result_ldpe = result_lldpe = result_hdpe = result_bio = 0
        result_liner_mbw = result_antistatic = result_filler_master = 0
        result_antiblock = result_re_pe_mix = result_re_pe_clear = 0
        result_liner_tpt = result_uvpe = 0

    for row in doc.thread_ink_items:
        item = (row.item_name or "").strip()

        if item == "Printing Ink":
            row.qty_in_kgs_mt = result_ink
        elif item == "Thinner":
            row.qty_in_kgs_mt = result_thinner
        else:
            row.qty_in_kgs_mt = result_denier

        row.cost__mt = (flt(row.qty_in_kgs_mt) * flt(row.rate)) / 1000
    apply_cost(doc.liner_items, {
        "LDPE": result_ldpe,
        "LLDPE": result_lldpe,
        "HDPE": result_hdpe,
        "Biodegradable": result_bio,
        "MB-W": result_liner_mbw,
        "Antistatic MB": result_antistatic,
        "Filler Masterbatch PE": result_filler_master,
        "Antiblock": result_antiblock,
        "Recycled PE Mix": result_re_pe_mix,
        "Recycled PE Clear": result_re_pe_clear,
        "TPT Filler - PE": result_liner_tpt,
        "UV - PE": result_uvpe,
    })

