# Copyright (c) 2023, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from erpnext.setup.utils import get_exchange_rate

class SubCommercialCosting(Document):
    def validate(self):
        if self.costing_currency:
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