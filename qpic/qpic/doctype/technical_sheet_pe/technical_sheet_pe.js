// Copyright (c) 2026, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on("Technical Sheet PE", {
    // Events
	refresh(frm) {
        frm.trigger('change_field_labels');

        // Button to create Costing Sheet
        frm.add_custom_button(__('Costing Sheet'), function() {
            frm.call({
                method: "make_costing_sheet",
                doc: frm.doc,
                callback(r) {
                    if (r && r.message) {
                        frappe.set_route("Form", "Costing Sheet PE", r.message);
                    }
                },
            })
        });

        // Alertuser, if the currency is in QAR 
        if (frm.doc.currency === "QAR") {
            frm.dashboard.clear_headline();
            frm.dashboard.add_comment(
                __("The currency is currently set to QAR. Please update it if this is not correct"),
                "yellow",
                true
            );
        }
	},
    setup(frm) {
        frm.set_query('item_code', 'pe_roll_others', function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];

            return {
                filters: {
                    item_group: row.item_group
                }
            };
        });

        frm.set_query('item_code', 'pe_bag_others', function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];

            return {
                filters: {
                    item_group: row.item_group
                }
            };
        });
    },

    // Fields
    production_wastage_roll(frm) {
        frm.call({
            method: "calculate_raw_material_combination",
            doc: frm.doc,
        })
    },
    bag_color(frm) {
        frm.set_value("color", frm.doc.bag_color);
    },
    roll_color(frm) {
        frm.set_value("color", frm.doc.roll_color);
    },
    bag_width(frm) {
        if (frm.doc.bag_width) {
            frm.set_value("external_width", frm.doc.bag_width);
        }
        else {
            frm.set_value("external_width", 0);
        }
        
        frm.trigger('calculate_width');
        frm.trigger('calculate_gusset');
    },
    external_length(frm) {
        frm.trigger("calculate_bag_weight");
        frm.trigger("calculate_printing_hrs_bag");
    },
    wtmtr_g(frm) {
        frm.trigger("calculate_bag_weight");
        frm.set_value("printing_mtrmt", (1/frm.doc.wtmtr_g)*1000000)
    },
    roll_width(frm) {
        frm.trigger('calculate_width');
        frm.trigger('calculate_gusset');
    },
    roll_gusset_1(frm) {
        frm.trigger('calculate_width');
        frm.trigger('calculate_gusset');
    },
    roll_gusset_2(frm) {
        frm.trigger('calculate_width');
        frm.trigger('calculate_gusset');
    },
    gusset_1(frm) {
        frm.trigger('calculate_width');
        frm.trigger('calculate_gusset');
    },
    gusset_2(frm) {
        frm.trigger('calculate_width');
        frm.trigger('calculate_gusset');
    },
    thickness_micron(frm) {
        frm.trigger('calculate_thickness');
    },
    bag_thickness(frm) {
        frm.trigger('calculate_thickness');
    },
    workstation(frm) {
        frm.trigger('calculate_speed');
    },
    speed_factor(frm) {
        frm.trigger('calculate_speed');
    },
    speed(frm) {
        frm.trigger('calculate_output_kghr');
    },
    width(frm) {
        frm.trigger('calculate_output_kghr');
        frm.trigger('get_pe_roll_name');
        frm.trigger('calculate_wtmtr_g');
    },
    thickness(frm) {
        frm.trigger('calculate_output_kghr');
        frm.trigger('get_pe_roll_name');
        frm.trigger('calculate_wtmtr_g');
        frm.trigger('calculate_wtsqm_g');
    },
    color(frm) {
        frm.trigger('get_pe_roll_name');
    },
    gusset(frm) {
        frm.trigger('calculate_output_kghr');
    },
    width_factor(frm) {
        frm.trigger('calculate_output_kghr');
        frm.trigger('calculate_wtmtr_g');
    },
    roll_type(frm) {
        frm.trigger('calculate_wtmtr_g');
    },
    density_kgcbm(frm) {
        frm.trigger('calculate_wtmtr_g');
        frm.trigger('calculate_wtsqm_g');
    },
    output_kghr(frm) {
        frm.set_value("bf_output_kghr", frm.doc.output_kghr || 0);
    },
    bf_output_kghr(frm) {
        frm.set_value("bf_hrsmt", 1000/frm.doc.bf_output_kghr || 0);
    },
    printing_mtrmt(frm) {
        frm.trigger('calculate_printing_hrsmt');
    },
    roll_printing_speed(frm) {
        frm.trigger('calculate_printing_hrsmt');
    },
    pe_roll_material_combination(frm) {
        // Update PE Roll Items based on selected raw material combination
        if (frm.doc.pe_roll_material_combination) {
            frm.clear_table("pe_roll_items");
            frm.doc.raw_material_combination.forEach(rm => {
                let row = frm.add_child("pe_roll_items");
                frappe.model.set_value(row.doctype, row.name, "item_code", rm.item_code);
                frappe.model.set_value(row.doctype, row.name, "item_name", rm.item_name);
                frappe.model.set_value(row.doctype, row.name, "item_group", rm.item_group);
                frappe.model.set_value(row.doctype, row.name, "dosage", rm.total_dosage);
                frappe.model.set_value(row.doctype, row.name, "qty", (rm.total_dosage / 100) * (1 + (frm.doc.production_wastage_roll / 100)));
                frappe.model.set_value(row.doctype, row.name, "uom", rm.uom);
            });
            frm.refresh_field("pe_roll_items");
        }
    },
    currency(frm) {
        // Get exchage rate for currency conversion
		if (frm.doc.currency && frm.doc.company) {
			frappe.db.get_value("Company", frm.doc.company, "default_currency")
				.then(r => {
					if (r.message && r.message.default_currency) {

						let company_currency = r.message.default_currency;

						frappe.call({
							method: "erpnext.setup.utils.get_exchange_rate",
							args: {
								from_currency: frm.doc.currency,
								to_currency: company_currency,
								transaction_date: frappe.datetime.get_today()
							},
							callback: function(res) {
								if (res.message) {
									frm.set_value("exchange_rate", res.message);
								}
							}
						});

					}
				});
			frappe.db.get_value("Company", frm.doc.company, "default_currency")
				.then(r => {
					if (r.message && r.message.default_currency) {

						let company_currency = r.message.default_currency;

						frappe.call({
							method: "erpnext.setup.utils.get_exchange_rate",
							args: {
								from_currency:company_currency,
								to_currency: frm.doc.currency,
								transaction_date: frappe.datetime.get_today()
							},
							callback: function(res) {
								if (res.message) {
									frm.set_value("company_exchange", res.message);
								}
							}
						});

					}
				});
		}
	},
    pe_roll_total_cost(frm) {
        // update selling price based on total cost
        frm.set_value("selling_price", (frm.doc.pe_roll_total_cost || 0) * 1.06);
    },
    selling_price(frm) {
        frm.trigger("calculate_conversion");
    },
    material_cost(frm) {
        frm.trigger("calculate_conversion");
    },
    cutting(frm) {
        if (frm.doc.cutting) {
            frappe.db.get_value("PE Cutting", frm.doc.cutting, "multiply_with_ts_pe_length").then(r=> {
                if (r.message.multiply_with_ts_pe_length) {
                    const conversion_bags__hr = (frm.doc.conversion_bags__hr || 0) / ((frm.doc.external_length || 0) / 100);
                    setTimeout(() => {
                        frm.set_value("conversion_bags__hr", Math.round(conversion_bags__hr));
                    }, 100);
                }
            })
        }
    },
    t_cut(frm) {
        frm.trigger('calculate_ban__dcut_area_sqm');
    },
    d_cut(frm) {
        frm.trigger('calculate_ban__dcut_area_sqm');
    },
    wtsqm_g(frm) {
        frm.trigger('calculate_ban__dcut_weight_g');
    },
    ban__dcut_area_sqm(frm) {
        frm.trigger('calculate_ban__dcut_weight_g');
    },
    printing(frm) {
        frm.trigger('calculate_printing_hrs_bag');
    },
    conversion_act_currencymt(frm) {
        frm.trigger('calculate_conversion_act_currencypcs');
    },
    bag_weight_g(frm) {
        frm.trigger('calculate_conversion_act_currencypcs');
        frm.trigger('calculate_conversion_quot_currencypcs');
        frm.trigget('calculate_overhead_currencymt');
        frm.trigger('calculate_material_cost_currencymt');
    },
    conversion_quot_currencymt(frm) {
        frm.trigger('calculate_conversion_quot_currencypcs');
    },
    overhead_currencypcs(frm) {
        frm.trigger('calculate_overhead_currencymt');
    },
    pe_bag_material_combination(frm) {
        if (frm.doc.pe_bag_material_combination) {
            // Get sub group from the items table in the details tab
            let first_row = frm.doc.items?.[0];
            if (!first_row) return Promise.resolve(0);
            let sub_group = first_row.sub_group;
            
            // Item data for the SFG
            const qty = (frm.doc.bag_weight_g + frm.doc.ban__dcut_weight_g) * (1 + (frm.doc.production_wastage_bag / 100));
            const base_rate = (frm.doc.base_pe_roll_total_cost - frm.doc.base_core_amount) / 1000 / 1000
            const base_amount = qty * base_rate;
            const amount = base_amount * frm.doc.exchange_rate;
            const rate = base_rate * frm.doc.exchange_rate;

            // Adding SFG item
            frm.clear_table("pe_bag_items");
            let row = frm.add_child("pe_bag_items");
            frappe.model.set_value(row.doctype, row.name, "item_code", frm.doc.pe_roll);
            frappe.model.set_value(row.doctype, row.name, "item_name", frm.doc.pe_roll);
            frappe.model.set_value(row.doctype, row.name, "description", frm.doc.pe_roll);
            frappe.model.set_value(row.doctype, row.name, "item_group", sub_group);
            frappe.model.set_value(row.doctype, row.name, "qty", qty);
            frappe.model.set_value(row.doctype, row.name, "uom", "Gram");
            frappe.model.set_value(row.doctype, row.name, "rate", rate);
            frappe.model.set_value(row.doctype, row.name, "base_rate", base_rate);
            frappe.model.set_value(row.doctype, row.name, "amount", amount);
            frappe.model.set_value(row.doctype, row.name, "base_amount", base_amount);
            frappe.model.set_value(row.doctype, row.name, "is_sfg", 1);
            
            frm.set_value("pe_roll_quantity", qty) // Capture PE Roll Qty for future use

            // Add Printing and Thinner
            if (frm.doc.technical_sheet_type == "PE Bag") {
                frappe.call({
                    method: "qpic.qpic.doctype.technical_sheet_pe.technical_sheet_pe.get_item_details_for_pe_bag",
                    args: {
                        printing: frm.doc.printing,
                        external_length: frm.doc.external_length,
                        price_list: frm.doc.price_list,
                        exchange_rate: frm.doc.exchange_rate,
                    },
                    freeze: true,
                    callback(r) {
                        if (r.message) {
                            r.message.forEach(itm => {
                                let row = frm.add_child("pe_bag_items");

                                frappe.model.set_value(row.doctype, row.name, "item_code", itm.item_code);
                                frappe.model.set_value(row.doctype, row.name, "item_name", itm.item_name);
                                frappe.model.set_value(row.doctype, row.name, "description", itm.item_name);
                                frappe.model.set_value(row.doctype, row.name, "item_group", itm.item_group);
                                frappe.model.set_value(row.doctype, row.name, "uom", itm.uom);
                                frappe.model.set_value(row.doctype, row.name, "qty", itm.qty);
                                frappe.model.set_value(row.doctype, row.name, "rate", itm.rate);
                                frappe.model.set_value(row.doctype, row.name, "base_rate", itm.base_rate);
                                frappe.model.set_value(row.doctype, row.name, "amount", itm.amount);
                                frappe.model.set_value(row.doctype, row.name, "base_amount", itm.base_amount);

                                frm.refresh_field("pe_bag_items");
                            });
                        }
                    }
                });
                frm.refresh_field("pe_bag_items");
            }
            frm.refresh_field("pe_bag_items");
        }
    },
    material_cost_currencypiece(frm) {
        frm.trigger('calculate_material_cost_currencymt');
    },
    overhead_currencymt(frm) {
        frm.trigger('calculate_cost__mt');
    },
    material_cost_currencymt(frm) {
        frm.trigger('calculate_cost__mt');
        frm.trigger('calculate_conversion_act_currencymt');
    },
    cost__mt(frm) {
        frm.trigger('calculate_selling_price_act_currencymt');
    },

    // Calculations
    calculate_bag_weight(frm) {
        if (frm.doc.external_length && frm.doc.external_length > 0) {
            let bag_weight = (frm.doc.wtmtr_g || 0) * frm.doc.external_length / 100;
            frm.set_value("bag_weight", bag_weight || 0);
            frm.set_value("bag_weight_g", bag_weight || 0);
        }
        else {
            frm.set_value("bag_weight", 0);
            frm.set_value("bag_weight_g", 0);
        }
    },
    calculate_width(frm) {
        let width = 0;
        if (frm.doc.technical_sheet_type == "PE Roll") {
            width = frm.doc.roll_width + frm.doc.roll_gusset_1 + frm.doc.roll_gusset_2
        }
        else {
            width = frm.doc.bag_width + frm.doc.gusset_1 + frm.doc.gusset_2
        }
        frm.set_value("width", width || 0);
    },
    calculate_thickness(frm) {
        let thickness = 0;
        if (frm.doc.technical_sheet_type == "PE Roll") {
            thickness = frm.doc.thickness_micron;
        }
        else {
            thickness = frm.doc.bag_thickness;
        }
        frm.set_value("thickness", thickness || 0);
    },
    calculate_gusset(frm) {
        let gusset = 0;
        if (frm.doc.technical_sheet_type == "PE Roll") {
            gusset = `${frm.doc.roll_width || 0}+${frm.doc.roll_gusset_1 || 0}+${frm.doc.roll_gusset_2 || 0}`;
        }
        else {
            gusset = `${frm.doc.bag_width || 0}+${frm.doc.gusset_1 || 0}+${frm.doc.gusset_2 || 0}`;
        }
        frm.set_value("gusset", gusset || 0);
    },
    calculate_speed(frm) {
        if (frm.doc.workstation) {
            frappe.db.get_value("Workstation", frm.doc.workstation, "custom_line_speed").then(r => {
                const line_speed = (r.message.custom_line_speed || 0) * frm.doc.speed_factor;
                frm.set_value("speed", line_speed);
            });
        }
        else {
            frm.set_value("speed", 0);
        }
    },
    calculate_output_kghr(frm) {
        if (frm.doc.roll_type) {
            const output_kghr = ((frm.doc.speed * (frm.doc.width / 100) * (frm.doc.thickness /1000000 ) * 920 * 60)) * frm.doc.width_factor;
            frm.set_value("output_kghr", output_kghr);
        }
        else {
            frm.set_value("output_kghr", 0);
        }
    },
    get_pe_roll_name(frm) {
        data = `PE Roll ${frm.doc.width}(${frm.doc.gusset}) Cm W X ${frm.doc.thickness} µ ${frm.doc.color}`
        frm.set_value("pe_roll", data);
    },
    calculate_wtmtr_g(frm) {
        // need to calculate
        value = frm.doc.width / 100 * 2 * frm.doc.thickness / 1000000 * frm.doc.density_kgcbm * 1000 / (frm.doc.width_factor || 2);
        frm.set_value("wtmtr_g", value);
    },
    calculate_printing_hrsmt(frm) {
        if (frm.doc.roll_printing_speed == 0) {
            frm.set_value("printing_hrsmt", 0);
        }
        else {
            frm.set_value("printing_hrsmt", (frm.doc.printing_mtrmt / (frm.doc.roll_printing_speed * 60)) || 0);
        }
    },
    calculate_conversion(frm) {
        const conversion = (frm.doc.selling_price || 0) - (frm.doc.material_cost || 0);
        frm.set_value("conversion", conversion);
    },
    change_field_labels(frm) {
        // PE Bag section
        frm.fields_dict['conversion_act_currencypcs'].set_label(__(`Conversion Act (${frm.doc.currency}/Pcs)`));
        frm.fields_dict['overhead_currencypcs'].set_label(__(`Overhead (${frm.doc.currency}/Pcs)`));
        frm.fields_dict['material_cost_currencypiece'].set_label(__(`Material Cost (${frm.doc.currency}/Pcs)`));
        frm.fields_dict['conversion_quot_currencypcs'].set_label(__(`Conversion Quot (${frm.doc.currency}/Pcs)`));
        frm.fields_dict['overhead_currencymt'].set_label(__(`Overhead (${frm.doc.currency}/MT)`));
        frm.fields_dict['selling_price_act_currencymt'].set_label(__(`Selling Price Act (${frm.doc.currency}/MT)`));
        frm.fields_dict['material_cost_currencymt'].set_label(__(`Material Cost (${frm.doc.currency}/MT)`));
        frm.fields_dict['conversion_act_currencymt'].set_label(__(`Conversion Act (${frm.doc.currency}/MT)`));
        frm.fields_dict['conversion_quot_currencymt'].set_label(__(`Conversion Quot (${frm.doc.currency}/MT)`));

        // PE Roll section
        frm.fields_dict['overhead'].set_label(__(`Overhead (${frm.doc.currency})`));
        frm.fields_dict['material_cost'].set_label(__(`Material Cost (${frm.doc.currency})`));
        frm.fields_dict['conversion'].set_label(__(`Conversion (${frm.doc.currency})`));
        frm.fields_dict['selling_price'].set_label(__(`Selling Price (${frm.doc.currency})`));
        frm.fields_dict['pe_roll_total_cost'].set_label(__(`Total Cost (${frm.doc.currency})`));

        // PE Bag Section
        frm.fields_dict['pe_bag_total_cost'].set_label(__(`Total Cost (${frm.doc.currency})`));
    },
    calculate_ban__dcut_area_sqm(frm) {
        let value = 0;
        if (frm.doc.t_cut) {
            value = frm.doc.actual_cut_area_sqcm / 10000;
            frm.set_value("ban__dcut_area_sqm", value);
            return
        }
        else if (frm.doc.d_cut) {
            value = frm.doc.area / 10000
            frm.set_value("ban__dcut_area_sqm", value);
            return
        }
        else {
            frm.set_value("ban__dcut_area_sqm", value);
            return
        }
    },
    calculate_wtsqm_g(frm) {
        const wtsqm_g = 1 * 2 * frm.doc.thickness / 1000000 * frm.doc.density_kgcbm * 1000
        frm.set_value("wtsqm_g", wtsqm_g)
    },
    calculate_ban__dcut_weight_g(frm) {
        const ban__dcut_weight_g = frm.doc.wtsqm_g * frm.doc.ban__dcut_area_sqm;
        frm.set_value("ban__dcut_weight_g", ban__dcut_weight_g);
    },
    calculate_printing_hrs_bag(frm) {
        let printing_hrs_bag = 0;
        if (frm.doc.technical_sheet_type == "PE Bag") {
            printing_hrs_bag = (1 / (frm.doc.printing_speed *60 ) * (frm.doc.external_length / 100));
        }
        else {
            printing_hrs_bag = 0;
        }
        frm.set_value("printing_hrs_bag", printing_hrs_bag)
    },
    calculate_conversion_act_currencypcs(frm) {
        const conversion_act_currencypcs = frm.doc.conversion_act_currencymt * frm.doc.bag_weight_g / 1000000;
        frm.set_value("conversion_act_currencypcs", conversion_act_currencypcs);
    },
    calculate_conversion_quot_currencypcs(frm) {
        const conversion_quot_currencypcs = frm.doc.conversion_quot_currencymt * frm.doc.bag_weight_g / 1000000;
        frm.set_value("conversion_quot_currencypcs", conversion_quot_currencypcs);
    },
    calculate_overhead_currencymt(frm) {
        const overhead_currencymt = frm.doc.overhead_currencypcs * 1000000 / frm.doc.bag_weight_g;
        frm.set_value("overhead_currencymt", overhead_currencymt);
    },
    calculate_material_cost_currencymt(frm) {
        const material_cost_currencymt = frm.doc.material_cost_currencypiece * 1000000 / frm.doc.bag_weight_g;
        frm.set_value("material_cost_currencymt", material_cost_currencymt);
    },
    calculate_cost__mt(frm) {
        const cost__mt = frm.doc.overhead_currencymt + frm.doc.material_cost_currencymt;
        frm.set_value("cost__mt", cost__mt);
    },
    calculate_conversion_act_currencymt(frm) {
        const conversion_act_currencymt = frm.doc.selling_price_act_currencymt - frm.doc.material_cost_currencymt
        frm.set_value("conversion_act_currencymt", conversion_act_currencymt);
    },
    calculate_selling_price_act_currencymt(frm) {
        // Need to calculate
        const cost_sheet_c18 = 0;
        const cost_sheet_d18 = 0;
        const selling_price_act_currencymt =  (frm.doc.cost__mt * (1.06 + cost_sheet_d18)) + cost_sheet_c18
        frm.set_value("selling_price_act_currencymt", selling_price_act_currencymt);
    },
    calculate_conversion_quot_currencymt(frm) {
        if (frm.doc.technical_sheet_type == "PE Bag") {
            const conversion_quot_currencymt = 0;
            frm.set_value("conversion_quot_currencymt", conversion_quot_currencymt)
        }
    },
});

frappe.ui.form.on("Technical Sheet PE Raw Material Combination", {
    layer_1_dosage(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        calculate_qty(cdt, cdn, row.layer_1_dosage, "layer_1_qty");
        calculate_material_combination_totals(frm);
    },
    layer_2_dosage(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        calculate_qty(cdt, cdn, row.layer_2_dosage, "layer_2_qty");
        calculate_material_combination_totals(frm);
    },
    layer_3_dosage(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        calculate_qty(cdt, cdn, row.layer_3_dosage, "layer_3_qty");
        calculate_material_combination_totals(frm);
    },
    layer_1_qty(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        const qty = row.layer_1_qty + row.layer_2_qty + row.layer_3_qty;
        frappe.model.set_value(cdt, cdn, "total_qty_kg", qty);
        calculate_material_combination_totals(frm);
    },
    layer_2_qty(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        const qty = row.layer_1_qty + row.layer_2_qty + row.layer_3_qty;
        frappe.model.set_value(cdt, cdn, "total_qty_kg", qty);
        calculate_material_combination_totals(frm);
    },
    layer_3_qty(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        const qty = row.layer_1_qty + row.layer_2_qty + row.layer_3_qty;
        frappe.model.set_value(cdt, cdn, "total_qty_kg", qty);
        calculate_material_combination_totals(frm);
    },
    total_dosage(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        calculate_material_combination_totals(frm);
    },
    total_qty_kg(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        calculate_material_combination_totals(frm);
    },
     
});

function calculate_material_combination_totals(frm) {
    let l1_dosage = 0;
    let l2_dosage = 0;
    let l3_dosage = 0;
    let l1_qty = 0;
    let l2_qty = 0;
    let l3_qty = 0;
    let total_dosage = 0;
    let total_qty_kg = 0;
    let total_qty_kgmt = 0;
    let total_qty_kgso = 0;
    let density= 0;

    frm.doc.raw_material_combination.forEach(rm => {
        rm.total_dosage = rm.total_qty_kg / frm.doc.total_qty_kg * 100;
        rm.total_qty_kgmt = rm.total_dosage / 100 * 1000;
        rm.total_qty_kgso = (rm.total_qty_kgmt * frm.doc.pe_roll_in_kg / 1000) * (1 + (frm.doc.production_wastage_roll / 100));
        rm.density = rm.total_qty_kgmt / rm.volume;

        l1_dosage += flt(rm.layer_1_dosage);
        l2_dosage += flt(rm.layer_2_dosage);
        l3_dosage += flt(rm.layer_3_dosage);
        l1_qty += flt(rm.layer_1_qty);
        l2_qty += flt(rm.layer_2_qty);
        l3_qty += flt(rm.layer_3_qty);
        total_dosage += flt(rm.total_dosage);
        total_qty_kg += flt(rm.total_qty_kg);
        total_qty_kgmt += flt(rm.total_qty_kgmt);
        total_qty_kgso += flt(rm.total_qty_kgso);
    });

    frm.refresh_field("raw_material_combination")
    frm.set_value("l1_dosage", l1_dosage);
    frm.set_value("l2_dosage", l2_dosage);
    frm.set_value("l3_dosage", l3_dosage);
    frm.set_value("l1_qty", l1_qty);
    frm.set_value("l2_qty", l2_qty);
    frm.set_value("l3_qty", l3_qty);
    frm.set_value("total_dosage", total_dosage);
    frm.set_value("total_qty_kg", total_qty_kg);
    frm.set_value("total_qty_kgmt", total_qty_kgmt);
    frm.set_value("total_qty_kgso", total_qty_kgso);

    frm.trigger('calculate_wtmtr_g');
    frm.trigger('calculate_wtsqm_g');
}

frappe.ui.form.on("Technical Sheet PE Roll Item", {
    // Fields
    item_code(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        if (row.item_code) {
            frappe.call({
                method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_raw_materials_itemwise",
                args: {
                    item_code:row.item_code,
                    exchange_rate: frm.doc.exchange_rate || 1
                },
                callback: function (r) {
                    if (r.message) {


                            frappe.model.set_value(cdt, cdn, "item_name", r.message.item_name);
                            frappe.model.set_value(cdt, cdn, "uom", r.message.uom);
                            frappe.model.set_value(cdt, cdn, "base_rate", r.message.base_rate);
                            frappe.model.set_value(cdt, cdn, "rate", r.message.rate);
                            frappe.model.set_value(cdt, cdn, "description", r.message.description);

                            frm.trigger('calculate_amount', cdt, cdn);
							frm.refresh_fields("pe_roll_items");
                    }
                }
            });
        }
    },
    dosage(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const wastage = flt(frm.doc.production_wastage_roll);
        const dosage = flt(row.dosage) || 0;
        const qty = (dosage / 100) * (1 + wastage / 100);
        frappe.model.set_value(cdt, cdn, "qty", qty);
        frm.refresh_fields("pe_roll_items");
    },
    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },

    qty(frm, cdt, cdn) {
	    frm.trigger('calculate_amount', cdt, cdn);
    },
    amount(frm, cdt, cdn) {
        calculate_material_cost(frm);
        calculate_pe_tables_total_amount(frm, "pe_roll_items", "pe_roll_others", "pe_roll_total_cost", "base_pe_roll_total_cost");
    },
	
    // Calculations
    calculate_amount(frm, cdt, cdn) {
		const row = locals[cdt][cdn];

		const qty = flt(row.qty);
		const base_rate = flt(row.base_rate);
		const exchange_rate = flt(frm.doc.exchange_rate) || 1; // USD -> QAR

		// QAR
		let base_amount = qty * base_rate;

		// USD
		let rate = flt(row.base_rate) / exchange_rate;
		let amount = flt(row.qty) * flt(row.base_rate) / exchange_rate;

		frappe.model.set_value(cdt, cdn, "rate", rate);
		frappe.model.set_value(cdt, cdn, "base_amount", base_amount);
		frappe.model.set_value(cdt, cdn, "amount", amount);
		frm.refresh_fields("pe_roll_items");
	}
});


frappe.ui.form.on("Technical Sheet PE Roll Others", {
    // Fields
    item_code(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        if (row.item_code) {
            frappe.call({
                method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_raw_materials_itemwise",
                args: {
                    item_code:row.item_code,
                    exchange_rate: frm.doc.exchange_rate || 1
                },
                callback: function (r) {
                    if (r.message) {


                            frappe.model.set_value(cdt, cdn, "item_name", r.message.item_name);
                            frappe.model.set_value(cdt, cdn, "uom", r.message.uom);
                            frappe.model.set_value(cdt, cdn, "base_rate", r.message.base_rate);
                            frappe.model.set_value(cdt, cdn, "rate", r.message.rate);
                            frappe.model.set_value(cdt, cdn, "description", r.message.description);

                            frm.trigger('calculate_amount', cdt, cdn);
							frm.refresh_fields("pe_roll_items");
                    }
                }
            });
        }
    },
    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },
    qty(frm, cdt, cdn) {
	    frm.trigger('calculate_amount', cdt, cdn);
    },
    amount(frm, cdt, cdn) {
        calculate_material_cost(frm);
        calculate_pe_tables_total_amount(frm, "pe_roll_items", "pe_roll_others", "pe_roll_total_cost", "base_pe_roll_total_cost");
    },
	
    // Calculations
    calculate_amount(frm, cdt, cdn) {
		const row = locals[cdt][cdn];

		const qty = flt(row.qty);
		const base_rate = flt(row.base_rate);
		const exchange_rate = flt(frm.doc.exchange_rate) || 1; // USD -> QAR

		// QAR
		let base_amount = qty * base_rate;

		// USD
		let rate = flt(row.base_rate) / exchange_rate;
		let amount = flt(row.qty) * flt(row.base_rate) / exchange_rate;

		frappe.model.set_value(cdt, cdn, "rate", rate);
		frappe.model.set_value(cdt, cdn, "base_amount", base_amount);
		frappe.model.set_value(cdt, cdn, "amount", amount);
		frm.refresh_fields("pe_roll_items");
	}
});


frappe.ui.form.on("Technical Sheet PE Bag Item", {
    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },

    qty(frm, cdt, cdn) {
	    frm.trigger('calculate_amount', cdt, cdn);
    },
    amount(frm, cdt, cdn) {
        calculate_pe_tables_total_amount(frm, "pe_bag_items", "pe_bag_others", "pe_bag_total_cost", "base_pe_bag_total_cost");
    },
	
    // Calculations
    calculate_amount(frm, cdt, cdn) {
		const row = locals[cdt][cdn];

		const qty = flt(row.qty);
		const base_rate = flt(row.base_rate);
		const exchange_rate = flt(frm.doc.exchange_rate) || 1; // USD -> QAR

		// QAR
		let base_amount = qty * base_rate;

		// USD
		let rate = flt(row.base_rate) / exchange_rate;
		let amount = flt(row.qty) * flt(row.base_rate) / exchange_rate;

		frappe.model.set_value(cdt, cdn, "rate", rate);
		frappe.model.set_value(cdt, cdn, "base_amount", base_amount);
		frappe.model.set_value(cdt, cdn, "amount", amount);
		frm.refresh_fields("pe_bag_items");
	}
});

frappe.ui.form.on("Technical Sheet PE Bag Others", {
    // Fields
    item_code(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        if (row.item_code) {
            frappe.call({
                method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_raw_materials_itemwise",
                args: {
                    item_code:row.item_code,
                    exchange_rate: frm.doc.exchange_rate || 1
                },
                callback: function (r) {
                    if (r.message) {


                            frappe.model.set_value(cdt, cdn, "item_name", r.message.item_name);
                            frappe.model.set_value(cdt, cdn, "uom", r.message.uom);
                            frappe.model.set_value(cdt, cdn, "base_rate", r.message.base_rate);
                            frappe.model.set_value(cdt, cdn, "rate", r.message.rate);
                            frappe.model.set_value(cdt, cdn, "description", r.message.description);

                            frm.trigger('calculate_amount', cdt, cdn);
							frm.refresh_fields("pe_roll_items");
                    }
                }
            });
        }
    },
    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },
    qty(frm, cdt, cdn) {
	    frm.trigger('calculate_amount', cdt, cdn);
    },
    amount(frm, cdt, cdn) {
        calculate_pe_tables_total_amount(frm, "pe_bag_items", "pe_bag_others", "pe_bag_total_cost", "base_pe_bag_total_cost");
    },
	
    // Calculations
    calculate_amount(frm, cdt, cdn) {
		const row = locals[cdt][cdn];

		const qty = flt(row.qty);
		const base_rate = flt(row.base_rate);
		const exchange_rate = flt(frm.doc.exchange_rate) || 1; // USD -> QAR

		// QAR
		let base_amount = qty * base_rate;

		// USD
		let rate = flt(row.base_rate) / exchange_rate;
		let amount = flt(row.qty) * flt(row.base_rate) / exchange_rate;

		frappe.model.set_value(cdt, cdn, "rate", rate);
		frappe.model.set_value(cdt, cdn, "base_amount", base_amount);
		frappe.model.set_value(cdt, cdn, "amount", amount);
		frm.refresh_fields("pe_roll_items");
	}
});

function calculate_qty(cdt, cdn, dosage, qty_field) {
    const qty = (dosage || 0) / 100 * 1000;
    frappe.model.set_value(cdt, cdn, qty_field, qty);
}

function calculate_material_cost(frm) {
    let total_material_cost = 0;
    let total_material_cost_company_currency = 0;
    frm.doc.pe_roll_items.forEach(item => {
        total_material_cost += flt(item.amount);
        total_material_cost_company_currency += flt(item.base_amount);
    });
    frm.set_value("material_cost", total_material_cost);
    frm.set_value("base_material_cost", total_material_cost_company_currency);
}


function calculate_pe_tables_total_amount(frm, items_table, others_table, total_cost, base_total_cost) {
    let total_amount = 0;
    let base_total_amount = 0;
    let base_core_amount = 0;
    let core_amount = 0;
    let others_total_amount = 0;
    let items_total_amount = 0;
    let pe_roll_item_amount = 0;
    
    frm.doc[items_table].forEach(item => {
        if (item.item_name && item.item_name.toLowerCase().includes("core")) {
            base_core_amount += flt(item.base_amount || 0);
            core_amount += flt(item.amount || 0);
        }

        if (item.item_name && item.item_name == frm.doc.pe_roll) {
            pe_roll_item_amount += flt(item.amount || 0);
        }

        total_amount += flt(item.amount);
        base_total_amount += flt(item.base_amount)
        items_total_amount += flt(item.amount)
    });
    frm.doc[others_table].forEach(other => {
        total_amount += flt(other.amount);
        others_total_amount += flt(other.amount);
        base_total_amount += flt(other.base_amount)
    })

    frm.set_value(total_cost, total_amount);
    frm.set_value(base_total_cost, base_total_amount);
    frm.set_value("base_core_amount", base_core_amount);
    frm.set_value("core_amount", core_amount);
    
    if (others_table == "pe_bag_others" || items_table == "pe_bag_items") {
        const overhead = (frm.doc.overhead / 1000000 * frm.doc.pe_roll_quantity) + flt(others_total_amount)
        frm.set_value("overhead_currencypcs", overhead)

        const material_cost = ((frm.doc.material_cost - frm.doc.core_amount) / 1000000 * frm.doc.pe_roll_quantity) + (flt(items_total_amount) - flt(pe_roll_item_amount))
        frm.set_value("material_cost_currencypiece", material_cost)
    }
}