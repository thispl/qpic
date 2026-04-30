import frappe
from frappe.utils import today

@frappe.whitelist()
def create_technical_sheet(doc, method):
    from erpnext.setup.utils import get_exchange_rate
    
    for opp_item in doc.items:
        if opp_item.custom_costing_for == "Small Bag":
            tc = frappe.new_doc("Technical Sheet")
            tc.naming_series = "TS-SB-.YYYY.-"
            tc.opportunity = doc.name
            tc.technical_sheet_type = "Small Bag"
            tc.company = doc.company
            tc.payment_terms_template = doc.payment_terms_template
            tc.delivery_schedule = doc.delivery_term
            tc.port = doc.port
            tc.port_type = doc.port_type
            tc.inco_terms = doc.inco_terms
            tc.country = doc.country_port
            tc.city = doc.city_port
            tc.currency = doc.currency
            tc.exchange_rate = doc.conversion_rate
            company_currency = frappe.db.get_value("Company", doc.company, "default_currency")
            tc.company_exchange = get_exchange_rate(from_currency=company_currency, to_currency=doc.currency, transaction_date=today())
            
            if opp_item.sub_group == "PP Fabric - Small":
                tc.lamination_production_wastage = 1.5
            else:
                tc.lamination_production_wastage = 1
            if doc.opportunity_from == "Lead":
                tc.lead = doc.party_name
            else:
                tc.customer = doc.party_name
                
            tc.opportunity_owner = doc.opportunity_owner
            tc.item_code = opp_item.item_code
            tc.item_name = opp_item.item_name
            tc.item_group = opp_item.custom_costing_for
            tc.uom = opp_item.uom
            tc.delivery_term = doc.delivery_term
            tc.qty = opp_item.qty
            tc.notes = doc.note
            for ps in doc.payment_schedule:
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
            tc.append("technical_costing_item",{
                "item_code": opp_item.item_code,
                "item_name": opp_item.item_name,
                "item_group": opp_item.custom_costing_for,
                "sub_group": opp_item.sub_group,
                "uom": opp_item.uom,
                "qty": opp_item.qty,
                "qty_as_per_stock_uom":opp_item.qty_as_per_stock_uom,
                "stock_uom":opp_item.stock_uom,
                "conversion_factor":opp_item.conversion_factor,
                "country":opp_item.country,
                "sales_person":opp_item.sales_person,
            })
            tc.save(ignore_permissions=True)
        
        if opp_item.custom_costing_for == "Fabric":
            tc = frappe.new_doc("Technical Sheet")
            tc.naming_series = "TS-FB-.YYYY.-"
            tc.technical_sheet_type = "Fabric"
            tc.opportunity = doc.name
            tc.company = doc.company
            tc.payment_terms_template = doc.payment_terms_template
            tc.delivery_schedule = doc.delivery_term
            tc.port = doc.port
            tc.port_type = doc.port_type
            tc.inco_terms = doc.inco_terms
            tc.country = doc.country_port
            tc.city = doc.city_port
            tc.currency = doc.currency
            tc.exchange_rate = doc.conversion_rate
            company_currency = frappe.db.get_value("Company", doc.company, "default_currency")
            tc.company_exchange = get_exchange_rate(from_currency=company_currency, to_currency=doc.currency, transaction_date=today())
            
            if doc.opportunity_from == "Lead":
                tc.lead = doc.party_name
            else:
                tc.customer = doc.party_name
                
            tc.opportunity_owner = doc.opportunity_owner
            tc.item_code = opp_item.item_code
            tc.item_name = opp_item.item_name
            tc.item_group = opp_item.custom_costing_for
            tc.uom = opp_item.uom
            tc.delivery_term = doc.delivery_term
            tc.qty = opp_item.qty
            tc.notes = doc.note
            for ps in doc.payment_schedule:
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
            tc.append("technical_costing_item",{
                "item_code": opp_item.item_code,
                "item_name": opp_item.item_name,
                "item_group": opp_item.custom_costing_for,
                "sub_group": opp_item.sub_group,
                "uom": opp_item.uom,
                "qty": opp_item.qty,
                "qty_as_per_stock_uom":opp_item.qty_as_per_stock_uom,
                "stock_uom":opp_item.stock_uom,
                "conversion_factor":opp_item.conversion_factor,
                "country":opp_item.country,
                "sales_person":opp_item.sales_person,
            })
            tc.save(ignore_permissions=True)
        
        if opp_item.custom_costing_for == "FIBC":
            tc = frappe.new_doc("Technical Sheet FIBC")
            tc.opportunity = doc.name
            tc.company = doc.company
            if doc.opportunity_from == "Lead":
                tc.lead = doc.party_name
            else:
                tc.customer = doc.party_name
            tc.opportunity_owner = doc.opportunity_owner
            tc.item_code = opp_item.item_code
            tc.item_name = opp_item.item_name
            tc.item_group = opp_item.custom_costing_for
            tc.notes = doc.note
            tc.uom = opp_item.uom
            tc.delivery_term = doc.delivery_term
            tc.payment_terms_template = doc.payment_terms_template
            tc.delivery_schedule = doc.delivery_term
            tc.port = doc.port
            tc.port_type = doc.port_type
            tc.inco_terms = doc.inco_terms
            tc.country = doc.country_port
            tc.city = doc.city_port
            tc.currency = doc.currency
            tc.exchange_rate = doc.conversion_rate
            company_currency = frappe.db.get_value("Company", doc.company, "default_currency")
            tc.company_exchange = get_exchange_rate(from_currency=company_currency, to_currency=doc.currency, transaction_date=today())
            
            for ps in doc.payment_schedule:
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
            tc.save(ignore_permissions=True)
            
        if opp_item.custom_costing_for in ["PE Bag", "PE Roll"]:
            tc = frappe.new_doc("Technical Sheet PE")
            tc.opportunity = doc.name
            tc.technical_sheet_type = opp_item.custom_costing_for
            tc.company = doc.company
            tc.payment_terms_template = doc.payment_terms_template
            tc.delivery_schedule = doc.delivery_term
            tc.port = doc.port
            tc.port_type = doc.port_type
            tc.inco_terms = doc.inco_terms
            tc.country = doc.country_port
            tc.city = doc.city_port
            tc.currency = doc.currency
            tc.exchange_rate = doc.conversion_rate
            company_currency = frappe.db.get_value("Company", doc.company, "default_currency")
            tc.company_exchange = get_exchange_rate(from_currency=company_currency, to_currency=doc.currency, transaction_date=today())
            
            if doc.opportunity_from == "Lead":
                tc.lead = doc.party_name
            else:
                tc.customer = doc.party_name
                
            tc.opportunity_owner = doc.opportunity_owner
            tc.item_code = opp_item.item_code
            tc.item_name = opp_item.item_name
            tc.item_group = opp_item.custom_costing_for
            tc.uom = opp_item.uom
            tc.delivery_term = doc.delivery_term
            tc.qty = opp_item.qty
            tc.notes = doc.note
            for ps in doc.payment_schedule:
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
            tc.append("items",{
                "item_code": opp_item.item_code,
                "item_name": opp_item.item_name,
                "item_group": opp_item.custom_costing_for,
                "sub_group": opp_item.sub_group,
                "uom": opp_item.uom,
                "qty": opp_item.qty,
                "qty_as_per_stock_uom":opp_item.qty_as_per_stock_uom,
                "stock_uom":opp_item.stock_uom,
                "conversion_factor":opp_item.conversion_factor,
                "country":opp_item.country,
                "sales_person":opp_item.sales_person,
            })
            tc.save(ignore_permissions=True)
