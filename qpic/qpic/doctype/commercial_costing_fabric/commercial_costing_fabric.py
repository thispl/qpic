# Copyright (c) 2023, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from erpnext.setup.utils import get_exchange_rate
from frappe.model.document import Document

class CommercialCostingFabric(Document):
    def validate(self):
        if self.cost_per_metric_ton_usd:
            conversion = get_exchange_rate(self.costing_currency, "QAR")
            self.cost_per_metric_ton = conversion * self.cost_per_metric_ton_usd
            self.cost_per_unit = conversion * self.cost_per_unit_usd
        tape = frappe.db.sql("""select item_code,item_description,unit,currency,sum(qty) as qty,sum(dosage) as dosage,sum(amount) as amount,sum(rate) as rate from `tabTape Raw Material` where parent='%s' group by item_code """ %(self.name), as_dict=True)
        self.set('tape_raw_material', [])
        for tap in tape:
            self.append('tape_raw_material',{
                "item_code": tap.item_code,
                "item_description": tap.item_description,
                "dosage": tap.dosage,
                "qty": tap.qty,
                "rate": tap.rate,
                "unit": tap.unit,
                "amount": tap.amount,
                "currency": tap.currency,
            })       
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
                                "item_group": opp_item.item_group,
                                # "sub_group": opp_item.sub_group,
                                "no_of_units_per_metric_ton":self.no_of_units,
                                "cost":self.cost_per_unit,
                                "cost_per_metric_ton": self.cost_per_metric_ton,
                                "cost_pu":self.cost_per_unit_usd,
                                "cost_pmt": self.cost_per_metric_ton_usd,
                                "uom": opp_item.uom,
                                "discount_tolerance": self.discount_tolerance,
                                "qty": opp_item.qty,
                                # "qty_as_per_stock_uom":opp_item.qty_as_per_stock_uom,
                                # "stock_uom":opp_item.stock_uom,
                                # "conversion_factor":opp_item.conversion_factor,
                                # "country":opp_item.country,
                                # "sales_person":opp_item.sales_person,
                            })

                    doc.payment_terms_template = self.payment_terms_template
                    doc.delivery_schedule = self.delivery_schedule

                    doc.commercial_costing_fabric = self.name
                    doc.opportunity = self.opportunity
                    doc.technical_sheet_fabric = self.technical_sheet_fabric
                    doc.port = self.port
                    doc.port_type = self.port_type
                    doc.incoterms = self.inco_terms
                    doc.country = self.country
                    doc.city = self.city
                    # for ps in self.payment_schedule:
                    #     doc.append("payment_schedule",{
                    #         "payment_term":ps.payment_term,
                    #         "description":ps.description,
                    #         "due_date":ps.due_date,
                    #         "invoice_portion":ps.invoice_portion,
                    #         "mode_of_payment":ps.mode_of_payment,
                    #         "discount":ps.discount,
                    #         "discount_type":ps.discount_type,
                    #         "payment_amount":ps.payment_amount,
                    #         "base_payment_amount":ps.base_payment_amount,
                    #     })
                    doc.save(ignore_permissions=True)

                if not tc_id:
                    tc = frappe.new_doc("Quotation")
                    tc.commercial_costing_fabric = self.name
                    tc.opportunity = self.opportunity
                    tc.technical_sheet_fabric = self.technical_sheet_fabric
                    tc.quotation_to = i.opportunity_from
                    tc.party_name = i.party_name
                    tc.notes = self.notes
                    tc.incoterms = self.incoterms
                    tc.delivery_term = i.delivery_term
                    tc.order_type = i.opportunity_type
                    tc.currency = self.costing_currency
                    tc.selling_price_list = "Standard Selling"
                    tc.status = "Draft"
                    tc.append("items",{
                            "item_code": opp_item.item_code,
                            "item_name": opp_item.item_name,
                            "item_group": opp_item.item_group,
                            # "sub_group": opp_item.sub_group,
                            "cost":self.cost_per_unit,
                            "no_of_units_per_metric_ton":self.no_of_units,
                            "uom": opp_item.uom,
                            "cost_per_metric_ton": self.cost_per_metric_ton,
                            "cost_pu":self.cost_per_unit_usd,
                            "cost_pmt": self.cost_per_metric_ton_usd,
                            "discount_tolerance": self.discount_tolerance,
                            "qty": opp_item.qty,
                            # "qty_as_per_stock_uom":opp_item.qty_as_per_stock_uom,
                            # "stock_uom":opp_item.stock_uom,
                            # "conversion_factor":opp_item.conversion_factor,
                            # "country":opp_item.country,
                            # "sales_person":opp_item.sales_person,
                        })
                    tc.payment_terms_template = self.payment_terms_template
                    tc.delivery_schedule = self.delivery_schedule
                    tc.port = self.port
                    tc.port_type = self.port_type
                    tc.incoterms = self.inco_terms
                    tc.country = self.country
                    tc.city = self.city
                    # for ps in self.payment_schedule:
                    #     tc.append("payment_schedule",{
                    #         "payment_term":ps.payment_term,
                    #         "description":ps.description,
                    #         "due_date":ps.due_date,
                    #         "invoice_portion":ps.invoice_portion,
                    #         "mode_of_payment":ps.mode_of_payment,
                    #         "discount":ps.discount,
                    #         "discount_type":ps.discount_type,
                    #         "payment_amount":ps.payment_amount,
                    #         "base_payment_amount":ps.base_payment_amount,
                    #     })
                    tc.save(ignore_permissions=True)

