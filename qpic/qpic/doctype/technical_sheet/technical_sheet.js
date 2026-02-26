// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Technical Sheet', {
	refresh : function(frm){
		// frm.add_custom_button(("Costing Sheet"), ()=> {
		// 	var f_name = frm.doc.name
		// 	var print_format = "Costing Sheet";
		// 	window.open(frappe.urllib.get_full_url("/api/method/frappe.utils.print_format.download_pdf?"
		// 		+ "doctype=" + encodeURIComponent("Technical Sheet")
		// 		+ "&name=" + encodeURIComponent(f_name)
		// 		+ "&trigger_print=1"
		// 		+ "&format=" + print_format
		// 		+ "&no_letterhead=0"
				
		// 	));
		// }, __("Print"))
        // frm.add_custom_button("Create Costing Sheet", () => {
        //     frappe.call({
        //         method: "qpic.qpic.doctype.technical_sheet.technical_sheet.make_costing_sheet",
        //         args: { source_name: frm.doc.name },
        //         callback: function(r) {
        //             if (r.message) {
        //                 frappe.set_route("Form", "Costing Sheet", r.message);
        //             }
        //         }
        //     });
        // });

		frm.trigger('toggle_display_by_item_group')

	},
	actual_loom(frm){
		frm.trigger('calculate_actual_ppm');
	},
	currency(frm) {
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
	setup(frm){
		$.each(frm.doc.technical_costing_item,function(i,d){
			frm.set_query('refer_existing_technical_sheet', () => {
				return {
					filters: {
						sub_group: d.sub_group,
					}
				}
			})
		})
		// Filtering Top Stitching
		frm.set_query('top', () => {
			return {
				filters: {
					place_of_stitching: "Top Stitching",
				}
			}
		})
		// Filtering Bottom Stitching
		frm.set_query('bottom', () => {
			return {
				filters: {
					place_of_stitching: "Bottom Stitching",
				}
			}
		})
		// Filtering Loom (Workstation)
		frm.set_query('fabric_loom', () => {
			return {
				filters: {
					name: ["in", ["LSL-10", "LSL-620", "LSL-8", "Small Loom"]],
				}
			}
		});
	},
	toggle_display_by_item_group(frm) {
		let first_row = frm.doc.technical_costing_item?.[0];
		let item_group = first_row.item_group;
		let sub_group = first_row.sub_group;
		// Hide fields if the Item Group is Small Bag
		if (item_group == "Small Bag") {
			frm.toggle_display("fabric_gsm_details", false)
			frm.toggle_display("fabric_width_details", false)
			frm.toggle_display("fabric_printing_details", false)
			frm.toggle_display("fabric_gsm_wo_rf", false)
			frm.toggle_display("fabric_column", false)
			frm.toggle_display("mt___container", false)
		}
		// Hide fields if the Item Group is Fabric
		if (item_group == "Fabric") {
			frm.toggle_display("bag_fabric_width_details", false)
			frm.toggle_display("bag_fabric_length_details", false)
			frm.toggle_display("bag_liner_width_details", false)
			frm.toggle_display("bag_liner_length_details", false)
			frm.toggle_display("pieces__container", false)
			frm.toggle_display("section_break_1", false) // Bag Section
			frm.toggle_display("section_break_35", false) // Liner Section
			frm.toggle_display("section_break_47", false) // Stitching Section
		}
	},
	// printing_material_combination(frm){
	// 	if (frm.doc.printing_material_combination == 1) {
	// 		let exchange_rate = flt(frm.doc.exchange_rate) || 1;
	// 		frm.clear_table("printingmaterial_combination");
	// 		frm.clear_table("printing_others")
	// 		let materials = [
	// 			{
	// 				item_code: frm.doc.printing_ink,
	// 				qty: frm.doc.printing_ink_qty,
	// 				uom: frm.doc.printing_ink_uom,
	// 				base_rate:frm.doc.printing_ink_rate_qar,
	// 				rate: frm.doc.printing_ink_rate_qar/exchange_rate,
	// 				amount: frm.doc.cost_qrpcs
	// 			},
	// 			{
	// 				item_code: frm.doc.thinner,
	// 				qty: frm.doc.thinner_qty,
	// 				uom: frm.doc.thinner_uom,
	// 				// rate: frm.doc.thinner_rate_qr,
	// 				base_rate:frm.doc.printing_ink_rate_qar,
	// 				rate: frm.doc.printing_ink_rate_qar/exchange_rate,
	// 				amount: frm.doc.thinner_ink_cost_qrpcs
	// 			},
	// 			{
	// 				item_code: frm.doc.mfpp_yarn_1200_denier,
	// 				qty: frm.doc.mfpp_yarn_1200_denier_qty,
	// 				uom: frm.doc.mfpp_yarn_1200_denier_uom,
	// 				// rate: frm.doc.mfpp_yarn_1200_denier_rate_qr,
	// 				base_rate:frm.doc.printing_ink_rate_qar,
	// 				rate: frm.doc.printing_ink_rate_qar/exchange_rate,
	// 				amount: frm.doc.mfpp_yarn_1200_denier_cost_qrpcs
	// 			}
	// 		];

	// 		materials.forEach(row => {
	// 			if (row.item_code) {
	// 				frappe.db.get_value("Item", row.item_code, ["item_name","description"])
	// 					.then(r => {

	// 						frm.add_child("printingmaterial_combination", {
	// 							item_code: row.item_code,
	// 							item_name: r.message.item_name,
	// 							description: r.message.description,
	// 							qty: row.qty,
	// 							uom: row.uom,
	// 							rate: row.rate,
	// 							amount: row.amount
	// 						});

	// 						frm.refresh_field("printingmaterial_combination");
	// 					});
	// 			}
	// 		});
	// 		let other_materials = [
	// 			{
	// 				item_code: frm.doc.conversion_machine_operator,
	// 				qty: frm.doc.conversion_machine_operator_qty,
	// 				uom: frm.doc.conversion_machine_operator_uom,
	// 				// rate: frm.doc.conversion_machine_operator_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.conversion_machine_operator_cost_qrpcs
	// 			},
	// 			{
	// 				item_code: frm.doc.bundling_helper,
	// 				qty: frm.doc.bundling_helper_qty,
	// 				uom: frm.doc.bundling_helper_uom,
	// 				// rate: frm.doc.bundling_helper_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.bundling_helper_cost_qrpcs
	// 			},
	// 			{
	// 				item_code: frm.doc.tailor,
	// 				qty: frm.doc.tailor_qty,
	// 				uom: frm.doc.tailor_uom,
	// 				// rate: frm.doc.tailor_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.tailor_cost_qrpcs
	// 			},
	// 			{
	// 				item_code: frm.doc.printing_machine_operator,
	// 				qty: frm.doc.printing_machine_operator_qty,
	// 				uom: frm.doc.printing_machine_operator_uom,
	// 				// rate: frm.doc.printing_machine_operator_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.printing_machine_operator_cost_qrpcs
	// 			},
	// 			{
	// 				item_code: frm.doc.bailing_machine_operator,
	// 				qty: frm.doc.bailing_machine_operator_qty,
	// 				uom: frm.doc.bailing_machine_operator_uom,
	// 				// rate: frm.doc.bailing_machine_operator_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.bailing_machine_operator_cost_qarpcs
	// 			}
	// 			,
	// 			{
	// 				item_code: frm.doc.helper_liner_insertion,
	// 				qty: frm.doc.helper__liner_insertion_qty,
	// 				uom: frm.doc.helper__liner_insertion_uom,
	// 				// rate: frm.doc.helper__liner_insertion_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.helper__liner_insertion_cost_qrpcs
	// 			},
	// 			{
	// 				item_code: frm.doc.helper_tie_cutting,
	// 				qty: frm.doc.helper_tie_cutting_qty,
	// 				uom: frm.doc.helper_tie_cutting_uom,
	// 				// rate: frm.doc.helper_tie_cutting_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.helper_tie_cutting_cost_qarpcs
	// 			},
	// 			{
	// 				item_code: frm.doc.supervisor_small_bag_conversion,
	// 				qty: frm.doc.supervisor_small_bag_conversion_qty,
	// 				uom: frm.doc.supervisor_small_bag_conversion_uom,
	// 				// rate: frm.doc.supervisor_small_bag_conversion_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.supervisor_small_bag_conversion_cost_qrpcs
	// 			}
	// 			,
	// 			{
	// 				item_code: frm.doc.power_cost,
	// 				qty: frm.doc.power_cost_qty,
	// 				uom: frm.doc.power_cost_uom,
	// 				// rate: frm.doc.power_cost_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.power_cost_cost_qarpcs
	// 			},
	// 			{
	// 				item_code: frm.doc.overhead_sb_conversion,
	// 				qty: frm.doc.overhead_sb_conversion_qty,
	// 				uom: frm.doc.overhead_sb_conversion_uom,
	// 				// rate: frm.doc.overhead_sb_conversion_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.overhead_sb_conversion_cost_qrpcs
	// 			}
	// 			,
	// 			{
	// 				item_code: frm.doc.depreciation_sb_conversion,
	// 				qty: frm.doc.depreciation_sb_conversion_qty,
	// 				uom: frm.doc.depreciation_sb_conversion_uom,
	// 				// rate: frm.doc.depreciation_sb_conversion_rate_qr,
	// 				base_rate:frm.doc.conversion_machine_operator_rate_qr,
	// 				rate: frm.doc.conversion_machine_operator_rate_qr/exchange_rate,
	// 				amount: frm.doc.depreciation_sb_conversion_cost_qrpcs
	// 			}
	// 		];

	// 		other_materials.forEach(row => {
	// 			if (row.item_code) {
	// 				frappe.db.get_value("Item", row.item_code,["item_name", "description"])
	// 					.then(r => {

	// 						frm.add_child("printing_others", {
	// 							item_code: row.item_code,
	// 							item_name: r.message.item_name,
	// 							description: r.message.description,
	// 							qty: row.qty,
	// 							uom: row.uom,
	// 							rate: row.rate,
	// 							base_rate: row.base_rate,
	// 							amount: row.amount
	// 						});

	// 						frm.refresh_field("printing_others");
	// 					});
	// 			}
	// 		});
	// 		frm.refresh_field("printingmaterial_combination");
	// 		frm.refresh_field("printing_others");
	// 	}
	// 	sync_printing_items_to_tape(frm);
	// },
	printing_material_combination(frm) {
	if (frm.doc.printing_material_combination == 1) {

		let exchange_rate = flt(frm.doc.exchange_rate) || 1;

		frm.clear_table("printingmaterial_combination");
		frm.clear_table("printing_others");

		// ---------------- MAIN MATERIALS ----------------
		let materials = [
			{
				item_code: frm.doc.printing_ink,
				qty: frm.doc.printing_ink_qty,
				uom: frm.doc.printing_ink_uom,
				base_rate: frm.doc.printing_ink_rate_qar
			},
			{
				item_code: frm.doc.thinner,
				qty: frm.doc.thinner_qty,
				uom: frm.doc.thinner_uom,
				base_rate: frm.doc.thinner_rate_qr
			},
			{
				item_code: frm.doc.mfpp_yarn_1200_denier,
				qty: frm.doc.mfpp_yarn_1200_denier_qty,
				uom: frm.doc.mfpp_yarn_1200_denier_uom,
				base_rate: frm.doc.mfpp_yarn_1200_denier_rate_qr
			}
		];

		materials.forEach(d => {
			if (d.item_code) {

				let qty = flt(d.qty);
				let base_rate = flt(d.base_rate);

				let base_amount = qty * base_rate;                // QAR
				let rate = base_rate / exchange_rate;             // USD
				let amount = base_amount / exchange_rate;         // USD

				frappe.db.get_value("Item", d.item_code, ["item_name", "description"])
					.then(r => {

						frm.add_child("printingmaterial_combination", {
							item_code: d.item_code,
							item_name: r.message.item_name,
							description: r.message.description,
							qty: qty,
							uom: d.uom,
							base_rate: base_rate,
							rate: rate,
							base_amount: base_amount,
							amount: amount
						});

						frm.refresh_field("printingmaterial_combination");
					});
			}
		});


		// ---------------- OTHER MATERIALS ----------------
		let other_materials = [
			{
				item_code: frm.doc.conversion_machine_operator,
				qty: frm.doc.conversion_machine_operator_qty,
				uom: frm.doc.conversion_machine_operator_uom,
				base_rate: frm.doc.conversion_machine_operator_rate_qr
			},
			{
				item_code: frm.doc.bundling_helper,
				qty: frm.doc.bundling_helper_qty,
				uom: frm.doc.bundling_helper_uom,
				base_rate: frm.doc.bundling_helper_rate_qr
			},
			{
				item_code: frm.doc.tailor,
				qty: frm.doc.tailor_qty,
				uom: frm.doc.tailor_uom,
				base_rate: frm.doc.tailor_rate_qr
			},
			{
				item_code: frm.doc.printing_machine_operator,
				qty: frm.doc.printing_machine_operator_qty,
				uom: frm.doc.printing_machine_operator_uom,
				base_rate: frm.doc.printing_machine_operator_rate_qr
			},
				{
				item_code: frm.doc.bailing_machine_operator,
				qty: frm.doc.bailing_machine_operator_qty,
				uom: frm.doc.bailing_machine_operator_uom,
				base_rate: frm.doc.bailing_machine_operator_rate_qr,
			
				}
				,
				{
					item_code: frm.doc.helper_liner_insertion,
					qty: frm.doc.helper__liner_insertion_qty,
					uom: frm.doc.helper__liner_insertion_uom,
					base_rate: frm.doc.helper__liner_insertion_rate_qr,
					
				},
				{
					item_code: frm.doc.helper_tie_cutting,
					qty: frm.doc.helper_tie_cutting_qty,
					uom: frm.doc.helper_tie_cutting_uom,
					base_rate: frm.doc.helper_tie_cutting_rate_qr,
					
				},
				{
					item_code: frm.doc.supervisor_small_bag_conversion,
					qty: frm.doc.supervisor_small_bag_conversion_qty,
					uom: frm.doc.supervisor_small_bag_conversion_uom,
					base_rate: frm.doc.supervisor_small_bag_conversion_rate_qr,
					
				}
				,
				{
					item_code: frm.doc.power_cost,
					qty: frm.doc.power_cost_qty,
					uom: frm.doc.power_cost_uom,
					base_rate: frm.doc.power_cost_rate_qr,
				},
				{
					item_code: frm.doc.overhead_sb_conversion,
					qty: frm.doc.overhead_sb_conversion_qty,
					uom: frm.doc.overhead_sb_conversion_uom,
					base_rate: frm.doc.overhead_sb_conversion_rate_qr,
					
				}
				,
				{
					item_code: frm.doc.depreciation_sb_conversion,
					qty: frm.doc.depreciation_sb_conversion_qty,
					uom: frm.doc.depreciation_sb_conversion_uom,
					base_rate: frm.doc.depreciation_sb_conversion_rate_qr,
					
				}
			// add remaining same pattern...
		];

		other_materials.forEach(d => {
			if (d.item_code) {

				let qty = flt(d.qty);
				let base_rate = flt(d.base_rate);

				let base_amount = qty * base_rate;        // QAR
				let rate = base_rate / exchange_rate;     // USD
				let amount = base_amount / exchange_rate; // USD

				frappe.db.get_value("Item", d.item_code, ["item_name", "description"])
					.then(r => {

						frm.add_child("printing_others", {
							item_code: d.item_code,
							item_name: r.message.item_name,
							description: r.message.description,
							qty: qty,
							uom: d.uom,
							base_rate: base_rate,
							rate: rate,
							base_amount: base_amount,
							amount: amount
						});

						frm.refresh_field("printing_others");
					});
			}
		});

		frm.refresh_field("printingmaterial_combination");
		frm.refresh_field("printing_others");
	}

	sync_printing_items_to_tape(frm);
},
	validate(frm) {
		update_lamination_quote_value(frm);
		calculate_warp_sqm(frm);
		// sync_printing_items_to_tape(frm);
		set_warp_pp_raffia_qty(frm);
		set_master_batch_qty(frm);
		set_mb_w_qty(frm);
		set_mb_c_l_qty(frm);
		set_mb_c_d_qty(frm);
		set_mb_uv_pp_qty(frm);
		set_mb_tpt_filler_qty(frm);
		set_recycled_pp_mix_qty(frm);
		set_recycled_pp_white_qty(frm);
		set_antistatic_qty(frm);
		set_ldap_qty(frm);
		set_printing_qty(frm);
		set_liner_qty(frm);
		if(frm.doc.strip1_material_combination == 1){
			if(frm.doc.stripmaterial_combination){
				var dosage = 0
				$.each(frm.doc.stripmaterial_combination, function (i, d) {
					dosage += d.dosage
				})
				if(dosage ==100){
					frappe.validated = true;
				}
				else{
					frappe.throw("Strip material combination dosage should be 100")
				}
			}
		}
		if(frm.doc.lamination_material_combination == 1){
			if(frm.doc.laminationmaterial_combination){
				var dosage = 0
				$.each(frm.doc.laminationmaterial_combination, function (i, d) {
					dosage += d.dosage
				})
				if(dosage ==100){
					frappe.validated = true;
				}
				else{
					frappe.throw("Lamination material combination dosage should be 100")
				}
			}
		}
		if(frm.doc.liner_material_combination == 1){
			if(frm.doc.linermaterial_combination){
				var dosage = 0
				$.each(frm.doc.linermaterial_combination, function (i, d) {
					dosage += d.dosage
				})
				if(dosage ==100){
					frappe.validated = true;
				}
				else{
					frappe.throw("Liner material combination dosage should be 100")
				}
			}
		}
	},

	// Fields
	external_width(frm) {
		frm.set_value("internal_width", frm.doc.external_width);
		frm.trigger('liner_section_calculation');
		frm.trigger('fabric_section_calculation');
	},
	external_length(frm) {
		frm.set_value("internal_length", frm.doc.external_length);
		frm.trigger('liner_section_calculation');
		frm.trigger('calculate_cut_length');	
	},
	fabric_length_top(frm) {
		frm.trigger('calculate_cut_length');
	},
	fabric_length_bottom(frm) {
		frm.trigger('calculate_cut_length');
	},
	bag_fabric_length_details(frm) {
		frm.trigger('calculate_cut_length');
	},
	type(frm) {
		frm.trigger('liner_section_calculation');
	},
	thickness(frm) {
		frm.trigger('liner_section_calculation');
		frm.set_value("liner_thickness", frm.doc.thickness)
		generate_liner_item(frm);
	},
	denier_vs_mesh_against(frm) {
		frm.trigger('running_denier_section_calculation')
		frm.trigger('calculate_denier_calculation');
	},
	tw_vs_mesh_against(frm) {
		frm.trigger('running_denier_section_calculation')
		frm.trigger('calculate_tape_width')
	},
	denier_vs_mesh_warp(frm) {
		frm.trigger('running_denier_section_calculation')
	},
	tw_vs_mesh_warp(frm) {
		frm.trigger('running_denier_section_calculation')
		frm.trigger('calculate_tape_width')
	},
	fabric_gsm(frm) {
		frm.trigger('running_denier_section_calculation');
		frm.trigger('fabric_section_calculation');
		frm.trigger('calculate_wt_mtr');
		frm.trigger('calculate_denier_calculation');
		frm.trigger('calculate_lamination_wt_ratio')
	},
	tape_warp_mesh(frm) {
		frm.trigger('running_denier_section_calculation');
		frm.trigger('calculate_tape_width');
		frm.trigger('calculate_denier_calculation');
		generate_fabric_item(frm);
	},
	tape_weft_mesh(frm) {
		frm.trigger('running_denier_section_calculation');
		frm.trigger('calculate_tape_width');
		frm.trigger('calculate_denier_calculation');
		frm.trigger('calculate_loom_mhr');
		generate_fabric_item(frm);
	},
	fabric_width_details(frm) {
		frm.trigger('fabric_section_calculation')
	},
	bag_fabric_width_details(frm) {
		frm.trigger('fabric_section_calculation')
	},
	coating_side(frm) {
		frm.trigger('fabric_section_calculation');
		frm.trigger('calculate_lamination_wtsqm');
		generate_fabric_item(frm);
	},
	fabric_gsm_wo_rf(frm) {
		// Weft Addn GSM Calculation
		var item_group = frm.doc.technical_costing_item?.[0].item_group;
		if (item_group == "Fabric") {
			const weft_addn_gsm = frm.doc.fabric_gsm - frm.doc.fabric_gsm_wo_rf
			frm.set_value("weft_addn_gsm", weft_addn_gsm);
		}
		else {
			frm.set_value("weft_addn_gsm", 0);
		}
	},
	coating_gsm(frm){
		frm.trigger('lam_wt')
		frm.trigger('unit_weight_biforcation')
		frm.trigger('fabric_section_calculation')
		frm.trigger("calculate_lamination_wtsqm")
		frm.trigger('fabric_gsm_calculation');
	},
	fabric_speed_percentage(frm) {
		if (flt(frm.doc.fabric_speed_percentage) > 100 ) {
			frappe.msgprint("Fabric Speed Percentage cannot be more than 100%");
			frm.set_value("fabric_speed_percentage", 0);
		}
		else {
			frm.trigger('calculate_ppm');
			frm.trigger('calculate_actual_ppm');
		}
	},
	fabric_loom(frm) {
		frm.trigger("calculate_ppm");
	},
	fabric_width(frm) {
		frm.trigger('calculate_wt_mtr')
        frm.trigger('fabric_gsm_calculation');
		generate_fabric_item(frm);
	},
	fabric_type(frm) {
		frm.trigger('calculate_wt_mtr')
		generate_fabric_item(frm);
	},
	fabric_total_gsm(frm) {
		frm.trigger('calculate_wt_mtr')
		generate_fabric_item(frm);
	},
	wtmtr(frm) {
		let mtrmt = 0;
		if (frm.doc.wtmtr) {
			mtrmt = (1 / frm.doc.wtmtr) * 1000000;
		}
		frm.set_value('lamination_mtrmt', mtrmt);

		frm.trigger('loom_wthr');
	},
	strip1_width(frm){
		frm.trigger('strip_output_kghour')
		if (frm.doc.strip1_width) {
			frm.set_value("strip1_tape_width", frm.doc.strip1_width);
		}
	},
	strip2_width(frm){
		if (frm.doc.strip2_width) {
			frm.set_value("strip2_tape_width", frm.doc.strip2_width);
		}
	},
	strip3_width(frm){
		if (frm.doc.strip3_width) {
			frm.set_value("strip3_tape_width", frm.doc.strip3_width);
		}
	},
	strip4_width(frm){
		if (frm.doc.strip4_width) {
			frm.set_value("strip4_tape_width", frm.doc.strip4_width);
		}
	},
	warp_tape_width(frm) {
		frm.set_value('warp_tape_width_calc', calculation_for_widht_calc_field(frm.doc.warp_tape_width))
		generate_tape_item(frm, {
			type: "Warp",
			width_field: "warp_tape_width",
			denier_field: "warp_denier",
			color_field: "tape_warp_color",
			material_table: "warpmaterial_combination",
			wt_ratio_field: "wt_ratio_warp",
			wastage_field: "warp_tape_wastage"
		});
	},
	weft_tape_width(frm) {
		frm.set_value('weft_tape_width_calc', calculation_for_widht_calc_field(frm.doc.weft_tape_width))
		generate_tape_item(frm, {
			type: "Weft",
			width_field: "weft_tape_width",
			denier_field: "weft_denier",
			color_field: "tape_weft_color",
			material_table: "weftmaterial_combination",
			wt_ratio_field: "wt_ratio_weft",
			wastage_field: "weft_tape_wastage"
		});
	},
	weft_addn_tape_width(frm) {
		frm.set_value('weft_addn_tape_width_calc', calculation_for_widht_calc_field(frm.doc.weft_addn_tape_width))
		generate_tape_item(frm, {
			type: "Weft Addn",
			width_field: "weft_addn_tape_width",
			denier_field: "weft_addn_denier",
			color_field: "tape_weft_addn_color",
			material_table: "warpaddn_material_combination"
		});
	},
	reenf_tape_width(frm) {
		frm.set_value('reen_tape_width_calc', calculation_for_widht_calc_field(frm.doc.reen_tape_width))
		generate_tape_item(frm, {
			type: "Reenf",
			width_field: "reenf_tape_width",
			denier_field: "reenf_denier",
			color_field: "tape_reenf_color",
			material_table: "reenfmaterial_combination"
		});
	},

	warp_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.warp_denier);
		frm.set_value('warp_denier_calc', result.denier_calc);
		frm.set_value('warp_mmt', result.mmt);
		generate_tape_item(frm, {
			type: "Warp",
			width_field: "warp_tape_width",
			denier_field: "warp_denier",
			color_field: "tape_warp_color",
			material_table: "warpmaterial_combination",
			wt_ratio_field: "wt_ratio_warp",
			wastage_field: "warp_tape_wastage"
		});
	},
	weft_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.weft_denier);
		frm.set_value('weft_denier_calc', result.denier_calc);
		frm.set_value('weft_mmt', result.mmt);
		generate_tape_item(frm, {
			type: "Weft",
			width_field: "weft_tape_width",
			denier_field: "weft_denier",
			color_field: "tape_weft_color",
			material_table: "weftmaterial_combination",
			wt_ratio_field: "wt_ratio_weft",
			wastage_field: "weft_tape_wastage"
		});
	},
	weft_addn_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.weft_addn_denier);
		frm.set_value('weft_addn_denier_calc', result.denier_calc);
		frm.set_value('weft_addn_mmt', result.mmt);
		generate_tape_item(frm, {
			type: "Weft Addn",
			width_field: "weft_addn_tape_width",
			denier_field: "weft_addn_denier",
			color_field: "tape_weft_addn_color",
			material_table: "warpaddn_material_combination"
		});
	},
	reenf_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.reenf_denier);
		frm.set_value('reenf_denier_calc', result.denier_calc);
		frm.set_value('reenf_mmt', result.mmt);
		generate_tape_item(frm, {
			type: "Reenf",
			width_field: "reenf_tape_width",
			denier_field: "reenf_denier",
			color_field: "tape_reenf_color",
			material_table: "reenfmaterial_combination"
		});
	},
	strip1_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.strip1_denier);
		frm.set_value('strip1_denier_calc', result.denier_calc);
		frm.set_value('strip1_mmt', result.mmt);
		generate_tape_item(frm, {
			type: "Strip 1",
			width_field: "strip1_tape_width",
			denier_field: "strip1_denier",
			color_field: "strip1_color",
			material_table: "stripmaterial_combination"
		});
	},
	strip2_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.strip2_denier);
		frm.set_value('strip2_denier_calc', result.denier_calc);
		frm.set_value('strip2_mmt', result.mmt);
		generate_tape_item(frm, {
			type: "Strip 2",
			width_field: "strip2_tape_width",
			denier_field: "strip2_denier",
			color_field: "strip2_color",
			material_table: "strip2material_combination"
		});
	},
	strip3_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.strip3_denier);
		frm.set_value('strip3_denier_calc', result.denier_calc);
		frm.set_value('strip3_mmt', result.mmt);
		generate_tape_item(frm, {
			type: "Strip 3",
			width_field: "strip3_tape_width",
			denier_field: "strip3_denier",
			color_field: "strip3_color",
			material_table: "strip3material_combination"
		});
	},
	strip4_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.strip4_denier);
		frm.set_value('strip4_denier_calc', result.denier_calc);
		frm.set_value('strip4_mmt', result.mmt);
		generate_tape_item(frm, {
			type: "Strip 4",
			width_field: "strip4_tape_width",
			denier_field: "strip4_denier",
			color_field: "strip4_color",
			material_table: "strip4material_combination"
		});
	},

	warp_tape_width_calc(frm) {
		calculate_hrsmt(frm, frm.doc.warp_tape_width_calc, frm.doc.warp_denier_calc, 'warp_hrsmt');
	},
	weft_tape_width_calc(frm) {
		calculate_hrsmt(frm, frm.doc.weft_tape_width_calc, frm.doc.weft_denier_calc, 'weft_hrsmt');
	},
	weft_addn_tape_width_calc(frm) {
		calculate_hrsmt(frm, frm.doc.weft_addn_tape_width_calc, frm.doc.weft_addn_denier_calc, 'weft_addn_hrsmt');
	},
	reenf_tape_width_calc(frm) {
		calculate_hrsmt(frm, frm.doc.reenf_tape_width_calc, frm.doc.reenf_denier_calc, 'reenf_hrsmt');
	},
	strip1_tape_width_calc(frm) {
		calculate_hrsmt(frm, frm.doc.strip1_tape_width_calc, frm.doc.strip1_denier_calc, 'strip1_hrsmt');
	},
	strip2_tape_width_calc(frm) {
		calculate_hrsmt(frm, frm.doc.strip2_tape_width_calc, frm.doc.strip2_denier_calc, 'strip2_hrsmt');
	},
	strip3_tape_width_calc(frm) {
		calculate_hrsmt(frm, frm.doc.strip3_tape_width_calc, frm.doc.strip3_denier_calc, 'strip3_hrsmt');
	},
	strip4_tape_width_calc(frm) {
		calculate_hrsmt(frm, frm.doc.strip4_tape_width_calc, frm.doc.strip4_denier_calc, 'strip4_hrsmt');
	},

	warp_denier_calc(frm) {
		calculate_hrsmt(frm, frm.doc.warp_tape_width_calc, frm.doc.warp_denier_calc, 'warp_hrsmt');
	},
	weft_denier_calc(frm) {
		calculate_hrsmt(frm, frm.doc.weft_tape_width_calc, frm.doc.weft_denier_calc, 'weft_hrsmt');
	},
	weft_addn_denier_calc(frm) {
		calculate_hrsmt(frm, frm.doc.weft_addn_tape_width_calc, frm.doc.weft_addn_denier_calc, 'weft_addn_hrsmt');
	},
	reenf_denier_calc(frm) {
		calculate_hrsmt(frm, frm.doc.reenf_tape_width_calc, frm.doc.reenf_denier_calc, 'reenf_hrsmt');
	},
	strip1_denier_calc(frm) {
		calculate_hrsmt(frm, frm.doc.strip1_tape_width_calc, frm.doc.strip1_denier_calc, 'strip1_hrsmt');
	},
	strip2_denier_calc(frm) {
		calculate_hrsmt(frm, frm.doc.strip2_tape_width_calc, frm.doc.strip2_denier_calc, 'strip2_hrsmt');
	},
	strip3_denier_calc(frm) {
		calculate_hrsmt(frm, frm.doc.strip3_tape_width_calc, frm.doc.strip3_denier_calc, 'strip3_hrsmt');
	},
	strip4_denier_calc(frm) {
		calculate_hrsmt(frm, frm.doc.strip4_tape_width_calc, frm.doc.strip4_denier_calc, 'strip4_hrsmt');
	},
	// Tape tab -> Warp Section
	warp_material_combination(frm) {
		get_raw_materials_and_others(frm, 'warp_material_combination', 'warpmaterial_combination', 'warp_others', 'warp_hrsmt', 'Tape');
	},
	// Tape tab -> Weft Section
	weft_material_combination(frm) {
		get_raw_materials_and_others(frm, 'weft_material_combination', 'weftmaterial_combination', 'weft_others', 'weft_hrsmt', 'Tape');
	},
	tape_warp_color(frm){
		generate_tape_item(frm, {
			type: "Warp",
			width_field: "warp_tape_width",
			denier_field: "warp_denier",
			color_field: "tape_warp_color",
			material_table: "warpmaterial_combination",
			wt_ratio_field: "wt_ratio_warp",
			wastage_field: "warp_tape_wastage"
		});
	},
	tape_weft_color(frm){
		generate_tape_item(frm, {
			type: "Weft",
			width_field: "weft_tape_width",
			denier_field: "weft_denier",
			color_field: "tape_weft_color",
			material_table: "weftmaterial_combination",
			wt_ratio_field: "wt_ratio_weft",
			wastage_field: "weft_tape_wastage"
		});
	},
	tape_weft_addn_color(frm){
		generate_tape_item(frm, {
			type: "Weft Addn",
			width_field: "weft_addn_tape_width",
			denier_field: "weft_addn_denier",
			color_field: "tape_weft_addn_color",
			material_table: "warpaddn_material_combination"
		});
	},
	tape_reenf_color(frm){
		generate_tape_item(frm, {
			type: "Reenf",
			width_field: "reenf_tape_width",
			denier_field: "reenf_denier",
			color_field: "tape_reenf_color",
			material_table: "reenfmaterial_combination"
		});
	},
	strip1_color(frm){
		generate_tape_item(frm, {
			type: "Strip 1",
			width_field: "strip1_tape_width",
			denier_field: "strip1_denier",
			color_field: "strip1_color",
			material_table: "stripmaterial_combination"
		});
	},
	strip2_color(frm){
		generate_tape_item(frm, {
			type: "Strip 2",
			width_field: "strip2_tape_width",
			denier_field: "strip2_denier",
			color_field: "strip2_color",
			material_table: "strip2material_combination"
		});
	},
	strip3_color(frm){
		generate_tape_item(frm, {
			type: "Strip 3",
			width_field: "strip3_tape_width",
			denier_field: "strip3_denier",
			color_field: "strip3_color",
			material_table: "strip3material_combination"
		});
	},
	strip4_color(frm){
		generate_tape_item(frm, {
			type: "Strip 4",
			width_field: "strip4_tape_width",
			denier_field: "strip4_denier",
			color_field: "strip4_color",
			material_table: "strip4material_combination"
		});
	},	
	fabric_color(frm){
		generate_fabric_item(frm);
	},
	// Tape tab -> Weft Addn Section
	weft_addn_gsm(frm) {
		let weft_addn_tape_width = 0;
		let weft_addn_denier = 0;
		let tape_weft_addn_color = null;
		let tape_weft_addn_color_type = null;
		if (frm.doc.weft_addn_gsm > 0) {
			weft_addn_tape_width = frm.doc.weft_tape_width;
			weft_addn_denier = frm.doc.weft_denier;
			tape_weft_addn_color = frm.doc.tape_weft_color;
			tape_weft_addn_color_type = frm.doc.tape_weft_color_type;
		}
		frm.set_value('weft_addn_tape_width', weft_addn_tape_width);
		frm.set_value('weft_addn_denier', weft_addn_denier);
		frm.set_value('tape_weft_addn_color', tape_weft_addn_color);
		frm.set_value('tape_weft_addn_color_type', tape_weft_addn_color_type);
		generate_tape_item(frm, {
			type: "Weft Addn",
			width_field: "weft_addn_tape_width",
			denier_field: "weft_addn_denier",
			color_field: "tape_weft_addn_color",
			material_table: "warpaddn_material_combination"
		});
	},
	weft_addn_tape_width(frm) {
		let tape_weft_addn_mesh = 0;
		if (weft_addn_tape_width > 0) {
			tape_weft_addn_mesh = (frm.doc.weft_addn_gsm / (frm.doc.weft_addn_denier / 9000)) / (100 / 2.54);
		}
		frm.set_value('tape_weft_addn_mesh', tape_weft_addn_mesh)
		generate_tape_item(frm, {
			type: "Weft Addn",
			width_field: "weft_addn_tape_width",
			denier_field: "weft_addn_denier",
			color_field: "tape_weft_addn_color",
			material_table: "warpaddn_material_combination"
		});
	},
	// Tape tab -> Reenf Section
	reenf_strip_width(frm) {
		let reenf_tape_width = 0;
		let reenf_denier = 0;
		let tape_reenf_color = null;
		let tape_reenf_color_type = null;
		let tape_reenf_strength = 0;
		if (frm.doc.reenf_strip_width > 0) {
			reenf_tape_width = frm.doc.warp_tape_width;
			reenf_denier = frm.doc.warp_denier;
			tape_reenf_color = frm.doc.tape_warp_color;
			tape_reenf_color_type = frm.doc.tape_warp_color_type;
			tape_reenf_strength = frm.doc.tape_warp_strength;
		}
		frm.set_value('reenf_tape_width', reenf_tape_width);
		frm.set_value('reenf_denier', reenf_denier);
		frm.set_value('tape_reenf_color', tape_reenf_color);
		frm.set_value('tape_reenf_color_type', tape_reenf_color_type);
		frm.set_value('tape_reenf_strength', tape_reenf_strength);
	},
	// Tape tab -> Strip 1 Section
	strip1_width(frm) {
		let strip1_tape_width = 0;
		let strip1_denier = 0;
		let strip1_strength = 0;
		if (frm.doc.strip1_width > 0) {
			strip1_tape_width = frm.doc.warp_tape_width;
			strip1_denier = frm.doc.warp_denier;
			strip1_strength = frm.doc.tape_warp_strength;
		}
		frm.set_value('strip1_tape_width', strip1_tape_width);
		frm.set_value('strip1_denier', strip1_denier);
		frm.set_value('strip1_strength', strip1_strength);
		generate_tape_item(frm, {
			type: "Strip 1",
			width_field: "strip1_tape_width",
			denier_field: "strip1_denier",
			color_field: "strip1_color",
			material_table: "stripmaterial_combination"
		});
	},
	// Tape tab -> Strip 2 Section
	strip2_width(frm) {
		let strip2_tape_width = 0;
		let strip2_denier = 0;
		let strip2_strength = 0;
		if (frm.doc.strip2_width > 0) {
			strip2_tape_width = frm.doc.warp_tape_width;
			strip2_denier = frm.doc.warp_denier;
			strip2_strength = frm.doc.tape_warp_strength;
		}
		frm.set_value('strip2_tape_width', strip2_tape_width);
		frm.set_value('strip2_denier', strip2_denier);
		frm.set_value('strip2_strength', strip2_strength);
		generate_tape_item(frm, {
			type: "Strip 2",
			width_field: "strip2_tape_width",
			denier_field: "strip2_denier",
			color_field: "strip2_color",
			material_table: "strip2material_combination"
		});
	},
	// Tape tab -> Strip 3 Section
	strip3_width(frm) {
		let strip3_tape_width = 0;
		let strip3_denier = 0;
		let strip3_strength = 0;
		if (frm.doc.strip3_width > 0) {
			strip3_tape_width = frm.doc.warp_tape_width;
			strip3_denier = frm.doc.warp_denier;
			strip3_strength = frm.doc.tape_warp_strength;
		}
		frm.set_value('strip3_tape_width', strip3_tape_width);
		frm.set_value('strip3_denier', strip3_denier);
		frm.set_value('strip3_strength', strip3_strength);
		generate_tape_item(frm, {
			type: "Strip 3",
			width_field: "strip3_tape_width",
			denier_field: "strip3_denier",
			color_field: "strip3_color",
			material_table: "strip3material_combination"
		});
	},
	// Tape tab -> Strip 4 Section
	strip4_width(frm) {
		let strip4_tape_width = 0;
		let strip4_denier = 0;
		let strip4_strength = 0;
		if (frm.doc.strip4_width > 0) {
			strip4_tape_width = frm.doc.warp_tape_width;
			strip4_denier = frm.doc.warp_denier;
			strip4_strength = frm.doc.tape_warp_strength;
		}
		frm.set_value('strip4_tape_width', strip4_tape_width);
		frm.set_value('strip4_denier', strip4_denier);
		frm.set_value('strip4_strength', strip4_strength);
		generate_tape_item(frm, {
			type: "Strip 4",
			width_field: "strip4_tape_width",
			denier_field: "strip4_denier",
			color_field: "strip4_color",
			material_table: "strip4material_combination"
		});
	},
	// Liner tab
	liner_material_combination(frm) {
		get_raw_materials_and_others(frm, 'liner_material_combination', 'linermaterial_combination', 'liner_others', 'liner_hrsmt', 'Liner');
	},
	// Lamination tab
	lamination_wtsqm(frm) {
		frm.trigger('calculate_lamination_wt_ratio')
	},
	lamination_material_combination(frm) {
		get_raw_materials_and_others_lamination(frm, 'lamination_material_combination', 'laminationmaterial_combination', 'lamination_others', 'lamination_mtrmt', 'Lamination');
		sync_lamination_items_to_tape(frm);
	},
	// Loom tab
	loom_material_combination(frm) {
		get_raw_materials_and_others_loom(frm, 'loom_material_combination', 'loommaterial_combination', 'loom_others', 'loom_hrsmt', 'Loom');
		update_lamination_others_total(frm)
	},
	loom_width_factor(frm) {
		frm.trigger('calculate_loom_wthr');
	},
	loom_mhr(frm) {
		frm.trigger('calculate_loom_wthr');
	},
	loom_hrsmt(frm) {
		frm.trigger('calculate_loom_hrsmt');
	},
	loom_wthr(frm) {
		frm.trigger('calculate_loom_hrsmt');
	},
    bag_weight(frm) {
        frm.trigger('fabric_gsm_calculation');
    },
	thread(frm) {
        frm.trigger('fabric_gsm_calculation');
    },
    liner_weight_gms(frm) {
        frm.trigger('fabric_gsm_calculation');
    },
    cut_length(frm) {
        frm.trigger('fabric_gsm_calculation');
    },
	
	// Calculations
    async fabric_gsm_calculation(frm) {
        var item_group = frm.doc.technical_costing_item?.[0].item_group;
        let fabric_gsm = 0;
        let some_field_for_D235 = 0
        if (item_group == "Small Bag") {
            const CW_SB_D234 = await get_qty_for_thread(frm);
            const D235 = flt(some_field_for_D235) || 0;  // map this correctly

            let net =
                flt(frm.doc.bag_weight)
                - flt(frm.doc.liner_weight_gms)
                - CW_SB_D234
                - (D235 / 1.02);

            let factor =
                (flt(frm.doc.fabric_width) / 100) *
                2 *
                (flt(frm.doc.cut_length) / 100);

            fabric_gsm = (net / factor) - flt(frm.doc.coating_gsm);
        }
        else {
            fabric_gsm = flt(frm.doc.fabric_gsm_details) - flt(frm.doc.coating_gsm);
        }

        frm.set_value("fabric_gsm", fabric_gsm);
    },

	liner_section_calculation(frm) { 
		// Liner Section Calcualation
		if (frm.doc.type && frm.doc.type != "No") {
			let liner_width = frm.doc.internal_width + 3 + frm.doc.bag_liner_width_details
			frm.set_value("width", liner_width)
			frm.set_value("liner_width", liner_width)
			if (frm.doc.type == "Loose") {
				let liner_length = frm.doc.internal_length + 16 + frm.doc.bag_liner_length_details
				frm.set_value("length", liner_length);
			}
			if (frm.doc.type == "Stitched") {
				let liner_length = frm.doc.internal_length + 10 + frm.doc.bag_liner_length_details
				frm.set_value("length", liner_length);
			}
			// Liner Weight calculation
			let liner_weight = frm.doc.width * 2 * frm.doc.length * (frm.doc.thickness / 10000) * 0.92
			frm.set_value("liner_weight_gms", liner_weight || 0)
		}
		else{
			frm.set_value("width", 0)
			frm.set_value("liner_width", 0)
		}
		// Liner Hrs / MT
		// if (!frm.doc.liner_hrsmt) {
			frappe.db.get_value("Workstation", "Blown Film", "capacity", (r) => {
				if (r && r.capacity) {
					const capacity = frm.doc.liner_production_wastage * 1000 / r.capacity
					frm.set_value("liner_hrsmt", capacity);
				}
				else {
					frm.set_value("liner_hrsmt", 0);
				}
			});
		// }
	},
	// Liner Quantity Calculation
	liner_quantity_calculation(frm) {
		const qty = frm.doc.technical_costing_item?.[0].qty;
		const qty_in_mtr = qty * frm.doc.length / 100;
		frm.set_value("qty_in_mtr", qty_in_mtr);
	},
	// Running Deiner Section Calculation
	running_denier_section_calculation(frm) {
		// Warp vs Mesh Calculation
		if (frm.doc.denier_vs_mesh_against == "Dep") {
			const warp_value = frm.doc.fabric_gsm * 9000 / (100 / (2.54 / frm.doc.tape_warp_mesh) * 2) * 0.965;
			frm.set_value("warp", warp_value);
		}
		else if (frm.doc.denier_vs_mesh_against == "Ind"){
			const warp_value = frm.doc.fabric_gsm * 9000 / (100 / (2.54 / ((frm.doc.tape_warp_mesh + frm.doc.tape_weft_mesh) / 2)) * 2) * 0.965;
			frm.set_value("warp", warp_value);
		}
		else {
			const warp_value = frm.doc.denier_vs_mesh_warp;
			frm.set_value("warp", warp_value);
		}
		// Weft Calculation
		if (frm.doc.tw_vs_mesh_against == "Dep") {
			const weft_value = frm.doc.fabric_gsm * 9000 / (100 / (2.54 / frm.doc.tape_weft_mesh) * 2) * 0.965;
			frm.set_value("weft", weft_value);
		}
		else if (frm.doc.tw_vs_mesh_against == "Ind"){
			const weft_value = frm.doc.fabric_gsm * 9000 / (100 / (2.54 / ((frm.doc.tape_warp_mesh + frm.doc.tape_weft_mesh) / 2)) * 2) * 0.965;
			frm.set_value("weft", weft_value);
		}
		else {
			const weft_value = frm.doc.denier_vs_mesh_weft;
			frm.set_value("weft", weft_value);
		}
	},
	// Fabric Section Calulation
	fabric_section_calculation(frm) {
		// Width Calculation
		var item_group = frm.doc.technical_costing_item?.[0].item_group;
		if (item_group == "Small Bag") {
			const fabric_width = flt(frm.doc.bag_fabric_width_details) + 0.5 + flt(frm.doc.external_width);
			frm.set_value("fabric_width", fabric_width);
		}
		else {
			const fabric_width = flt(frm.doc.bag_fabric_width_details) + flt(frm.doc.fabric_width_details);
			frm.set_value("fabric_width", fabric_width);
		}
		// Total GSM Calculation
		if (frm.doc.coating_side == "One Side" || frm.doc.coating_side == "Two Side") {
			const fabric_total_gsm = flt(frm.doc.coating_gsm) + flt(frm.doc.fabric_gsm);
			frm.set_value("fabric_total_gsm", fabric_total_gsm);
		}
		else {
            frm.set_value("coating_gsm", 0)
			const fabric_total_gsm = frm.doc.fabric_gsm;
			frm.set_value("fabric_total_gsm", fabric_total_gsm);
		}
	},
	// Cut Length Calculation
	calculate_cut_length(frm) {
		var item_group = frm.doc.technical_costing_item?.[0].item_group;
		if (item_group == "Small Bag") {
			const cut_length = flt(frm.doc.external_length) + flt(frm.doc.fabric_length_top)+ flt(frm.doc.fabric_length_bottom) + flt(frm.doc.bag_fabric_length_details);
			frm.set_value("cut_length", cut_length);
		}
		else {
			frm.set_value("cut_length", 0);
		}
	},
	// PPM Calculation
	calculate_ppm(frm) {
		if (frm.doc.fabric_loom && flt(frm.doc.fabric_speed_percentage) > 0) {
			frappe.call({
				method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_ppm",
				args: {
					"fabric_loom": frm.doc.fabric_loom,
					"fabric_speed_percentage": frm.doc.fabric_speed_percentage
				},
				callback: function (r) {
					frm.set_value("fabric_ppm", Math.round(r.message));
				}
			});
		}
		else {
			frm.set_value("fabric_ppm", 0);
		}
	},
	// 
	calculate_actual_ppm(frm) {
		if (frm.doc.actual_loom && flt(frm.doc.fabric_speed_percentage) > 0) {
			frappe.call({
				method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_ppm",
				args: {
					"fabric_loom": frm.doc.actual_loom,
					"fabric_speed_percentage": frm.doc.fabric_speed_percentage
				},
				callback: function (r) {
					frm.set_value("actual_loom_ppm", Math.round(r.message));
				}
			});
		}
		else {
			frm.set_value("actual_loom_ppm", 0);
		}
	},
	// WT/MTR(g) Calculation
	calculate_wt_mtr(frm) {
		let multiplier = 0
		if (frm.doc.fabric_type) {
			if (frm.doc.fabric_type == "CRZZ") {
				multiplier = 2
			}
			else {
				multiplier = 1
			}
			const wtmtr = (flt(frm.doc.fabric_gsm) * flt(frm.doc.fabric_width) * multiplier) / 100
			const wtmtr_lam = (flt(frm.doc.fabric_width) * flt(frm.doc.fabric_total_gsm) * multiplier) / 100
			frm.set_value("wtmtr", wtmtr);
			frm.set_value("lamination_wt_per_pcs_gms", wtmtr_lam);
		} 
		else {
			frm.set_value("wtmtr", 0);
			frm.set_value("lamination_wt_per_pcs_gms", 0);
		}
	},
	// Tape Tab
	// Tape Width Calculation
	calculate_tape_width(frm) {
		let warp_tape_width = 0;
		let weft_tape_width = 0;
		if (frm.doc.tw_vs_mesh_against == "Dep") {
			// Warp Tape Width
			if (flt(frm.doc.tape_warp_mesh) > 0) {
				warp_tape_width = ((25.4 / flt(frm.doc.tape_warp_mesh)) - 0.06);
			}
			else {
				warp_tape_width = 0;
			}
			// Weft Tape Width
			if (flt(frm.doc.tape_weft_mesh) > 0) {
				weft_tape_width = ((25.4 / flt(frm.doc.tape_weft_mesh)) - 0.06);
			}
			else {
				weft_tape_width = 0;
			}
			frm.set_value("warp_tape_width", warp_tape_width);
			frm.set_value("weft_tape_width", weft_tape_width);
		}
		else {
			warp_tape_width = frm.doc.tw_vs_mesh_warp || 0;
			weft_tape_width = frm.doc.tw_vs_mesh_weft || 0;
			frm.set_value("warp_tape_width", warp_tape_width);
			frm.set_value("weft_tape_width", weft_tape_width);
		}
	},
	// Tape tab -> Warp section -> Denier Calculation for Warp, Weft and Weft Addn
	calculate_denier_calculation(frm) {
		let warp_denier = 0;
		let weft_denier = 0;
		let weft_addn_denier = 0;

		// Warp / Weft Denier Calculation
		if (frm.doc.denier_vs_mesh_against == "Dep") {
			if (frm.doc.tape_warp_mesh > 0) {
				warp_denier = frm.doc.fabric_gsm * 9000 / (100 / (2.54 / frm.doc.tape_warp_mesh) * 2);
			}
			else {
				warp_denier = 0;
			}
			if (frm.doc.tape_weft_mesh > 0) {
				weft_denier = frm.doc.fabric_gsm * 9000 / (100 / (2.54 / frm.doc.tape_weft_mesh) * 2);
			}
			else {
				weft_denier = 0;
			}
		}
		else if (frm.doc.denier_vs_mesh_against == "Ind") {
			if (frm.doc.tape_warp_mesh + frm.doc.tape_weft_mesh > 0) {
				warp_denier = frm.doc.fabric_gsm * 9000 / (100 / (2.54 / ((frm.doc.tape_warp_mesh + frm.doc.tape_weft_mesh) / 2)) * 2)
				weft_denier = frm.doc.fabric_gsm * 9000 / (100 / (2.54 / ((frm.doc.tape_warp_mesh + frm.doc.tape_weft_mesh) / 2)) * 2)
			}
			else {
				warp_denier = 0;
				weft_denier = 0;
			}
		}
		else {
			warp_denier = frm.doc.denier_vs_mesh_warp * 0.98;
			weft_denier = frm.doc.denier_vs_mesh_weft * 0.98;
		}

		// Weft Addn Denier Calculation
		if (frm.doc.weft_addn_gsm > 0) {
			weft_addn_denier = frm.doc.weft_denier
		}
		else {
			weft_addn_denier = 0
		}

		frm.set_value("warp_denier", Math.round(warp_denier));
		frm.set_value("weft_denier", Math.round(weft_denier));
		frm.set_value("weft_addn_denier", Math.round(weft_addn_denier));

		// frm.set_value("warp_denier", warp_denier);
		// frm.set_value("weft_denier", weft_denier);
		// frm.set_value("weft_addn_denier", weft_addn_denier);
	},
	calculate_lamination_wtsqm(frm) {
		frm.set_value("lamination_width", frm.doc.coating_gsm)
		if (frm.doc.coating_side && frm.doc.coating_side != "No") {
			frm.set_value("lamination_wtsqm", frm.doc.coating_gsm)
		}
		else {
			frm.set_value("lamination_wtsqm", 0)
		}
	},
	calculate_lamination_wt_ratio(frm) {
		if (frm.doc.fabric_gsm + frm.doc.lamination_wtsqm > 0) {
			const wt_ratio = frm.doc.lamination_wtsqm / (frm.doc.fabric_gsm + frm.doc.lamination_wtsqm)
			frm.set_value("lamination_wt_ratio", wt_ratio)
		}
		else {
			frm.set_value("lamination_wt_ratio", 0)
		}
	},
	// Loom m/Hr
	calculate_loom_mhr(frm) {
		const loom_mhr = flt(frm.doc.fabric_ppm) * ((25.4 / frm.doc.tape_weft_mesh) / 1000) * 60 * 0.85
		frm.set_value("loom_mhr", loom_mhr)
	},
	// Loom weight/hr
	calculate_loom_wthr(frm) {
		const loom_wthr = frm.doc.loom_mhr * frm.doc.wtmtr * frm.doc.loom_width_factor / 1000
		frm.set_value("loom_wthr", loom_wthr)
	},
	// Loom Hrs/MT
	calculate_loom_hrsmt(frm) {
		let loom_hrsmt = 0
		if (frm.doc.loom_wthr > 0) {
			loom_hrsmt = 1 * 1000 / frm.doc.loom_wthr;
		}
		frm.set_value("loom_hrsmt", loom_hrsmt)
	},

	// Child table helper
    calculate_material_cost(frm) {
		let material_cost = 0;
		for (var i=0; i<frm.doc.linermaterial_combination.length; i++) {
			material_cost += frm.doc.linermaterial_combination[i].amount;
		}
		frm.set_value('liner_material_cost', material_cost)
	},


});



// Child Doctype

frappe.ui.form.on('Technical Sheet SB Material Combination', {
    dosage(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const wastage = flt(frm.doc.weft_tape_wastage);
        const dosage = flt(row.dosage);

        row.qty = (dosage / 100) * (1 + wastage / 100);

        frm.trigger('calculate_amount', cdt, cdn);
		generate_tape_item(frm, {
			type: "Weft",
			width_field: "weft_tape_width",
			denier_field: "weft_denier",
			color_field: "tape_weft_color",
			material_table: "weftmaterial_combination",
			wt_ratio_field: "wt_ratio_weft",
			wastage_field: "weft_tape_wastage"
		});
		generate_tape_item(frm, {
			type: "Warp",
			width_field: "warp_tape_width",
			denier_field: "warp_denier",
			color_field: "tape_warp_color",
			material_table: "warpmaterial_combination",
			wt_ratio_field: "wt_ratio_warp",
			wastage_field: "warp_tape_wastage"
		});
		frm.refresh_fields(["warpmaterial_combination", "weftmaterial_combination"]);
    },

    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },

    qty(frm, cdt, cdn) {
	
        frm.trigger('calculate_amount', cdt, cdn);
    },
	
    calculate_amount(frm, cdt, cdn) {
		const row = locals[cdt][cdn];

		const qty = flt(row.qty);
		const base_rate = flt(row.base_rate);
		const exchange_rate = flt(frm.doc.exchange_rate) || 1; // USD -> QAR

		// QAR
		let base_amount = qty * base_rate;

		// USD
		let rate = base_rate / exchange_rate;
		let amount = base_amount / exchange_rate;

		frappe.model.set_value(cdt, cdn, "rate", rate);
		frappe.model.set_value(cdt, cdn, "base_amount", base_amount);
		frappe.model.set_value(cdt, cdn, "amount", amount);
		frm.refresh_fields(["warpmaterial_combination", "weftmaterial_combination"]);
	}
});

frappe.ui.form.on('Technical Sheet Others', {
	// Fields
    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
		update_warp_others_total(frm);
		update_weft_others_total(frm);
		update_liner_others_total(frm);
		
    },
    qty(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
		update_warp_others_total(frm);
		update_weft_others_total(frm);
		update_liner_others_total(frm);
    },
	// calculate_amount(frm, cdt, cdn) {
    //     const row = locals[cdt][cdn];
    //     // row.amount = flt(row.qty) * flt(row.rate);
	// 	row.base_amount = flt(row.qty) * flt(row.base_rate);
	// 	const exchange_rate = flt(frm.doc.exchange_rate) || 1;
	// 	frappe.model.set_value(cdt, cdn, "amount", ((flt(row.qty) * flt(row.rate))))
	// 	frm.refresh_fields(["warp_others", "weftmaterial_combination"]);
    // }
	calculate_amount(frm, cdt, cdn) {
		const row = locals[cdt][cdn];

		const qty = flt(row.qty);
		const base_rate = flt(row.base_rate);
		const exchange_rate = flt(frm.doc.exchange_rate) || 1; // USD -> QAR

		// QAR
		let base_amount = qty * base_rate;

		// USD
		let rate = base_rate / exchange_rate;
		let amount = base_amount / exchange_rate;

		frappe.model.set_value(cdt, cdn, "rate", rate);
		frappe.model.set_value(cdt, cdn, "base_amount", base_amount);
		frappe.model.set_value(cdt, cdn, "amount", amount);
		update_warp_others_total(frm);
		update_weft_others_total(frm);
		update_liner_others_total(frm);
		frm.refresh_fields(["warpmaterial_combination", "weftmaterial_combination","warp_others","weft_others"]);
	}
});

function update_warp_others_total(frm) {
    let total = 0;

    (frm.doc.warp_others || []).forEach(row => {
        total += flt(row.amount);
    });

    frm.set_value("warp_tape_conversion", total);
}

frappe.ui.form.on('Liner Material Combination', {
	// Fields
	dosage(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const wastage = flt(frm.doc.liner_production_wastage);
        const dosage = flt(row.dosage);

        row.qty = (dosage / 100) * (1 + (wastage / 100));
        frm.trigger('calculate_amount', cdt, cdn);
		frm.refresh_field("linermaterial_combination");
		generate_liner_item(frm);
    },
    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },
    qty(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },
	amount(frm) {
		frm.trigger('calculate_material_cost');
	},

	// Functions
    // calculate_amount(frm, cdt, cdn) {
    //     const row = locals[cdt][cdn];
    //     const amount = flt(row.qty) * flt(row.rate);
	// 	frappe.model.set_value(cdt, cdn, "amount", amount)
	// 	frm.refresh_field("linermaterial_combination");
    // },
	calculate_amount(frm, cdt, cdn) {
		const row = locals[cdt][cdn];

		const qty = flt(row.qty);
		const base_rate = flt(row.base_rate);
		const exchange_rate = flt(frm.doc.exchange_rate) || 1; // USD -> QAR

		// QAR
		let base_amount = qty * base_rate;

		// USD
		let rate = base_rate / exchange_rate;
		let amount = base_amount / exchange_rate;

		frappe.model.set_value(cdt, cdn, "rate", rate);
		frappe.model.set_value(cdt, cdn, "base_amount", base_amount);
		frappe.model.set_value(cdt, cdn, "amount", amount);
		update_liner_others_total(frm);
		frm.refresh_fields("linermaterial_combination");
	}
	
});
function update_liner_others_total(frm) {
    let total = 0;

    (frm.doc.liner_others || []).forEach(row => {
        total += flt(row.amount);
    });

    frm.set_value("conversion_liner", total);
}

frappe.ui.form.on('Lamination Material Combination', {
	// Fields
	dosage(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const wastage = flt(frm.doc.lamination_production_wastage);
        const dosage = flt(row.dosage);
		if (frm.doc.coating_side && frm.doc.coating_side != "No") {
			row.qty = (dosage / 100) * (1 + (wastage / 100)) * frm.doc.lamination_wt_ratio;
			frm.trigger('calculate_amount', cdt, cdn);
			update_lamination_others_total(frm);
			frm.refresh_field("laminationmaterial_combination");
		}
    },
    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
		update_lamination_others_total(frm);
    },
    qty(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
		update_lamination_others_total(frm);
    },
	amount(frm) {
		calculate_material_cost(frm, frm.doc.laminationmaterial_combination, "lamination_material_cost");
		// calculate_material_cost(frm, frm.doc.laminationmaterial_combination, "material_cost_lamination");
		update_lamination_others_total(frm);
	},

	// Functions
    // calculate_amount(frm, cdt, cdn) {
    //     const row = locals[cdt][cdn];
    //     const amount = flt(row.qty) * flt(row.rate);
	// 	frappe.model.set_value(cdt, cdn, "amount", amount)
	// 	frm.refresh_field("laminationmaterial_combination");
    // },
	calculate_amount(frm, cdt, cdn) {
		const row = locals[cdt][cdn];

		const qty = flt(row.qty);
		const base_rate = flt(row.base_rate);
		const exchange_rate = flt(frm.doc.exchange_rate) || 1; // USD -> QAR

		// QAR
		let base_amount = qty * base_rate;

		// USD
		let rate = base_rate / exchange_rate;
		let amount = base_amount / exchange_rate;

		frappe.model.set_value(cdt, cdn, "rate", rate);
		frappe.model.set_value(cdt, cdn, "base_amount", base_amount);
		frappe.model.set_value(cdt, cdn, "amount", amount);
		update_lamination_others_total(frm);
		// update_warp_others_total(frm);
		frm.refresh_fields(["laminationmaterial_combination"]);
	}
	
});

frappe.ui.form.on('Loom Material Combination', {
	// Fields
	dosage(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const wastage = flt(frm.doc.loom_production_wastage);
        const dosage = flt(row.dosage);
		if (frm.doc.coating_side && frm.doc.coating_side != "No") {
			row.qty = (dosage / 100) * (1 + (wastage / 100)) * frm.doc.loom_wt_ratio;
			frm.trigger('calculate_amount', cdt, cdn);
			frm.refresh_field("loommaterial_combination");
		}
    },
    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },
    qty(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },
	amount(frm) {
		frm.trigger('calculate_material_cost');
	},

	// Functions
    // calculate_amount(frm, cdt, cdn) {
    //     const row = locals[cdt][cdn];
    //     const amount = flt(row.qty) * flt(row.rate);
	// 	frappe.model.set_value(cdt, cdn, "amount", amount)
	// 	frm.refresh_field("loommaterial_combination");
    // },
	calculate_amount(frm, cdt, cdn) {
		const row = locals[cdt][cdn];

		const qty = flt(row.qty);
		const base_rate = flt(row.base_rate);
		const exchange_rate = flt(frm.doc.exchange_rate) || 1; // USD -> QAR

		// QAR
		let base_amount = qty * base_rate;

		// USD
		let rate = base_rate / exchange_rate;
		let amount = base_amount / exchange_rate;

		frappe.model.set_value(cdt, cdn, "rate", rate);
		frappe.model.set_value(cdt, cdn, "base_amount", base_amount);
		frappe.model.set_value(cdt, cdn, "amount", amount);
		frm.refresh_fields("loommaterial_combination");
	}
	
});

frappe.ui.form.on('Printing Material Combination', {
	// Fields
	dosage(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const wastage = flt(frm.doc.printing_production_wastage);
        const dosage = flt(row.dosage);

        row.qty = (dosage / 100) * (1 + (wastage / 100));
        frm.trigger('calculate_amount', cdt, cdn);
		frm.refresh_field("printingmaterial_combination");
    },
    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },
    qty(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },
	amount(frm) {
		frm.trigger('calculate_material_cost');
	},

	// Functions
    calculate_amount(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const amount = flt(row.qty) * flt(row.rate);
		frappe.model.set_value(cdt, cdn, "amount", amount)
		frm.refresh_field("printingmaterial_combination");
    },
	// calculate_amount(frm, cdt, cdn) {
	// 	const row = locals[cdt][cdn];

	// 	const qty = flt(row.qty);
	// 	const base_rate = flt(row.base_rate);
	// 	const exchange_rate = flt(frm.doc.exchange_rate) || 1; // USD -> QAR

	// 	// QAR
	// 	let base_amount = qty * base_rate;

	// 	// USD
	// 	let rate = base_rate / exchange_rate;
	// 	let amount = base_amount / exchange_rate;

	// 	frappe.model.set_value(cdt, cdn, "rate", rate);
	// 	frappe.model.set_value(cdt, cdn, "base_amount", base_amount);
	// 	frappe.model.set_value(cdt, cdn, "amount", amount);
	// 	frm.refresh_fields("printingmaterial_combination");
	// }
	
});


frappe.ui.form.on('Warp Material Combination', {
	dosage: function(frm,cdt,cdn){
		var warp_mat_comb = frm.doc.warp_order_requirement * (1 + (frm.doc.warp_tape_wastage/100))
		var row = locals[cdt][cdn]
		var qty = ((row.dosage/100)*warp_mat_comb)
		row.qty = qty
		generate_fabric_item(frm);
		frm.refresh_field("warpmaterial_combination")
	}
})
frappe.ui.form.on('Strip Material Combination', {
	dosage: function(frm,cdt,cdn){
		var strip_mat_comb = frm.doc.strip_order_requirement * (1 + (frm.doc.strip1_tape_wastage/100))
		var row = locals[cdt][cdn]
		var qty = ((row.dosage/100)*strip_mat_comb)
		
		row.qty = qty
		generate_tape_item(frm, {
			type: "Strip 1",
			width_field: "strip1_tape_width",
			denier_field: "strip1_denier",
			color_field: "strip1_color",
			material_table: "stripmaterial_combination"
		});
		generate_tape_item(frm, {
			type: "Strip 2",
			width_field: "strip2_tape_width",
			denier_field: "strip2_denier",
			color_field: "strip2_color",
			material_table: "strip2material_combination"
		});
		generate_tape_item(frm, {
			type: "Strip 3",
			width_field: "strip3_tape_width",
			denier_field: "strip3_denier",
			color_field: "strip3_color",
			material_table: "strip3material_combination"
		});
		generate_tape_item(frm, {
			type: "Strip 4",
			width_field: "strip4_tape_width",
			denier_field: "strip4_denier",
			color_field: "strip4_color",
			material_table: "strip4material_combination"
		});
		frm.refresh_field("stripmaterial_combination")
	}
})

// Stand Alone Functions
function calculation_for_widht_calc_field(width) {
	if (width < 2.25) {
		return 2.06
	}
	else if (2.25 <= width < 2.5) {
		return 2.25
	}
	else if (2.5 <= width < 3) {
		return 2.5
	}
	else if (3 <= width < 3.8) {
		return 3
	}
	else if (3.8 <= width < 4) {
		return 3.8
	}
	else {
		return 4
	}
}

function calculation_for_denier_calc_and_mmt_fields(denier){
	// Denier Calc
	const denier_calc = Math.round(denier / 50) * 50;
	// M/MT
	let mmt = 0;
	if (Number(denier) != 0) {
		mmt = 9000 * 1000 / Number(denier) * 1000;
	}
	
	return {
        denier_calc: denier_calc,
        mmt: mmt
    };
}

function calculate_hrsmt(frm, width_calc, denier_calc, field) {
    if (width_calc && denier_calc) {
        frappe.call({
            method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_tape_capacity_width",
            args: {
                width: width_calc,
                denier: denier_calc,
            },
            callback(r) {
                if (r && r.message !== undefined) {
                    frm.set_value(field, r.message);
                }
            }
        });
    }
}

function get_raw_materials_and_others(frm, check_field, material_combination, others, hrsmt, operation) {
    if (frm.doc[check_field]) {
		// Raw Materials
		if (frm.doc[material_combination].length == 0) {
			frappe.call({
				method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_raw_materials",
				args: {
					fg_item: frm.doc.technical_costing_item?.[0].item_code,
					operation: operation,
					exchange_rate:frm.doc.exchange_rate   
				},
				freeze: true,
				callback(r) {
					if (r && r.message) {
						frm.clear_table(material_combination);
						let exchnage_rate=frm.doc.exchange_rate||1;
						r.message.forEach(row => {
							
							let child = frm.add_child(material_combination);

							Object.entries(row).forEach(([key, value]) => {
								frappe.model.set_value(child.doctype, child.name, key, value);
							});
							
							// Trigger fetch_from for link fields
							frappe.model.trigger(child.doctype, "item_code", child.name);
						});

						frm.refresh_field(material_combination);
					}
				}
			})
		}
		// Others
		if (frm.doc[others].length == 0) {
			frappe.call({
				method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_overheads_and_others",
				args: {
					operation: operation,
					hrsmt: frm.doc[hrsmt],
					exchange_rate:frm.doc.exchange_rate
				},
				freeze: true,
				callback(r) {
					if (r && r.message) {
						frm.clear_table(others);
						r.message.forEach(row => {
							let child = frm.add_child(others);
							Object.assign(child, row);
						});
						frm.refresh_field(others);
					}
				}
			});
		}
    }
}

function get_raw_materials_and_others_lamination(frm, check_field, material_combination, others, hrsmt, operation) {
    if (frm.doc[check_field]) {
		// Raw Materials
		if (frm.doc[material_combination].length == 0) {
			frappe.call({
				method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_raw_materials",
				args: {
					fg_item: frm.doc.technical_costing_item?.[0].item_code,
					operation: operation,
					exchange_rate:frm.doc.exchange_rate
				},
				freeze: true,
				callback(r) {
					if (r && r.message) {
						frm.clear_table(material_combination);

						r.message.forEach(row => {
							let child = frm.add_child(material_combination);

							Object.entries(row).forEach(([key, value]) => {
								frappe.model.set_value(child.doctype, child.name, key, value);
							});

							// Trigger fetch_from for link fields
							frappe.model.trigger(child.doctype, "item_code", child.name);
						});

						frm.refresh_field(material_combination);
					}
				}
			})
		}
		// Others
		if (frm.doc[others].length == 0) {
			frappe.call({
				method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_overheads_and_others",
				args: {
					operation: operation,
					hrsmt: frm.doc[hrsmt],
					lamination_side: frm.doc.coating_side,
					lamination_width: frm.doc.lamination_width,
					fabric_type: frm.doc.fabric_type_size,
					exchange_rate:frm.doc.exchange_rate
				},
				freeze: true,
				callback(r) {
					if (r && r.message) {
						frm.clear_table(others);
						r.message.forEach(row => {
							let child = frm.add_child(others);
							Object.assign(child, row);
						});
						frm.refresh_field(others);
					}
				}
			});
		}
    }
}


function get_raw_materials_and_others_loom(frm, check_field, material_combination, others, hrsmt, operation) {
    if (frm.doc[check_field]) {
		// Raw Materials
		if (frm.doc[material_combination].length == 0) {
			frappe.call({
				method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_raw_materials",
				args: {
					fg_item: frm.doc.technical_costing_item?.[0].item_code,
					operation: operation,
					exchange_rate:frm.doc.exchange_rate
				},
				freeze: true,
				callback(r) {
					if (r && r.message) {
						frm.clear_table(material_combination);

						r.message.forEach(row => {
							let child = frm.add_child(material_combination);

							Object.entries(row).forEach(([key, value]) => {
								frappe.model.set_value(child.doctype, child.name, key, value);
							});

							// Trigger fetch_from for link fields
							frappe.model.trigger(child.doctype, "item_code", child.name);
						});

						frm.refresh_field(material_combination);
					}
				}
			})
		}
		// Others
		if (frm.doc[others].length == 0) {
			frappe.call({
				method: "qpic.qpic.doctype.technical_sheet.technical_sheet.get_overheads_and_others",
				args: {
					operation: operation,
					hrsmt: frm.doc[hrsmt],
					exchange_rate:frm.doc.exchange_rate
				},
				freeze: true,
				callback(r) {
					if (r && r.message) {
						frm.clear_table(others);
						r.message.forEach(row => {
							let child = frm.add_child(others);
							Object.assign(child, row);
						});
						frm.refresh_field(others);
					}
				}
			});
		}
    }
}

function get_qty_for_thread(frm) {
    let first_row = frm.doc.technical_costing_item?.[0];
    if (!first_row) return Promise.resolve(0);

    let item_group = first_row.item_group;
    if (item_group === "Small Bag") {
        let base = (flt(frm.doc.external_width) / 100) * 5.6;
        let lookup_total =
            flt(frm.doc.no_of_stitch_top) +
            flt(frm.doc.no_of_stitch_bottom);

        let intermediate = base * lookup_total;

        return frappe.db.get_value("Thread", frm.doc.thread, "denier")
            .then(r => {
                let denier = r.message?.denier || 0;
                let item_value = denier / 9000;
				let result=0;
                result = intermediate * item_value;
                return result;
            });
    }

    return Promise.resolve(0);
}

// Child table helper
function calculate_material_cost(frm, child_table, field_name) {
		let material_cost = 0;
		for (var i=0; i<child_table.length; i++) {
			material_cost += child_table[i].amount;
		}
		frm.set_value(field_name, material_cost)
}
function update_weft_others_total(frm) {
    let total = 0;

    (frm.doc.warp_others || []).forEach(row => {
        total += flt(row.amount);
    });

    frm.set_value("weft_tape_conversion", total);
}
function update_lamination_quote_value(frm) {

    let parent_group = frm.doc.costing_sheet_type;
    let lamination_total = flt(frm.doc.conversion_usd_lamination);

    if (!parent_group) {
        frm.set_value("convsn_quot_usdpcs_lamination", 0);
        return;
    }

    // Fetch only that Item Group (filtered)
    frappe.db.get_doc("Item Group", parent_group)
        .then(doc => {

            if (doc && doc.item_table && doc.item_table.length > 0) {

                // If child rows exist, set rounded value
                frm.set_value(
                    "convsn_quot_usdpcs_lamination",
                    Math.round(lamination_total)
                );

            } else {
                frm.set_value("convsn_quot_usdpcs_lamination", 0);
            }
        })
        .catch(() => {
            frm.set_value("convsn_quot_usdpcs_lamination", 0);
        });
}
function update_lamination_others_total(frm) {

    let total = 0;
	let lam_total=0;
	let loom_total=0;
    // ----------------------------------
    // 1️⃣ SUM(G205:G216)
    // lamination_others table amount
    // ----------------------------------
    (frm.doc.lamination_others || []).forEach(row => {
        total += flt(row.amount);
		lam_total+=flt(row.amount);
    });
	console.log("Lamination Others Total:", lam_total);
	(frm.doc.loom_others || []).forEach(row => {
        total += flt(row.amount);
		loom_total+=flt(row.amount);
    });

	console.log("Lamination + Loom Others Total:", loom_total);
    // ----------------------------------
    // 2️⃣ Get quantities from tape_item_details
    // ----------------------------------

    let warp_qty = 0;
    let weft_qty = 0;
    let weft_addn_qty = 0;
    let reenf_qty = 0;
    let strip1_qty = 0;
    let strip2_qty = 0;
    let strip3_qty = 0;
    let strip4_qty = 0;

    (frm.doc.tape_item_details || []).forEach(row => {

        if (row.type === "Warp") {
            warp_qty += flt(row.qty);
        }

        if (row.type === "Weft") {
            weft_qty += flt(row.qty);
        }

        if (row.type === "Weft Addn") {
            weft_addn_qty += flt(row.qty);
        }

        if (row.type === "Reenf") {
            reenf_qty += flt(row.qty);
        }

        if (row.type === "Strip 1") {
            strip1_qty += flt(row.qty);
        }

        if (row.type === "Strip 2") {
            strip2_qty += flt(row.qty);
        }

        if (row.type === "Strip 3") {
            strip3_qty += flt(row.qty);
        }

        if (row.type === "Strip 4") {
            strip4_qty += flt(row.qty);
        }
    });


    total += flt(frm.doc.warp_tape_conversion) * warp_qty;      
    total += flt(frm.doc.weft_tape_conversion) * weft_qty;      
    total += flt(frm.doc.weft_tape_conversion) * weft_addn_qty;  
    total += flt(frm.doc.warp_tape_conversion) * reenf_qty;    

    total += flt(frm.doc.conversion_strip_one)   * strip1_qty;   
    total += flt(frm.doc.conversion_strip_two)   * strip2_qty;   
    total += flt(frm.doc.conversion_strip_three) * strip3_qty;   
    total += flt(frm.doc.conversion_strip_four)  * strip4_qty;  

    if (frm.doc.technical_sheet_type === "Fabric") {

        if (frm.doc.coating_side === "One Side") {
            total += 25;
        }

        else if (frm.doc.coating_side === "Two Side") {
            total += 50;
        }
    }


    frm.set_value("conversion_usd_lamination", total);
}
function calculate_warp_sqm(frm) {

    let tape_warp_mesh = flt(frm.doc.tape_warp_mesh);
    let warp_denier = flt(frm.doc.warp_denier);

    let strip_one = flt(frm.doc.wt_sqm_strip_one);
    let strip_two = flt(frm.doc.wt_sqm_strip_two);
    let strip_three = flt(frm.doc.wt_sqm_strip_three);
    let strip_four = flt(frm.doc.wt_sqm_strip_four);

    let value = ((tape_warp_mesh / 0.0254) * warp_denier / 9000)
                - strip_one
                - strip_two
                - strip_three
                - strip_four;

    frm.set_value("wt_sqm_warp", value);
	let weft_value=0
	let tape_weft_mesh = flt(frm.doc.tape_weft_mesh);
	let weft_denier = flt(frm.doc.weft_denier);
	weft_value+=((tape_weft_mesh/0.0254)*weft_denier/9000)
	frm.set_value("wt_sqm_weft", weft_value);
	let weft_addn=0
	let tape_weft_addn_mesh = flt(frm.doc.tape_weft_addn_mesh);
	let weft_addn_denier = flt(frm.doc.weft_addn_denier);
	weft_addn+=((tape_weft_addn_mesh/0.0254)*weft_addn_denier/9000)
	frm.set_value("wt_sqm_weft_addn", weft_addn);
	let reenf_mesh = flt(frm.doc.tape_reenf_mesh);
    let reenf_denier = flt(frm.doc.reenf_denier);
    let reenf_strip_width = flt(frm.doc.reenf_strip_width);
    let reenf_no_of_strips = flt(frm.doc.reenf_no_of_strips_re);
    let fabric_width = flt(frm.doc.fabric_width);
    if (!fabric_width) {
        frm.set_value("wt_sqm_renf", 0);
    }
    let type = (frm.doc.fabric_type === "CRZZ") ? 2 : 1;
    let base_value = 0;
    if (reenf_mesh && reenf_denier) {
        base_value = (reenf_mesh / 0.0254) * reenf_denier / 9000;
    }

    let reenf = base_value *
                ((reenf_strip_width * reenf_no_of_strips) / type) /
                fabric_width;

    frm.set_value("wt_sqm_renf", reenf);
	// Strip 1
	let strip1_mesh = flt(frm.doc.strip1_mesh);
    let strip1_denier = flt(frm.doc.strip1_denier);
    let strip1_strip_width = flt(frm.doc.strip1_width);
    let strip1_no_of_strips = flt(frm.doc.strip1_no_of_strips_re);
    if (!fabric_width) {
        frm.set_value("wt_sqm_strip_one", 0);
    }
    let strip1base_value = 0;
    if (strip1_mesh && strip1_denier) {
        strip1base_value = (strip1_mesh / 0.0254) * strip1_denier / 9000;
    }

    let strip1 = strip1base_value *
                ((strip1_strip_width * strip1_no_of_strips) / type) /
                fabric_width;

    frm.set_value("wt_sqm_strip_one", strip1);
	// Strip 2
	let strip2_mesh = flt(frm.doc.strip2_mesh);
    let strip2_denier = flt(frm.doc.strip2_denier);
    let strip2_strip_width = flt(frm.doc.strip2_width);
    let sstrip2_no_of_strips = flt(frm.doc.strip2_no_of_strips_re);
    if (!fabric_width) {
        frm.set_value("wt_sqm_strip_two", 0);
        return;
    }
    let strip2base_value = 0;
    if (strip2_mesh && strip2_denier) {
        strip2base_value = (strip2_mesh / 0.0254) * strip2_denier / 9000;
    }

    let strip2 = strip2base_value *
                ((strip2_strip_width * sstrip2_no_of_strips) / type) /
                fabric_width;

    frm.set_value("wt_sqm_strip_two", strip2);
	// Strip 3
	let strip3_mesh = flt(frm.doc.strip3_mesh);
    let strip3_denier = flt(frm.doc.strip3_denier);
    let strip3_strip_width = flt(frm.doc.strip3_width);
    let strip3_no_of_strips = flt(frm.doc.strip3_no_of_strips_re);
    if (!fabric_width) {
        frm.set_value("conversion_strip_three", 0);
        return;
    }
    let strip3base_value = 0;
    if (strip3_mesh && strip3_denier) {
        strip3base_value = (strip3_mesh / 0.0254) * strip3_denier / 9000;
    }

    let strip3 = strip3base_value *
                ((strip3_strip_width * strip3_no_of_strips) / type) /
                fabric_width;

    frm.set_value("conversion_strip_three", strip3);
	// Strip 4
	let strip4_mesh = flt(frm.doc.strip4_mesh);
    let strip4_denier = flt(frm.doc.strip4_denier);
    let strip4_strip_width = flt(frm.doc.strip4_width);
    let strip4_no_of_strips = flt(frm.doc.strip4_no_of_strips_re);
    if (!fabric_width) {
        frm.set_value("wt_sqm_strip_four", 0);
    }
    let strip4base_value = 0;
    if (strip4_mesh && strip4_denier) {
        strip4base_value = (strip4_mesh / 0.0254) * strip4_denier / 9000;
    }

    let strip4 = strip4base_value *
                ((strip4_strip_width * strip4_no_of_strips) / type) /
                fabric_width;

    frm.set_value("wt_sqm_strip_four", strip4);
	let warp_sqm=flt(frm.doc.wt_sqm_warp);
	let warp_gsm=flt(frm.doc.fabric_gsm_warp);
	let lamination_sqm=flt(frm.doc.lamination_wtsqm);
	frm.set_value("wt_ratio_warp",(warp_sqm/(warp_gsm+lamination_sqm)))
	let weft_sqm=flt(frm.doc.wt_sqm_weft);
	frm.set_value("wt_ratio_weft",(weft_sqm/(warp_gsm+lamination_sqm)))
	let weft_addn_sqm=flt(frm.doc.wt_sqm_weft_addn);
	frm.set_value("wt_ratio_weft_addn",(weft_addn_sqm/(warp_gsm+lamination_sqm)))
	let reenf_sqm=flt(frm.doc.wt_sqm_renf);
	frm.set_value("wt_ratio_renf",(reenf_sqm/(warp_gsm+lamination_sqm)))
	let strip1_sqm=flt(frm.doc.wt_sqm_strip_one);
	frm.set_value("wt_ratio_strip_1",(strip1_sqm/(warp_gsm+lamination_sqm)))
	let strip2_sqm=flt(frm.doc.wt_sqm_strip_two);
	frm.set_value("wt_ratio_strip_2",(strip2_sqm/(warp_gsm+lamination_sqm)))
	let strip3_sqm=flt(frm.doc.wt_sqm_strip_three);
	frm.set_value("wt_ratio_strip_3",(strip3_sqm/(warp_gsm+lamination_sqm)))
	let strip4_sqm=flt(frm.doc.wt_sqm_strip_four);
	frm.set_value("wt_ratio_strip_4",(strip4_sqm/(warp_gsm+lamination_sqm)))
	let fabric_gsm=flt(frm.doc.wt_sqm_warp)+flt(frm.doc.wt_sqm_weft)+flt(frm.doc.wt_sqm_weft_addn)+
	flt(frm.doc.wt_sqm_renf)+flt(frm.doc.wt_sqm_strip_one)+flt(frm.doc.wt_sqm_strip_two)+flt(frm.doc.wt_sqm_strip_three)+flt(frm.doc.wt_sqm_strip_four)
	frm.set_value("fabric_gsm_warp",fabric_gsm)
	frm.set_value("fabric_gsm_weft_addn",fabric_gsm)
}

// Fabric
function generate_fabric_item(frm) {

    // LAMINATED condition
    let laminated = (frm.doc.coating_side && frm.doc.coating_side !== "No")
        ? "LAMINATED"
        : "";
    // R condition
    let reinforcement = frm.doc.weft_addn_tape_width ? "R" : "";

    let fabric_type = frm.doc.fabric_type || "";
    let fabric_width = frm.doc.fabric_width || "";
    let gsm = frm.doc.fabric_total_gsm || "";
    let warp_mesh = frm.doc.tape_warp_mesh || "";
    let weft_mesh = frm.doc.tape_weft_mesh || "";
    let fabric_color = frm.doc.fabric_color || "";

    // Dosages
    let pp_raffia = 0,
        filler_mb = 0,
        mb_cd = 0,
        uv_pp = 0,
        tpt_filler = 0,
        recycled_pp = 0;

    (frm.doc.warpmaterial_combination || []).forEach(row => {

        if (row.item_name === "PP Raffia Grade")
            pp_raffia = row.dosage || 0;

        if (row.item_name === "Filler Masterbatch (PP)")
            filler_mb = row.dosage || 0;

        if (row.item_name === "MB-C-D")
            mb_cd = row.dosage || 0;

        if (row.item_name === "UV - PP")
            uv_pp = row.dosage || 0;

        if (row.item_name === "TPT Filler - PP")
            tpt_filler = row.dosage || 0;

        if (row.item_name === "Recycled PP White")
            recycled_pp = row.dosage || 0;
    });

    let dosage_string = `${pp_raffia}:${filler_mb}:${mb_cd}:${uv_pp}:${tpt_filler}:${recycled_pp}`;

    let result = `FABRIC ${laminated} ${fabric_type} ${reinforcement} ${fabric_width}_${gsm}_${warp_mesh}X${weft_mesh}_${fabric_color}_${dosage_string}`;

    let fabric_row = null;

    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.item && row.item.startsWith("FABRIC")) {
            fabric_row = row;

        }
    });

    if (fabric_row) {
        fabric_row.item = result;
		fabric_row.type="Fabric";
    } else {
        let row = frm.add_child("tape_item_details");
        row.item = result;
		row.type="Fabric";
    }

    frm.refresh_field("tape_item_details");
}
// Liner
function generate_liner_item(frm) {

    let width = frm.doc.width || "";
    let thickness = frm.doc.thickness || "";

    // Dosages from liner material combination
    let ldpe = 0,
        lldpe = 0,
        hdpe = 0,
        biodegradable = 0,
        mb_w = 0,
        antistatic = 0,
        filler_mb = 0,
        antiblock = 0,
        recycled_pe = 0;

    (frm.doc.linermaterial_combination || []).forEach(row => {

        if (row.item_name === "LDPE")
            ldpe = row.dosage || 0;

        if (row.item_name === "LLDPE")
            lldpe = row.dosage || 0;

        if (row.item_name === "HDPE")
            hdpe = row.dosage || 0;

        if (row.item_name === "Biodegradable")
            biodegradable = row.dosage || 0;

        if (row.item_name === "MB-W")
            mb_w = row.dosage || 0;

        if (row.item_name === "Antistatic MB")
            antistatic = row.dosage || 0;

        if (row.item_name === "Filler Masterbatch PE")
            filler_mb = row.dosage || 0;

        if (row.item_name === "Antiblock")
            antiblock = row.dosage || 0;

        if (row.item_name === "Recycled PE Mix")
            recycled_pe = row.dosage || 0;
    });

    let dosage_string = `${ldpe}:${lldpe}:${hdpe}:${biodegradable}:${mb_w}:${antistatic}:${filler_mb}:${antiblock}:${recycled_pe}`;

    let result = `LINER ${width}W ${thickness}µ ${dosage_string}`;

    let liner_row = null;

    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.item && row.item.startsWith("LINER")) {
            liner_row = row;
        }
    });

    if (liner_row) {
        liner_row.item = result;
		liner_row.qty=(flt(frm.doc.liner_weight_gms || 0)*(1+(frm.doc.wastage/100)+(frm.doc.liner_production_wastage/100)))
		liner_row.type="Liner"
    } else {
        let row = frm.add_child("tape_item_details");
        row.item = result;
		row.qty=(flt(frm.doc.liner_weight_gms || 0)*(1+(frm.doc.wastage/100)+(frm.doc.liner_production_wastage/100)))
		row.type="Liner"
    }

    frm.refresh_field("tape_item_details");
}
function generate_tape_item(frm, config) {

    if (!frm.doc[config.width_field]) return;

    let type   = config.type;   // warp / weft / strip1 etc
    let width  = frm.doc[config.width_field] || "";
    let denier = Math.round(frm.doc[config.denier_field] || 0);
    let color  = frm.doc[config.color_field] || "";

    // 🔹 QTY calculation (if fields provided)
    let qty = 0;
    if (config.wt_ratio_field && config.wastage_field) {
        let wt_ratio = flt(frm.doc[config.wt_ratio_field]) || 0;
        let wastage  = flt(frm.doc[config.wastage_field]) || 0;
        qty = wt_ratio * (1 + (wastage / 100));
    }

    // 🔹 Dosage values
    let pp_raffia = 0,
        filler_mb = 0,
        mb_cd = 0,
        uv_pp = 0,
        tpt_filler = 0,
        recycled_pp = 0;

    (frm.doc[config.material_table] || []).forEach(row => {

        if (row.item_name === "PP Raffia Grade")
            pp_raffia = row.dosage || 0;

        if (row.item_name === "Filler Masterbatch (PP)")
            filler_mb = row.dosage || 0;

        if (row.item_name === "MB-C-D")
            mb_cd = row.dosage || 0;

        if (row.item_name === "UV - PP")
            uv_pp = row.dosage || 0;

        if (row.item_name === "TPT Filler - PP")
            tpt_filler = row.dosage || 0;

        if (row.item_name === "Recycled PP White")
            recycled_pp = row.dosage || 0;
    });

    let result = `TAPE ${width}X${denier}_${color} ${pp_raffia}:${filler_mb}:${mb_cd}:${uv_pp}:${tpt_filler}:${recycled_pp}`;
	if (type === "Warp") {
        frm.set_value("warp_tape_name", result);
		frm.refresh_field("warp_tape_name")
    }
	if (type === "Weft") {
        frm.set_value("weft_tape_name", result);
		frm.refresh_field("weft_tape_name")
    }
	if (type === "Weft Addn") {
        frm.set_value("weft_addn_tape_name", result);
		frm.refresh_field("weft_addn_tape_name")
    }
	if (type === "Reenf") {
        frm.set_value("reenf_tape_name", result);
		frm.refresh_field("reenf_tape_name")
    }
	if (type === "Strip 1") {
        frm.set_value("strip1_tape_name", result);
		frm.refresh_field("strip1_tape_name")
    }
	if (type === "Strip 2") {
        frm.set_value("strip2_tape_name", result);
		frm.refresh_field("strip2_tape_name")
    }
	if (type === "Strip 3") {
        frm.set_value("strip3_tape_name", result);
		frm.refresh_field("strip3_tape_name")
    }
	if (type === "Strip 4") {
        frm.set_value("strip4_tape_name", result);
		frm.refresh_field("strip4_tape_name")
    }
    let existing_row = null;

    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === type) {
            existing_row = row;
        }
    });

    if (existing_row) {
        existing_row.item = result;
        if (qty) existing_row.qty = qty;
    } else {
        let row = frm.add_child("tape_item_details");
        row.type = type;   
        row.item = result;
        if (qty) row.qty = qty;
    }

    frm.refresh_field("tape_item_details");
}
function sync_lamination_items_to_tape(frm) {

    let existing_items = [];

    // Collect existing item names from tape_item_details
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.item) {
            existing_items.push(row.item);
        }
    });

    (frm.doc.laminationmaterial_combination || []).forEach(row => {

        if (row.item_name && !existing_items.includes(row.item_name)) {

            let new_row = frm.add_child("tape_item_details");

            new_row.item = row.item_name;
            new_row.type = "Lamination";
            new_row.qty = row.qty || 0;

        }

    });

    frm.refresh_field("tape_item_details");
}
function sync_printing_items_to_tape(frm) {

    let existing_items = [];

    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.item) {
            existing_items.push(row.item);
        }
    });

    (frm.doc.printingmaterial_combination || []).forEach(row => {

        if (row.item_name && !existing_items.includes(row.item_name)) {

            let new_row = frm.add_child("tape_item_details");

            new_row.item = row.item_name;
            new_row.type = "Printing";
            new_row.qty = row.qty || 0;

        }

    });

    frm.refresh_field("tape_item_details");
}
function set_warp_pp_raffia_qty(frm) {
    let warp_qty = 0;
	let weft_qty=0;
	let strip1_qty=0;
	let strip2_qty=0;
	let strip3_qty=0;
	let strip4_qty=0;
	let fabric_qty=0;
	let fabric_calc = 0;
    if (frm.doc.technical_sheet_type === "Small Bag") {

        let cut_length = flt(frm.doc.cut_length || 0);
        let lamination_wt = flt(frm.doc.lamination_wt_per_pcs_gms || 0);
        let wastage = flt(frm.doc.wastage || 0);

        fabric_calc = ((cut_length / 100) * lamination_wt) * (1 + wastage/100);
    }

    (frm.doc.warpmaterial_combination || []).forEach(row => {
        if (row.item_name === "PP Raffia Grade") {
            warp_qty = row.qty || 0; 
        }
    });
	(frm.doc.weftmaterial_combination || []).forEach(row => {
        if (row.item_name === "PP Raffia Grade") {
            weft_qty = row.qty || 0; 
        }
    });
	(frm.doc.warpaddn_material_combination || []).forEach(row => {
        if (row.item_name === "PP Raffia Grade") {
            weft_addn = row.qty || 0; 
        }
    });
	(frm.doc.stripmaterial_combination || []).forEach(row => {
        if (row.item_name === "PP Raffia Grade") {
            strip1_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip2material_combination || []).forEach(row => {
        if (row.item_name === "PP Raffia Grade") {
            strip2_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip3material_combination || []).forEach(row => {
        if (row.item_name === "PP Raffia Grade") {
            strip3_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip4material_combination || []).forEach(row => {
        if (row.item_name === "PP Raffia Grade") {
            strip4_qty = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type !== "Fabric" && row.type!='Lamination' && row.type!="Printing" && row.type!="Liner") {
            fabric_qty += row.pp_raffia_grade || 0; 
		}
    });
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === "Warp") {
            row.pp_raffia_grade = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft") {
            row.pp_raffia_grade = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft Addn") {
            row.pp_raffia_grade = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Reenf") {
            row.pp_raffia_grade = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 1") {
            row.pp_raffia_grade = strip1_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 2") {
            row.pp_raffia_grade = strip2_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 3") {
            row.pp_raffia_grade = strip3_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 4") {
            row.pp_raffia_grade = strip4_qty* flt(row.qty || 0);
        }
		if (row.type === "Fabric") {
			row.qty=fabric_calc;
            row.pp_raffia_grade = fabric_qty* (flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}

function set_master_batch_qty(frm) {
    let warp_qty = 0;
	let weft_qty=0;
	let strip1_qty=0;
	let strip2_qty=0;
	let strip3_qty=0;
	let strip4_qty=0;
	let fabric_qty=0;
	let fabric_calc = 0;
	
    (frm.doc.warpmaterial_combination || []).forEach(row => {
        if (row.item_name === "Filler Masterbatch (PP)") {
            warp_qty = row.qty || 0; 
        }
    });
	(frm.doc.weftmaterial_combination || []).forEach(row => {
        if (row.item_name === "Filler Masterbatch (PP)") {
            weft_qty = row.qty || 0; 
        }
    });
	(frm.doc.warpaddn_material_combination || []).forEach(row => {
        if (row.item_name === "Filler Masterbatch (PP)") {
            weft_addn = row.qty || 0; 
        }
    });
	(frm.doc.stripmaterial_combination || []).forEach(row => {
        if (row.item_name === "Filler Masterbatch (PP)") {
            strip1_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip2material_combination || []).forEach(row => {
        if (row.item_name === "Filler Masterbatch (PP)") {
            strip2_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip3material_combination || []).forEach(row => {
        if (row.item_name === "Filler Masterbatch (PP)") {
            strip3_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip4material_combination || []).forEach(row => {
        if (row.item_name === "Filler Masterbatch (PP)") {
            strip4_qty = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type !== "Fabric" && row.type!='Lamination' && row.type!="Printing" && row.type!="Liner") {
            fabric_qty += row.filler_masterbatch_pp || 0; 
		}
    });
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === "Warp") {
            row.filler_masterbatch_pp = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft") {
            row.filler_masterbatch_pp = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft Addn") {
            row.filler_masterbatch_pp = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Reenf") {
            row.filler_masterbatch_pp = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 1") {
            row.filler_masterbatch_pp = strip1_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 2") {
            row.filler_masterbatch_pp = strip2_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 3") {
            row.filler_masterbatch_pp = strip3_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 4") {
            row.filler_masterbatch_pp = strip4_qty* flt(row.qty || 0);
        }
		if(row.type === "Fabric") {
            row.filler_masterbatch_pp =fabric_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_mb_w_qty(frm) {
    let warp_qty = 0;
	let weft_qty=0;
	let strip1_qty=0;
	let strip2_qty=0;
	let strip3_qty=0;
	let strip4_qty=0;
	let fabric_qty=0;
	let fabric_calc = 0;
	
    (frm.doc.warpmaterial_combination || []).forEach(row => {
        if (row.item_name === "MB-W") {
            warp_qty = row.qty || 0; 
        }
    });
	(frm.doc.weftmaterial_combination || []).forEach(row => {
        if (row.item_name === "MB-W") {
            weft_qty = row.qty || 0; 
        }
    });
	(frm.doc.warpaddn_material_combination || []).forEach(row => {
        if (row.item_name === "MB-W") {
            weft_addn = row.qty || 0; 
        }
    });
	(frm.doc.stripmaterial_combination || []).forEach(row => {
        if (row.item_name === "MB-W") {
            strip1_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip2material_combination || []).forEach(row => {
        if (row.item_name === "MB-W") {
            strip2_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip3material_combination || []).forEach(row => {
        if (row.item_name === "MB-W") {
            strip3_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip4material_combination || []).forEach(row => {
        if (row.item_name === "MB-W") {
            strip4_qty = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type !== "Fabric" && row.type!='Lamination' && row.type!="Printing" && row.type!="Liner") {
            fabric_qty += row.mb_w || 0; 
		}
    });
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === "Warp") {
            row.mb_w = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft") {
            row.mb_w = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft Addn") {
            row.mb_w = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Reenf") {
            row.mb_w = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 1") {
            row.mb_w = strip1_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 2") {
            row.mb_w = strip2_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 3") {
            row.mb_w = strip3_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 4") {
            row.mb_w = strip4_qty* flt(row.qty || 0);
        }
		if(row.type === "Fabric") {
            row.mb_w =fabric_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_mb_c_l_qty(frm) {
    let warp_qty = 0;
	let weft_qty=0;
	let strip1_qty=0;
	let strip2_qty=0;
	let strip3_qty=0;
	let strip4_qty=0;
	let fabric_qty=0;
	let fabric_calc = 0;
	
    (frm.doc.warpmaterial_combination || []).forEach(row => {
        if (row.item_name === "MB-C-L") {
            warp_qty = row.qty || 0; 
        }
    });
	(frm.doc.weftmaterial_combination || []).forEach(row => {
        if (row.item_name === "MB-C-L") {
            weft_qty = row.qty || 0; 
        }
    });
	(frm.doc.warpaddn_material_combination || []).forEach(row => {
        if (row.item_name === "MB-C-L") {
            weft_addn = row.qty || 0; 
        }
    });
	(frm.doc.stripmaterial_combination || []).forEach(row => {
        if (row.item_name === "MB-C-L") {
            strip1_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip2material_combination || []).forEach(row => {
        if (row.item_name === "MB-C-L") {
            strip2_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip3material_combination || []).forEach(row => {
        if (row.item_name === "MB-C-L") {
            strip3_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip4material_combination || []).forEach(row => {
        if (row.item_name === "MB-C-L") {
            strip4_qty = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type !== "Fabric" && row.type!='Lamination' && row.type!="Printing" && row.type!="Liner") {
            fabric_qty += row.mb_c_l || 0; 
		}
    });
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === "Warp") {
            row.mb_c_l = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft") {
            row.mb_c_l = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft Addn") {
            row.mb_c_l = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Reenf") {
            row.mb_c_l = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 1") {
            row.mb_c_l = strip1_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 2") {
            row.mb_c_l = strip2_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 3") {
            row.mb_c_l = strip3_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 4") {
            row.mb_c_l = strip4_qty* flt(row.qty || 0);
        }
		if(row.type === "Fabric") {
            row.mb_c_l =fabric_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_mb_c_d_qty(frm) {
    let warp_qty = 0;
	let weft_qty=0;
	let strip1_qty=0;
	let strip2_qty=0;
	let strip3_qty=0;
	let strip4_qty=0;
	let fabric_qty=0;
	let fabric_calc = 0;
	
    (frm.doc.warpmaterial_combination || []).forEach(row => {
        if (row.item_name === "MB-C-D") {
            warp_qty = row.qty || 0; 
        }
    });
	(frm.doc.weftmaterial_combination || []).forEach(row => {
        if (row.item_name === "MB-C-D") {
            weft_qty = row.qty || 0; 
        }
    });
	(frm.doc.warpaddn_material_combination || []).forEach(row => {
        if (row.item_name === "MB-C-D") {
            weft_addn = row.qty || 0; 
        }
    });
	(frm.doc.stripmaterial_combination || []).forEach(row => {
        if (row.item_name === "MB-C-D") {
            strip1_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip2material_combination || []).forEach(row => {
        if (row.item_name === "MB-C-D") {
            strip2_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip3material_combination || []).forEach(row => {
        if (row.item_name === "MB-C-D") {
            strip3_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip4material_combination || []).forEach(row => {
        if (row.item_name === "MB-C-D") {
            strip4_qty = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type !== "Fabric" && row.type!='Lamination' && row.type!="Printing" && row.type!="Liner") {
            fabric_qty += row.mb_c_d || 0; 
		}
    });
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === "Warp") {
            row.mb_c_d = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft") {
            row.mb_c_d = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft Addn") {
            row.mb_c_d = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Reenf") {
            row.mb_c_d = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 1") {
            row.mb_c_d = strip1_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 2") {
            row.mb_c_d = strip2_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 3") {
            row.mb_c_d = strip3_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 4") {
            row.mb_c_d = strip4_qty* flt(row.qty || 0);
        }
		if(row.type === "Fabric") {
            row.mb_c_d =fabric_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_mb_uv_pp_qty(frm) {
    let warp_qty = 0;
	let weft_qty=0;
	let strip1_qty=0;
	let strip2_qty=0;
	let strip3_qty=0;
	let strip4_qty=0;
	let fabric_qty=0;
	let fabric_calc = 0;
	
    (frm.doc.warpmaterial_combination || []).forEach(row => {
        if (row.item_name === "UV - PP") {
            warp_qty = row.qty || 0; 
        }
    });
	(frm.doc.weftmaterial_combination || []).forEach(row => {
        if (row.item_name === "UV - PP") {
            weft_qty = row.qty || 0; 
        }
    });
	(frm.doc.warpaddn_material_combination || []).forEach(row => {
        if (row.item_name === "UV - PP") {
            weft_addn = row.qty || 0; 
        }
    });
	(frm.doc.stripmaterial_combination || []).forEach(row => {
        if (row.item_name === "UV - PP") {
            strip1_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip2material_combination || []).forEach(row => {
        if (row.item_name === "UV - PP") {
            strip2_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip3material_combination || []).forEach(row => {
        if (row.item_name === "UV - PP") {
            strip3_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip4material_combination || []).forEach(row => {
        if (row.item_name === "UV - PP") {
            strip4_qty = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type !== "Fabric" && row.type!='Lamination' && row.type!="Printing" && row.type!="Liner") {
            fabric_qty += row.uv__pp || 0; 
		}
    });
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === "Warp") {
            row.uv__pp = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft") {
            row.uv__pp = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft Addn") {
            row.uv__pp = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Reenf") {
            row.uv__pp = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 1") {
            row.uv__pp = strip1_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 2") {
            row.uv__pp = strip2_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 3") {
            row.uv__pp = strip3_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 4") {
            row.uv__pp = strip4_qty* flt(row.qty || 0);
        }
		if(row.type === "Fabric") {
            row.uv__pp =fabric_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_mb_tpt_filler_qty(frm) {
    let warp_qty = 0;
	let weft_qty=0;
	let strip1_qty=0;
	let strip2_qty=0;
	let strip3_qty=0;
	let strip4_qty=0;
	let fabric_qty=0;
	let fabric_calc = 0;
	
    (frm.doc.warpmaterial_combination || []).forEach(row => {
        if (row.item_name === "TPT Filler - PP") {
            warp_qty = row.qty || 0; 
        }
    });
	(frm.doc.weftmaterial_combination || []).forEach(row => {
        if (row.item_name === "TPT Filler - PP") {
            weft_qty = row.qty || 0; 
        }
    });
	(frm.doc.warpaddn_material_combination || []).forEach(row => {
        if (row.item_name === "TPT Filler - PP") {
            weft_addn = row.qty || 0; 
        }
    });
	(frm.doc.stripmaterial_combination || []).forEach(row => {
        if (row.item_name === "TPT Filler - PP") {
            strip1_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip2material_combination || []).forEach(row => {
        if (row.item_name === "TPT Filler - PP") {
            strip2_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip3material_combination || []).forEach(row => {
        if (row.item_name === "TPT Filler - PP") {
            strip3_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip4material_combination || []).forEach(row => {
        if (row.item_name === "TPT Filler - PP") {
            strip4_qty = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type !== "Fabric" && row.type!='Lamination' && row.type!="Printing" && row.type!="Liner") {
            fabric_qty += row.tpt_filler_pp || 0; 
		}
    });
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === "Warp") {
            row.tpt_filler_pp = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft") {
            row.tpt_filler_pp = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft Addn") {
            row.tpt_filler_pp = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Reenf") {
            row.tpt_filler_pp = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 1") {
            row.tpt_filler_pp = strip1_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 2") {
            row.tpt_filler_pp = strip2_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 3") {
            row.tpt_filler_pp = strip3_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 4") {
            row.tpt_filler_pp = strip4_qty* flt(row.qty || 0);
        }
		if(row.type === "Fabric") {
            row.tpt_filler_pp =fabric_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_recycled_pp_mix_qty(frm) {
    let warp_qty = 0;
	let weft_qty=0;
	let strip1_qty=0;
	let strip2_qty=0;
	let strip3_qty=0;
	let strip4_qty=0;
	let fabric_qty=0;
	let fabric_calc = 0;
	
    (frm.doc.warpmaterial_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP Mix") {
            warp_qty = row.qty || 0; 
        }
    });
	(frm.doc.weftmaterial_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP Mix") {
            weft_qty = row.qty || 0; 
        }
    });
	(frm.doc.warpaddn_material_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP Mix") {
            weft_addn = row.qty || 0; 
        }
    });
	(frm.doc.stripmaterial_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP Mix") {
            strip1_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip2material_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP Mix") {
            strip2_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip3material_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP Mix") {
            strip3_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip4material_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP Mix") {
            strip4_qty = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type !== "Fabric" && row.type!='Lamination' && row.type!="Printing" && row.type!="Liner") {
            fabric_qty += row.recycled_pp_mix || 0; 
		}
    });
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === "Warp") {
            row.recycled_pp_mix = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft") {
            row.recycled_pp_mix = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft Addn") {
            row.recycled_pp_mix = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Reenf") {
            row.recycled_pp_mix = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 1") {
            row.recycled_pp_mix = strip1_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 2") {
            row.recycled_pp_mix = strip2_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 3") {
            row.recycled_pp_mix = strip3_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 4") {
            row.recycled_pp_mix = strip4_qty* flt(row.qty || 0);
        }
		if(row.type === "Fabric") {
            row.recycled_pp_mix =fabric_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_recycled_pp_white_qty(frm) {
    let warp_qty = 0;
	let weft_qty=0;
	let strip1_qty=0;
	let strip2_qty=0;
	let strip3_qty=0;
	let strip4_qty=0;
	let fabric_qty=0;
	let fabric_calc = 0;
	
    (frm.doc.warpmaterial_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP White") {
            warp_qty = row.qty || 0; 
        }
    });
	(frm.doc.weftmaterial_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP White") {
            weft_qty = row.qty || 0; 
        }
    });
	(frm.doc.warpaddn_material_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP White") {
            weft_addn = row.qty || 0; 
        }
    });
	(frm.doc.stripmaterial_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP White") {
            strip1_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip2material_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP White") {
            strip2_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip3material_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP White") {
            strip3_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip4material_combination || []).forEach(row => {
        if (row.item_name === "Recycled PP White") {
            strip4_qty = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type !== "Fabric" && row.type!='Lamination' && row.type!="Printing" && row.type!="Liner") {
            fabric_qty += row.recycled_pp_white || 0; 
		}
    });
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === "Warp") {
            row.recycled_pp_white = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft") {
            row.recycled_pp_white = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft Addn") {
            row.recycled_pp_white = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Reenf") {
            row.recycled_pp_white = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 1") {
            row.recycled_pp_white = strip1_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 2") {
            row.recycled_pp_white = strip2_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 3") {
            row.recycled_pp_white = strip3_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 4") {
            row.recycled_pp_white = strip4_qty* flt(row.qty || 0);
        }
		if(row.type === "Fabric") {
            row.recycled_pp_white =fabric_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_antistatic_qty(frm) {
    let warp_qty = 0;
	let weft_qty=0;
	let strip1_qty=0;
	let strip2_qty=0;
	let strip3_qty=0;
	let strip4_qty=0;
	let fabric_qty=0;
	let fabric_calc = 0;
	
    (frm.doc.warpmaterial_combination || []).forEach(row => {
        if (row.item_name === "Antistatic MB") {
            warp_qty = row.qty || 0; 
        }
    });
	(frm.doc.weftmaterial_combination || []).forEach(row => {
        if (row.item_name === "Antistatic MB") {
            weft_qty = row.qty || 0; 
        }
    });
	(frm.doc.warpaddn_material_combination || []).forEach(row => {
        if (row.item_name === "Antistatic MB") {
            weft_addn = row.qty || 0; 
        }
    });
	(frm.doc.stripmaterial_combination || []).forEach(row => {
        if (row.item_name === "Antistatic MB") {
            strip1_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip2material_combination || []).forEach(row => {
        if (row.item_name === "Antistatic MB") {
            strip2_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip3material_combination || []).forEach(row => {
        if (row.item_name === "Antistatic MB") {
            strip3_qty = row.qty || 0; 
        }
    });
	(frm.doc.strip4material_combination || []).forEach(row => {
        if (row.item_name === "Antistatic MB") {
            strip4_qty = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type !== "Fabric" && row.type!='Lamination' && row.type!="Printing" && row.type!="Liner") {
            fabric_qty += row.antistatic_mb || 0; 
		}
    });
    (frm.doc.tape_item_details || []).forEach(row => {
        if (row.type === "Warp") {
            row.antistatic_mb = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft") {
            row.antistatic_mb = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Weft Addn") {
            row.antistatic_mb = weft_qty* flt(row.qty || 0);
        }
		if (row.type === "Reenf") {
            row.antistatic_mb = warp_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 1") {
            row.antistatic_mb = strip1_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 2") {
            row.antistatic_mb = strip2_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 3") {
            row.antistatic_mb = strip3_qty* flt(row.qty || 0);
        }
		if (row.type === "Strip 4") {
            row.antistatic_mb = strip4_qty* flt(row.qty || 0);
        }
		if(row.type === "Fabric") {
            row.antistatic_mb =fabric_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_ldap_qty(frm) {
    let l_grade = 0;
	let pp_grade=0;
	let fabric_qty=0;
	let fabric_ld_qty=0;
	
    (frm.doc.laminationmaterial_combination || []).forEach(row => {
        if (row.item_name === "LDPE Lamination Grade") {
            l_grade = row.qty || 0; 
        }
    });
	(frm.doc.laminationmaterial_combination || []).forEach(row => {
        if (row.item_name === "PP Lamination Grade") {
            pp_grade = row.qty || 0; 
        }
    });
	(frm.doc.tape_item_details || []).forEach(row => {
		if (row.type=='Lamination' && row.item=="PP Lamination Grade") {
            fabric_qty += row.pp_lamination_grade || 0; 
		}
		if (row.type=='Lamination' && row.item=="LDPE Lamination Grade") {
            fabric_ld_qty += row.ldpe_lamination_grade || 0; 
		}

    });
    (frm.doc.tape_item_details || []).forEach(row => {
		if (row.type === "Lamination" && row.item=="LDPE Lamination Grade" ) {
            row.ldpe_lamination_grade =l_grade;
        }
		if (row.type === "Lamination" && row.item=="PP Lamination Grade") {
            row.pp_lamination_grade = pp_grade;
        }
		if(row.type === "Fabric") {
            row.pp_lamination_grade =fabric_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
			row.ldpe_lamination_grade =fabric_ld_qty *( flt(row.qty || 0)/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_printing_qty(frm) {
    let printing_ink = 0;
	let thinner=0;
	let denier=0;	
    (frm.doc.printingmaterial_combination || []).forEach(row => {
        if (row.item_name === "Printing Ink") {
            printing_ink = row.qty || 0; 
        }
    });
	(frm.doc.printingmaterial_combination || []).forEach(row => {
        if (row.item_name === "Thinner") {
            thinner = row.qty || 0; 
        }
    });
	(frm.doc.printingmaterial_combination || []).forEach(row => {
        if (row.item_name != "Printing Ink" && row.item_name != "Thinner") {
            denier = row.qty || 0; 
        }
    });
	
    (frm.doc.tape_item_details || []).forEach(row => {
		if (row.type === "Printing" && row.item=="Printing Ink" ) {
            row.printing_ink =(printing_ink/frm.doc.bag_weight);
        }
		if (row.type === "Printing" && row.item=="Thinner") {
            row.thinner = (thinner/frm.doc.bag_weight);
        }
		if (row.type === "Printing" && row.item != "Printing Ink" && row.item != "Thinner") {
            row.mfpp_yarn_1200_denier = (denier/frm.doc.bag_weight);
        }

    });

    frm.refresh_field("tape_item_details");
}
function set_liner_qty(frm) {
    let ldpe = 0;
	let lldpe=0;
	let hdpe=0;	
	let bio_grade=0;	
	let mb_w=0;	
	let antistatic=0;	
	let filler=0;	
	let anti_block=0;	
	let recycled_pe_mix=0;
	let recycled_pe_clear=0;		
	let tpt_filler=0;
	let uv_pe=0;
    (frm.doc.linermaterial_combination || []).forEach(row => {
        if (row.item_name === "LDPE") {
            ldpe = row.qty || 0; 
        }
		if (row.item_name === "LLDPE") {
            lldpe = row.qty || 0; 
        }
		if (row.item_name === "HDPE") {
            hdpe = row.qty || 0; 
        }
		if (row.item_name === "Biodegradable") {
            bio_grade = row.qty || 0; 
        }
		if (row.item_name === "MB-W") {
            mb_w = row.qty || 0; 
        }
		if (row.item_name === "Antistatic MB") {
            antistatic = row.qty || 0; 
        }
		if (row.item_name === "Filler Masterbatch PE") {
            filler = row.qty || 0; 
        }
		if (row.item_name === "Antiblock") {
            anti_block = row.qty || 0; 
        }
		if (row.item_name === "Recycled PE Mix") {
            recycled_pe_mix = row.qty || 0; 
        }
		if (row.item_name === "Recycled PE Clear") {
            recycled_pe_clear = row.qty || 0; 
        }
		if (row.item_name === "TPT Filler - PE") {
            tpt_filler = row.qty || 0; 
        }
		if (row.item_name === "UV - PE") {
            uv_pe = row.qty || 0; 
        }
    });
	
    (frm.doc.tape_item_details || []).forEach(row => {
		if (row.type === "Liner") {
            row.ldpe =(ldpe*(row.qty/frm.doc.bag_weight));
			row.lldpe =(lldpe*(row.qty/frm.doc.bag_weight));
			row.hdpe = (hdpe*(row.qty/frm.doc.bag_weight));
			row.biodegradable = (bio_grade*(row.qty/frm.doc.bag_weight));
			row.liner_mb_w = (mb_w*(row.qty/frm.doc.bag_weight));
			row.liner_antistatic_mb = (antistatic*(row.qty/frm.doc.bag_weight));
			row.liner_filler_masterbatch_pe = (filler*(row.qty/frm.doc.bag_weight));
			row.antiblock = (anti_block*(row.qty/frm.doc.bag_weight));
			row.liner_recycled_pe_mix = (recycled_pe_mix*(row.qty/frm.doc.bag_weight));
			row.liner_recycled_pe_clear = (recycled_pe_clear*(row.qty/frm.doc.bag_weight));
			row.liner_tpt_filler__pe = (tpt_filler*(row.qty/frm.doc.bag_weight));
			row.liner_uv_pe = (uv_pe*(row.qty/frm.doc.bag_weight));
        }
    });

    frm.refresh_field("tape_item_details");
}