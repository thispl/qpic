// Copyright (c) 2026, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on("Costing Sheet PE", {
    // Event
	refresh(frm) {
        if (frm.doc.docstatus == 1) {
            frm.add_custom_button(__("Print"), () => {
                let f_name = frm.doc.name;
                let print_format = "Costing Sheet PE";

                let url = frappe.urllib.get_full_url(
                    "/api/method/frappe.utils.print_format.download_pdf?"
                    + "doctype=" + encodeURIComponent(frm.doctype)
                    + "&name=" + encodeURIComponent(f_name)
                    + "&trigger_print=1"
                    + "&format=" + encodeURIComponent(print_format)
                    + "&no_letterhead=0"
                );

                window.open(url);
            });
        }
        frm.trigger('change_field_labels');
	},

    // Fields
    price_mt_exf(frm) {
        frm.trigger('calculate_price_mt');
        frm.trigger('calculate_price_pcs');
        convert_to_company_currency(frm, 'price_mt_exf', 'base_price_mt_exf');
        frm.trigger('calculate_currency_conversion');
        calculate_total_currency_mt(frm, "commission_total_currency_mt", frm.doc.commission_currency_mt, frm.doc.commission_percentage, frm.doc.price_mt_exf);
        calculate_total_currency_mt(frm, "addons_total_currency_mt", frm.doc.addons_currency_mt, frm.doc.addons_percentage, frm.doc.price_mt_exf);
    },
    total_currency_mt(frm) {
        frm.trigger('calculate_price_mt');
        frm.trigger('calculate_price_pcs');
    },
    freight_cost_mt(frm) {
        frm.trigger('calculate_price_mt');
        frm.trigger('calculate_price_pcs');
        frm.trigger('calculate_currency_conversion');
    },
    total_percentage(frm) {
        frm.trigger('calculate_price_mt');
        frm.trigger('calculate_price_pcs');
        frm.trigger('calculate_currency_conversion');
    },
    price_pcs_exf(frm) {
        frm.trigger('calculate_price_pcs');
        convert_to_company_currency(frm, 'price_pcs_exf', 'base_price_pcs_exf');
    },
    bag_weight(frm) {
        frm.trigger('calculate_price_pcs');
        frm.trigger('calculate_currency_conversion');
    },
    rm_cost(frm) {
        convert_to_company_currency(frm, 'rm_cost', 'base_rm_cost');
        frm.trigger('calculate_currency_conversion');
    },
    conversion(frm) {
        convert_to_company_currency(frm, 'conversion', 'base_conversion');
    },
    price_mt(frm) {
        convert_to_company_currency(frm, 'price_mt', 'base_price_mt');
    },
    price_pcs(frm) {
        convert_to_company_currency(frm, 'price_pcs', 'base_price_pcs');
    },
    ask_price_exf(frm) {
        frm.trigger('calculate_base_ask_price_exf');
        frm.trigger('calculate_currency_conversion');
        frm.trigger('calculate_order_value');
    },
    mt_cnt(frm) {
        frm.trigger('calculate_freight_cost_mt');
    },
    freight_cnt(frm) {
        frm.trigger('calculate_freight_cost_mt');
    },
    commission_currency_mt(frm) {
        calculate_total_currency_mt(frm, "commission_total_currency_mt", frm.doc.commission_currency_mt, frm.doc.commission_percentage, frm.doc.price_mt_exf);
        frm.trigger('calculate_total_currency_mt');
    },
    commission_percentage(frm) {
        calculate_total_currency_mt(frm, "commission_total_currency_mt", frm.doc.commission_currency_mt, frm.doc.commission_percentage, frm.doc.price_mt_exf);
        frm.trigger('calculate_total_percentage');
    },
    addons_currency_mt(frm) {
        calculate_total_currency_mt(frm, "addons_total_currency_mt", frm.doc.addons_currency_mt, frm.doc.addons_percentage, frm.doc.price_mt_exf);
        frm.trigger('calculate_total_currency_mt');
    },
    addons_percentage(frm) {
        calculate_total_currency_mt(frm, "addons_total_currency_mt", frm.doc.addons_currency_mt, frm.doc.addons_percentage, frm.doc.price_mt_exf);
        frm.trigger('calculate_total_percentage');
    },
    commission_total_currency_mt(frm) {
        frm.trigger('calculate_grand_total_currency_mt');
        frm.trigger('calculate_commission_total');
    },
    addons_total_currency_mt(frm) {
        frm.trigger('calculate_grand_total_currency_mt');
        frm.trigger('calculate_addons_total');
    },
    addons_total(frm) {
        frm.trigger('calculate_grand_total');
    },
    commission_total(frm) {
        frm.trigger('calculate_grand_total');
    },
    order_quantity(frm) {
        frm.trigger('calculate_addons_total');
    },
    currency(frm) {
		if (frm.doc.currency) {
			frappe.call({
                method: "erpnext.setup.utils.get_exchange_rate",
                args: {
                    from_currency: frm.doc.currency,
                    to_currency: frm.doc.company_currency,
                    transaction_date: frappe.datetime.get_today()
                },
                callback: function(r) {
                    if (r.message) {
                        let rate = r.message;
                        frappe.model.set_value(cur_frm.doctype, cur_frm.docname, "exchange_rate", rate);
                    }
                }
            });

		}
	},

    // Calculations
    change_field_labels(frm) {
        // Commision section
        frm.fields_dict['commission_currency_mt'].set_label(__(`${frm.doc.currency}/MT`));
        frm.fields_dict['commission_total'].set_label(__(`Total (${frm.doc.currency})`));
        frm.fields_dict['commission_total_currency_mt'].set_label(__(`Total (${frm.doc.currency}/MT)`));

        // Add ons section
        frm.fields_dict['addons_currency_mt'].set_label(__(`${frm.doc.currency}/MT`));
        frm.fields_dict['addons_total'].set_label(__(`Total (${frm.doc.currency})`));
        frm.fields_dict['addons_total_currency_mt'].set_label(__(`Total (${frm.doc.currency}/MT)`));

        // Total section
        frm.fields_dict['total_currency_mt'].set_label(__(`Total (${frm.doc.currency}/MT)`));
        frm.fields_dict['grand_total'].set_label(__(`Grand Total (${frm.doc.currency})`));
        frm.fields_dict['grand_total_currency_mt'].set_label(__(`Grand Total (${frm.doc.currency}/MT)`));
    },
    calculate_price_mt(frm) {
        const price_mt = (frm.doc.price_mt_exf + frm.doc.total_currency_mt + frm.doc.freight_cost_mt) + ((frm.doc.price_mt_exf + frm.doc.total_currency_mt + frm.doc.freight_cost_mt) * (frm.doc.total_percentage / 100));
        frm.set_value("price_mt", price_mt)
    },
    calculate_price_pcs(frm) {
        let price_pcs = 0;
        if (frm.doc.costing_sheet_type == "PE Bag") { 
            price_pcs = (frm.doc.price_pcs_exf + (frm.doc.total_currency_mt + frm.doc.freight_cost_mt) * (frm.doc.bag_weight / 1000000)) + 
                        ((frm.doc.price_mt_exf + frm.doc.total_currency_mt + frm.doc.freight_cost_mt) * (frm.doc.total_percentage / 100)) * 
                        (frm.doc.bag_weight / 1000000);
        }
        frm.set_value("price_pcs", price_pcs)
    },
    calculate_currency_conversion(frm) {
        let currency_conversion = 0;
		let first_row = frm.doc.items?.[0];
		let uom = first_row.uom;
        if (frm.doc.base_ask_price_exf) {
            if (uom == "Kg") {
                currency_conversion = frm.doc.base_ask_price_exf - frm.doc.rm_cost - frm.doc.freight_cost_mt - frm.doc.total_currency_mt - (((frm.doc.price_mt_exf + frm.doc.total_currency_mt + frm.doc.freight_cost_mt) * (frm.doc.total_percentage / 100)));
                console.log(currency_conversion);
            }
            else if (uom == "Nos") {
                currency_conversion = ((frm.doc.base_ask_price_exf * 1000000 / frm.doc.bag_weight) - frm.doc.rm_cost - frm.doc.freight_cost_mt - frm.doc.total_currency_mt - (((frm.doc.price_mt_exf + frm.doc.total_currency_mt + frm.doc.freight_cost_mt) * (frm.doc.total_percentage / 100))));
            }
            else {
                currency_conversion = 0;
            }
        }
        frm.set_value("currency_conversion", currency_conversion);  
    },
    calculate_base_ask_price_exf(frm) {
        if (frm.doc.exchange_rate) {
            const base_ask_price_exf = frm.doc.ask_price_exf / frm.doc.exchange_rate;
            frm.set_value("base_ask_price_exf", base_ask_price_exf);
        }
    },
    calculate_order_value(frm) {
        let order_value = 0;
		let first_row = frm.doc.items?.[0];
		let qty = first_row.qty;
		let uom = first_row.uom;

        if (uom == "Kg") {
            order_value = frm.doc.ask_price_exf * qty / 1000;
        }
        else {
            order_value = qty * frm.doc.ask_price_exf;
        }
        frm.set_value("order_value", order_value);
    },
    calculate_freight_cost_mt(frm) {
        let freight_cost_mt = 0;
        if (frm.doc.mt_cnt){
            freight_cost_mt = frm.doc.freight_cnt / frm.doc.mt_cnt;
        }
        frm.set_value("freight_cost_mt", freight_cost_mt);
    },
    calculate_commission_total(frm) {
        frm.call({
            method: "get_commission_total",
            doc: frm.doc,
            callback(r) {
                if (r && r.message) {
                    frm.set_value("commission_total", r.message)
                }
                else {
                    frm.set_value("commission_total", r.message)
                }
            },
        });
    },
    calculate_total_currency_mt(frm) {
        const total_currency_mt = frm.doc.commission_currency_mt + frm.doc.addons_currency_mt;
        frm.set_value("total_currency_mt", total_currency_mt);
    },
    calculate_total_percentage(frm) {
        const total_percentage = frm.doc.commission_percentage + frm.doc.addons_percentage;
        frm.set_value("total_percentage", total_percentage);
    },
    calculate_grand_total(frm) {
        const grand_total = frm.doc.commission_total + frm.doc.addons_total;
        frm.set_value("grand_total", grand_total);
    },
    calculate_grand_total_currency_mt(frm) {
        const grand_total_currency_mt = frm.doc.commission_total_currency_mt + frm.doc.addons_total_currency_mt;
        frm.set_value("grand_total_currency_mt", grand_total_currency_mt);
    },
    calculate_addons_total(frm) {
        const addons_total = frm.doc.addons_total_currency_mt * frm.doc.order_quantity / 1000;
        frm.set_value("addons_total", addons_total);
    },
});

frappe.ui.form.on("Costing Sheet PE Item", {
    uom(frm, cdt, cdn) {
        frm.trigger('calculate_currency_conversion');
        frm.trigger('calculate_order_value');
    },
    qty(frm, cdt, cdn) {
        // let row = locals[cdt][cdn];
        frm.trigger('calculate_order_value');
        // frappe.db.set_value("Technical Sheet PE", frm.doc.technical_sheet, "costing_sheet_qty", row.qty)
    },
});

function calculate_total_currency_mt(frm, total_currency_mt_field, currency_mt, percentage, price_mt_exf) {
    const total_currency_mt = currency_mt + ((percentage / 100) * price_mt_exf);
    frm.set_value(total_currency_mt_field, total_currency_mt)
}

function convert_to_company_currency(frm, currency_field, base_currency_field) {
    const converted_value = frm.doc[currency_field] * frm.doc.exchange_rate;
    frm.set_value(base_currency_field, converted_value);
}