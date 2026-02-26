// Copyright (c) 2026, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on("Costing Sheet", {
    // Events
	// refresh(frm) {

	// },
     validate(frm) {
        calculate_fabric_items(frm);
        calculate_lamination_items(frm);
        calculate_liner_items(frm);
        calculate_thread_items(frm);
        
    },
    // Fields
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
    commission_percentage(frm) {
        frm.trigger("calculate_commission_total_currency_mt");
        frm.trigger("calculate_commission_total_currency_pcs");
        frm.trigger("calculate_price_mt");
        frm.trigger("calculate_commission_total_currency_pcs");
        frm.trigger("calculate_price_pcs");
    },
    commission_currency_mt(frm) {
        frm.trigger("calculate_commission_total_currency_mt");
        frm.trigger("calculate_commission_total_currency_pcs");
        frm.trigger("calculate_price_mt");
        frm.trigger("calculate_commission_total_currency_pcs");
        frm.trigger("calculate_price_pcs");
    },
    commission_total_currency_mt(frm) {
        calculate_total_currency(frm, frm.doc.commission_total_currency_mt, "commission_total");
    },
    addons_total_currency_mt(frm) {
        calculate_total_currency(frm, frm.doc.addons_total_currency_mt, "addons_total");
    },
    freight_cost_mt(frm) {
        frm.trigger("calculate_price_mt");
        frm.trigger("calculate_commission_total_currency_pcs");
        frm.trigger("calculate_price_pcs");
    },

    // Calculations
    calculate_commission_total_currency_mt: function(frm) {
        const total_currency_mt = (frm.doc.price_mt_exf * flt(frm.doc.commission_percentage) / 100)+ flt(frm.doc.commission_currency_mt);
        frm.set_value("commission_total_currency_mt", total_currency_mt);
    },
    costing_sheet_type(frm){
        calculate_from_technical_sheet(frm);
    },
    calculate_commission_total_currency_pcs: function(frm) {
        let total_currency_pcs = 0;
        if (frm.doc.costing_sheet_type == "Small Bag") {
            total_currency_pcs = (flt(frm.doc.price_pcs_exf) * flt(frm.doc.commission_percentage) / 100) + (flt(frm.doc.commission_currency_mt) * flt(frm.doc.bag_weight) / 1000000)
        }
        frm.set_value("commission_total_currency_pcs", total_currency_pcs)
    },
    calculate_price_mt: function(frm) {
        let price_mt = (frm.doc.price_mt_exf * (1 + frm.doc.commission_percentage / 100)) + frm.doc.commission_currency_mt + frm.doc.freight_cost_mt
        frm.set_value("price_mt", price_mt)
        frm.set_value("base_price_mt", price_mt * frm.doc.exchange_rate)
    },
    calculate_price_pcs: function(frm) {
        let price_pcs = 0;
        if (frm.doc.costing_sheet_type == "Small Bag") {
            price_pcs = (frm.doc.price_pcs_exf * (1 + frm.doc.commission_percentage / 100))+(frm.doc.commission_currency_mt * frm.doc.bag_weight / 1000000)+(frm.doc.freight_cost_mt* frm.doc.bag_weight/1000000);
        }
        else {
            price_pcs = 0;
        }

        frm.set_value("price_pcs", price_pcs);
        frm.set_value("base_price_pcs", price_pcs * frm.doc.exchange_rate);
    },

    // Add-ons Calculation
    // calculate_addons_total_currency_mt(frm) {
    //     let=(((H5+H6)/1.06)*(D18))+C18
    // }
});

// Functions
function calculate_total_currency(frm, total_currency_mt, total_currency_field) {
    let qty = frm.doc.items?.[0].qty;
    let total_currency = 0;
    if (frm.doc.costing_sheet_type == "Fabric") {
        total_currency = (qty / 1000) * total_currency_mt
    }
    else {
        total_currency = (qty * frm.doc.bag_weight / 1000000) * total_currency_mt
    }
    
    frm.set_value(total_currency_field, total_currency)
}
function calculate_fabric_items(frm) {

    if (frm.doc.technical_sheet) {
        frm.clear_table("fabric_items")

        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "Technical Sheet",
                name: frm.doc.technical_sheet
            },
            callback: function (r) {

                if (r.message) {
                    let sheet = r.message;

                    if (sheet.warpmaterial_combination) {

                        sheet.warpmaterial_combination.forEach(i => {
                            let strip_dosage = 0;
                            if (sheet.stripmaterial_combination) {
                                let match = sheet.stripmaterial_combination.find(
                                    s => s.item_code === i.item_code
                                );

                                if (match) {
                                    strip_dosage = match.dosage || 0;
                                }
                            }
                            let cons_value = "";
                            if (i.item_code !== "MB-W" && i.item_code !=="MB-C-L") {
                                cons_value = `${i.dosage}/${strip_dosage}%`;
                            } else {
                                if(i.item_code == "MB-W"){
                                    let warp_value =
                                        frm.doc.tape_warp_color_type === "White"
                                            ? i.dosage
                                            : 0;

                                    let strip_value =
                                        frm.doc.strip1_color_type === "White"
                                            ? strip_dosage
                                            : 0;

                                    cons_value = `${warp_value}/${strip_value}%`;
                                }
                                if(i.item_code == "MB-C-L"){
                                    let warp_value =
                                        frm.doc.tape_warp_color_type === "Light"
                                            ? i.dosage
                                            : 0;

                                    let strip_value =
                                        frm.doc.strip1_color_type === "Light"
                                            ? strip_dosage
                                            : 0;

                                    cons_value = `${warp_value}/${strip_value}%`;
                                }
                                if(i.item_code == "MB-C-D"){
                                    let warp_value =
                                        frm.doc.tape_warp_color_type === "Dark"
                                            ? i.dosage
                                            : 0;
                                    cons_value = `${warp_value}/${warp_value}%`;
                                }
                            }

                            let row = frm.add_child("fabric_items");
                            row.item_code = i.item_code;
                            row.item_name = i.item_name;
                            row.description = i.description;
                            row.rate = i.rate;
                            row.cons__ = cons_value;
                            row.qty = i.qty;
                            row.uom = i.uom;
                            row.conversion_factor = i.conversion_factor;
                        });

                        frm.refresh_field("fabric_items");
                        calculate_from_technical_sheet(frm);
                    }
                }
            }
        });
    }
}
function calculate_lamination_items(frm) {

    if (frm.doc.technical_sheet) {
        frm.clear_table("lamination_items")

        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "Technical Sheet",
                name: frm.doc.technical_sheet
            },
            callback: function (r) {

                if (r.message) {
                    let sheet = r.message;

                    if (sheet.laminationmaterial_combination) {

                        sheet.laminationmaterial_combination.forEach(i => {
                            let cons = ((parseFloat(i.dosage) || 0) / 100)*100;
                            let cons_value = `${cons}%`;
                            let row = frm.add_child("lamination_items");
                            
                            row.item_code = i.item_code;
                            row.item_name = i.item_name;
                            row.description = i.description;
                            row.rate = i.rate;
                            row.cons__ = cons_value;
                            row.qty = i.qty;
                            row.uom = i.uom;
                            row.conversion_factor = i.conversion_factor;
                        });

                        frm.refresh_field("lamination_items");
                        calculate_from_technical_sheet(frm);
                    }
                }
            }
        });
    }
}
function calculate_liner_items(frm) {

    if (frm.doc.technical_sheet) {
        frm.clear_table("liner_items")

        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "Technical Sheet",
                name: frm.doc.technical_sheet
            },
            callback: function (r) {

                if (r.message) {
                    let sheet = r.message;

                    if (sheet.linermaterial_combination) {

                        sheet.linermaterial_combination.forEach(i => {
                            let cons = ((parseFloat(i.dosage) || 0) / 100)*100;
                            let cons_value = `${cons}%`;
                            let row = frm.add_child("liner_items");
                            
                            row.item_code = i.item_code;
                            row.item_name = i.item_name;
                            row.description = i.description;
                            row.rate = i.rate;
                            row.cons__ = cons_value;
                            row.qty = i.qty;
                            row.uom = i.uom;
                            row.conversion_factor = i.conversion_factor;
                        });

                        frm.refresh_field("liner_items");
                        calculate_from_technical_sheet(frm);
                    }
                }
            }
        });
    }
}
function calculate_thread_items(frm) {
    if (frm.doc.technical_sheet) {
        frm.clear_table("thread_ink_items")

        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "Technical Sheet",
                name: frm.doc.technical_sheet
            },
            callback: function (r) {

                if (r.message) {
                    let sheet = r.message;

                    if (sheet.printingmaterial_combination) {
                        sheet.printingmaterial_combination.forEach(i => {
                            let row = frm.add_child("thread_ink_items");
                            
                            row.item_code = i.item_code;
                            row.item_name = i.item_name;
                            row.description = i.description;
                            row.rate = i.rate;
                            row.qty = i.qty;
                            row.uom = i.uom;
                            row.conversion_factor = i.conversion_factor;
                        });

                        frm.refresh_field("thread_ink_items");
                        calculate_from_technical_sheet(frm);
                    }
                }
            }
        });
    }
}
function calculate_from_technical_sheet(frm) {

    if (!frm.doc.technical_sheet) return;

    frappe.db.get_doc("Technical Sheet", frm.doc.technical_sheet)
        .then(ts => {

            let fabric_rafia_qty,ldpe_lamination_qty,ldpe_lamination_value = 0;
            let fabric_rafia_row_value,pp_lamination_qty,pp_lamination_value = 0;
            let fabric_filler_qty,fabric_anti_qty,fabric_anti_value=0;
            let fabric_filler_row_value,fabric_rewhite_qty,fabric_rewhite_value=0;
            let fabric_mbw_qty,fabric_reppmix_qty,fabric_reppmix_value=0;
            let fabric_mbw_value,fabric_tpt_filler_qty,fabric_tpt_filler_value=0;
            let fabric_mbcl_qty,fabric_uvpp_qty,fabric_uvpp_value=0;
            let fabric_mbcl_value,fabric_mbcd_qty,fabric_mbcd_value=0;
            let mfpp_yarn_qty,thinner_qty,printing_ink_qty=0;
            let ldpe_qty,lldpe_qty,hdpe_qty,bio_qty,liner_mbw_qty,liner_antistatic_qty,liner_filler_qty,antiblock_qty=0;
            let re_pemix_qty,re_ppclear_qty,liner_tpt_qty,liner_uvpe_qty=0;
            (ts.tape_item_details || []).forEach(row => {
                if (
                    row.type !== "Fabric" &&
                    row.type !== "Lamination" &&
                    row.type !== "Printing" &&
                    row.type !== "Liner"
                ) {
                    fabric_rafia_qty += flt(row.pp_raffia_grade || 0);
                    fabric_filler_qty += flt(row.filler_masterbatch_pp || 0);
                    fabric_mbw_qty += flt(row.mb_w || 0);
                    fabric_mbcl_qty+= flt(row.mb_c_l || 0);
                    fabric_mbcd_qty+= flt(row.mb_c_d || 0);
                    fabric_uvpp_qty+= flt(row.uv__pp || 0);
                    fabric_tpt_filler_qty+= flt(row.tpt_filler_pp || 0);
                    fabric_reppmix_qty+=flt(row.recycled_pp_mix || 0);
                    fabric_rewhite_qty+=flt(row.recycled_pp_white || 0);
                    fabric_anti_qty+=flt(row.antistatic_mb || 0);
                }
                if (row.type === "Fabric") {
                    fabric_rafia_row_value = flt(row.pp_raffia_grade || 0);
                    fabric_filler_row_value = flt(row.filler_masterbatch_pp || 0);
                    fabric_mbw_value = flt(row.mb_w || 0);
                    fabric_mbcl_value=flt(row.mb_c_l || 0);
                    fabric_mbcd_value=flt(row.mb_c_d || 0);
                    fabric_uvpp_value= flt(row.uv__pp || 0);
                    fabric_tpt_filler_value= flt(row.tpt_filler_pp || 0);
                    fabric_reppmix_value= flt(row.recycled_pp_mix || 0);
                    fabric_rewhite_value= flt(row.recycled_pp_white || 0);
                    fabric_anti_value= flt(row.antistatic_mb || 0);
                    pp_lamination_value=flt(row.pp_lamination_grade || 0);
                    ldpe_lamination_value=flt(row.ldpe_lamination_grade || 0);
                }
                if(row.type=="Lamination"){
                    if(row.item=="PP Lamination Grade"){
                        pp_lamination_qty=flt(row.pp_lamination_grade||0);
                    }
                    if(row.item=="LDPE Lamination Grade"){
                        ldpe_lamination_qty=flt(row.ldpe_lamination_grade||0);
                    }
                }
                if(row.type=="Printing"){
                    if(row.item=="Printing Ink"){
                        printing_ink_qty=flt(row.printing_ink||0);
                    }
                    if(row.item=="Thinner"){
                        thinner_qty=flt(row.thinner||0);
                    }
                    if(row.item!="Thinner" && row.item!="Printing Ink" ){
                        mfpp_yarn_qty=flt(row.mfpp_yarn_1200_denier||0);
                    }

                }
                if(row.type=="Liner"){
                    ldpe_qty=flt(row.ldpe||0);
                    lldpe_qty=flt(row.lldpe||0);
                    hdpe_qty=flt(row.hdpe||0);
                    bio_qty=flt(row.biodegradable||0);
                    liner_mbw_qty=flt(row.liner_mb_w||0);
                    liner_antistatic_qty=flt(row.liner_antistatic_mb||0);
                    liner_filler_qty=flt(row.liner_filler_masterbatch_pe||0);
                    antiblock_qty=flt(row.antiblock||0);
                    re_pemix_qty=flt(row.liner_recycled_pe_mix||0);
                    re_ppclear_qty=flt(row.liner_recycled_pe_clear||0);
                    re_ppclear_qty=flt(row.liner_recycled_pe_clear||0);
                    liner_tpt_qty=flt(row.liner_tpt_filler__pe||0);
                    liner_uvpe_qty=flt(row.liner_uv_pe||0);

                }
            });
            let result_raffia,result_ppmix,result_ppwhite,result_anti,result_pp_lamination,result_ldpe_lamination = 0;
            let result_filler,result_uvpp,result_tpt_filler=0;
            let result_mbw,result_mbcl,result_mbcd,result_thinner,result_ink,result_denier=0;
            let result_ldpe,result_lldpe,result_hdpe,result_bio,result_liner_mbw,result_antistatic,result_filler_master,result_antiblock=0;
            let result_re_pe_mix,result_re_pe_clear,result_liner_tpt_filler,result_uvpe=0;
            if (frm.doc.costing_sheet_type === "Fabric") {
                result_raffia = fabric_rafia_qty * 1000;
                result_filler=fabric_filler_qty*1000;
                result_mbw=fabric_mbw_qty*1000;
                result_mbcl=fabric_mbcl_qty*1000;
                result_mbcd=fabric_mbcd_qty*1000;
                result_uvpp=fabric_uvpp_qty*1000;
                result_tpt_filler=fabric_tpt_filler_qty*1000;
                result_ppmix=fabric_reppmix_qty*1000;
                result_ppwhite=fabric_rewhite_qty*1000;
                result_anti=fabric_anti_qty*1000;
                result_pp_lamination=pp_lamination_qty*1000;
                result_ldpe_lamination=ldpe_lamination_qty*1000;
            } else {
                result_raffia = fabric_rafia_row_value * 1000;
                result_filler=fabric_filler_row_value*1000;
                result_mbw=fabric_mbw_value*1000;
                result_mbcl=fabric_mbcl_value*1000;
                result_mbcd=fabric_mbcd_value*1000;
                result_uvpp=fabric_uvpp_value*1000;
                result_tpt_filler=fabric_tpt_filler_value*1000;
                result_ppmix=fabric_reppmix_value*1000;
                result_ppwhite=fabric_rewhite_value*1000;
                result_anti=fabric_anti_value*1000;
                result_pp_lamination=pp_lamination_value*1000;
                result_ldpe_lamination=ldpe_lamination_value*1000;
            }
            (frm.doc.fabric_items || []).forEach(row => {
                if (row.item_name === "PP Raffia Grade") {
                    row.qty_in_kgs_mt = result_raffia; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if (row.item_name === "Filler Masterbatch (PP)") {
                    row.qty_in_kgs_mt = result_filler; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if (row.item_name === "MB-W") {
                    row.qty_in_kgs_mt = result_mbw; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if (row.item_name === "MB-C-L") {
                    row.qty_in_kgs_mt = result_mbcl; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if (row.item_name === "MB-C-D") {
                    row.qty_in_kgs_mt = result_mbcd; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if (row.item_name === "UV - PP") {
                    row.qty_in_kgs_mt = result_uvpp; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if (row.item_name === "TPT Filler - PP") {
                    row.qty_in_kgs_mt = result_tpt_filler; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if (row.item_name === "Recycled PP Mix") {
                    row.qty_in_kgs_mt = result_ppmix; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if (row.item_name === "Recycled PP White") {
                    row.qty_in_kgs_mt = result_ppwhite; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if (row.item_name === "Antistatic MB") {
                    row.qty_in_kgs_mt = result_anti; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
            });
            (frm.doc.lamination_items || []).forEach(row => {
                if (row.item_name === "LDPE Lamination Grade") {
                    row.qty_in_kgs_mt = result_ldpe_lamination; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if (row.item_name === "PP Lamination Grade") {
                    row.qty_in_kgs_mt = result_pp_lamination; 
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
            });
            if(frm.doc.costing_sheet_type=="Small Bag"){
                result_ink=printing_ink_qty*1000;
                result_thinner=thinner_qty*1000;
                result_denier=mfpp_yarn_qty*1000;
                result_ldpe=ldpe_qty*1000;
                result_lldpe=lldpe_qty*1000;
                result_hdpe=hdpe_qty*1000;
                result_bio=bio_qty*1000;
                result_liner_mbw=liner_mbw_qty*1000;
                result_antistatic=liner_antistatic_qty*1000;
                result_filler_master=liner_filler_qty*1000;
                result_antiblock=antiblock_qty*1000;
                result_re_pe_mix=re_pemix_qty*1000;
                result_re_pe_clear=re_ppclear_qty*1000;
                result_liner_tpt_filler=liner_tpt_qty*1000;
                result_uvpe=liner_uvpe_qty*1000;
            }
            else{
                result_ink=0;
                result_thinner=0;
                result_denier=0;
                result_ldpe=0;
                result_lldpe=0;
                result_hdpe=0;
                result_bio=0;
                result_liner_mbw=0;
                result_antistatic=0;
                result_filler_master=0;
                result_antiblock=0;
                result_re_pe_mix=0;
                result_re_pe_clear=0;
                result_liner_tpt_filler=0;
                result_uvpe=0;
            }
            (frm.doc.liner_items || []).forEach(row => {
                if(row.item_name=="LDPE"){
                    row.qty_in_kgs_mt=result_ldpe;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="LLDPE"){
                    row.qty_in_kgs_mt=result_lldpe;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="HDPE"){
                    row.qty_in_kgs_mt=result_hdpe;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="Biodegradable"){
                    row.qty_in_kgs_mt=result_bio;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="MB-W"){
                    row.qty_in_kgs_mt=result_liner_mbw;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="Antistatic MB"){
                    row.qty_in_kgs_mt=result_antistatic;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="Filler Masterbatch PE"){
                    row.qty_in_kgs_mt=result_filler_master;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="Antiblock"){
                    row.qty_in_kgs_mt=result_antiblock;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="Recycled PE Mix"){
                    row.qty_in_kgs_mt=result_re_pe_mix;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="Recycled PE Clear"){
                    row.qty_in_kgs_mt=result_re_pe_clear;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="TPT Filler - PE"){
                    row.qty_in_kgs_mt=result_liner_tpt_filler;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="UV - PE"){
                    row.qty_in_kgs_mt=result_uvpe;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
            });
            (frm.doc.thread_ink_items || []).forEach(row => {
                if(row.item_name=="Printing Ink"){
                    row.qty_in_kgs_mt=result_ink;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name=="Thinner"){
                    row.qty_in_kgs_mt=result_thinner;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }
                if(row.item_name!="Thinner" && row.item_name!="Printing Ink" ){
                    row.qty_in_kgs_mt=result_denier;
                    row.cost__mt=flt(row.qty_in_kgs_mt)*flt(row.rate)/1000;
                }

            });
            frm.refresh_field("fabric_items");
            frm.refresh_field("lamination_items");
            frm.refresh_field("thread_ink_items");
            frm.refresh_field("liner_items");
        });
}