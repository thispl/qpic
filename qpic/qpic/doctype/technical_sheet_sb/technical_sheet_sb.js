// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Technical Sheet SB', {
	onload(frm){
		
	},
	refresh : function(frm){
		frm.add_custom_button(("Commercial Costing"), ()=> {
			frm.call("on_submit")
		})
		frm.trigger('toggle_display_by_item_group')
		frm.trigger('set_css')
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
	set_css(frm){

		$('input[data-fieldname="extra"]').css("background-color","#f5ece4")
		$('input[data-fieldname="top_length"]').css("background-color","#f5ece4")
		$('input[data-fieldname="bottom_length"]').css("background-color","#f5ece4")
		$('input[data-fieldname="one"]').css("background-color","#f5ece4")
		$('input[data-fieldname="thread_and_others"]').css("background-color","#f5ece4")
		$('input[data-fieldname="loom_wastage_provision_finishing"]').css("background-color","#f5ece4")
		$('input[data-fieldname="loom_efficiency"]').css("background-color","#f5ece4")
		$('input[data-fieldname="weft_wastage_provision_loom"]').css("background-color","#f5ece4")
		$('input[data-fieldname="weft_tape_wastage"]').css("background-color","#f5ece4")
		$('input[data-fieldname="warp_wastage_provision_loom"]').css("background-color","#f5ece4")
		$('input[data-fieldname="warp_tape_wastage"]').css("background-color","#f5ece4")
		$('input[data-fieldname="strip_wastage_provision_loom"]').css("background-color","#f5ece4")
		$('input[data-fieldname="strip1_tape_wastage"]').css("background-color","#f5ece4")
		$('input[data-fieldname="strip2_wastage_provision_loom"]').css("background-color","#f5ece4")
		$('input[data-fieldname="strip2_tape_wastage"]').css("background-color","#f5ece4")
		$('input[data-fieldname="lamination_efficiency"]').css("background-color","#f5ece4")
		$('input[data-fieldname="lam_material_wastage"]').css("background-color","#f5ece4")
		$('input[data-fieldname="extra_width"]').css("background-color","#f5ece4")
		$('input[data-fieldname="extra_cut_length"]').css("background-color","#f5ece4")
		$('input[data-fieldname="liner_wastage_provision"]').css("background-color","#f5ece4")
		$('input[data-fieldname="liner_blown_film_wastage_"]').css("background-color","#f5ece4")
		$('input[data-fieldname="efficiency_liner"]').css("background-color","#f5ece4")
		$('input[data-fieldname="printing_efficiency"]').css("background-color","#f5ece4")
		$('input[data-fieldname="cutting_thread_wtbag_gm"]').css("background-color","#f5ece4")
		$('input[data-fieldname="cutting_efficiency"]').css("background-color","#f5ece4")
		
		const blue_fields = [
			"technical_costing_item", "warp", "weft", "width", "length", "unit_weight",
			"coating_gsm", "liner_weight_gms", "loom_picks_per_min", "weft_output_kghour",
			"warp_output_kghour", "strip_output_kghour", "strip1_width", "strip1_color",
			"strip2_output_kghour", "strip2_width", "strip2_color", "coating_width",
			"lamination_machine_speed", "liner_color", "liner_output_kghour", "liner_top",
			"output_bagsmin_liner", "printing_output_mtrmin",
			"cutting_machine_speed_bagsmin", "stitching_bags_manhour",
			"bailing_units__bale_or_roll", "bailing_no_of_bales__rolls",
			"bailing_required_manhours", "bailing_bale_cover",
			"bailing_extra_packing_requirement", "mt___container", "actual_loom", "actual_loom_ppm",
			"top", "bottom",
		];
		// const light_green_fields = [
		// 	"fabric_width", "fabric_strength", "fabric_total_gsm",
		// 	"fabric_gsm", "weft_addn_gsm", "cut_length", "fabric_ppm",
		// 	"wtmtr", "lamination_wt_per_pcs_gms", "external_width", "external_length"
		// ]
		// const skin_fields = [
		// 	"coating_side", "fabric_color", "fabric_type", "fabric_type_size",
		// 	"fabric_loom", "fabric_speed", "coating_gsm", "pieces__container",
		// 	"internal_width", "internal_length"
		// ]

		blue_fields.forEach(f => {
			$(`input[data-fieldname="${f}"]`).css("background-color", "#d9e1f2");
		});
		// light_green_fields.forEach(f => {
		// 	$(`input[data-fieldname="${f}"]`).css("background-color", "#e2efda");
		// });
		// skin_fields.forEach(f => {
		// 	$(`input[data-fieldname="${f}"]`).css("background-color", "#fff2cc");
		// });
	},

	validate(frm) {
		if(frm.doc.weft_material_combination == 1){
			var dosage = 0
			if(frm.doc.weftmaterial_combination){
				$.each(frm.doc.weftmaterial_combination, function (i, d) {
					dosage += d.dosage
					frm.set_value("total_weft",dosage)
				})
				if(frm.doc.total_weft ==100){
					frappe.validated = true;
				}
				else{
					frappe.throw("Weft material combination dosage should be 100")
				}
			}
		}
		if(frm.doc.warp_material_combination == 1){
			if(frm.doc.warpmaterial_combination){
				var dosage = 0
				$.each(frm.doc.warpmaterial_combination, function (i, d) {
					dosage += d.dosage
					frm.set_value("total_warp",dosage)
				})
				if(frm.doc.total_warp ==100){
					frappe.validated = true;
				}
				else{
					frappe.throw("Warp material combination dosage should be 100")
				}
			}
		}
		if(frm.doc.strip1_material_combination == 1){
			if(frm.doc.stripmaterial_combination){
				var dosage = 0
				$.each(frm.doc.stripmaterial_combination, function (i, d) {
					dosage += d.dosage
					frm.set_value("total_strip",dosage)
				})
				if(frm.doc.total_strip ==100){
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
					frm.set_value("total_lam",dosage)
				})
				if(frm.doc.total_lam ==100){
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
					frm.set_value("total_liner",dosage)
				})
				if(frm.doc.total_liner ==100){
					frappe.validated = true;
				}
				else{
					frappe.throw("Liner material combination dosage should be 100")
				}
			}
		}
	},
	top(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		if(frm.doc.top){
    	    if(frm.doc.top == "Heat Cut") {
    			frappe.db.get_single_value('Technical Costing Master', 'heat_cut_wastage')
    				.then(r => {
    					frm.set_value('loom_wastage_provision_finishing', r)
    			})
    	    }
    	    else if(frm.doc.top == "Hemmed (US)") {
    			frappe.db.get_single_value('Technical Costing Master', 'hemmed_us_wastage')
    				.then(r => {
    					frm.set_value('loom_wastage_provision_finishing', r)
    			})
    	    }
    	    else if(frm.doc.top == "Hemmed (Thread)") {
    			frappe.db.get_single_value('Technical Costing Master', 'hemmed_thread_wastage')
    				.then(r => {
    					frm.set_value('loom_wastage_provision_finishing', r)
    			})
    	    }
    	    else if(frm.doc.top == "Roll to Roll") {
    			frappe.db.get_single_value('Technical Costing Master', 'roll_to_roll_wastage')
    				.then(r => {
    					frm.set_value('loom_wastage_provision_finishing', r)
    			})
    	    }
    	}
		if(frm.doc.top){
    	    if(frm.doc.top == "Heat Cut") {
    			frappe.db.get_single_value('Technical Costing Master', 'heat_cut_extra')
    				.then(r => {
    					frm.set_value('top_length', r)
    			})
    	    }
    	    else if(frm.doc.top == "Hemmed (US)") {
    			frappe.db.get_single_value('Technical Costing Master', 'hemmed_us_extra')
    				.then(r => {
    					frm.set_value('top_length', r)
    			})
    	    }
    	    else if(frm.doc.top == "Hemmed (Thread)") {
    			frappe.db.get_single_value('Technical Costing Master', 'hemmed_thread_extra')
    				.then(r => {
    					frm.set_value('top_length', r)
    			})
    	    }
    	    else if(frm.doc.top == "Roll to Roll") {
    			frappe.db.get_single_value('Technical Costing Master', 'roll_to_roll_extra')
    				.then(r => {
    					frm.set_value('top_length', r)
    			})
    	    }
    	}
    	if(frm.doc.top){
    	    if(frm.doc.top == "Heat Cut") {
    			frappe.db.get_single_value('Technical Costing Master', 'heat_cut_thread')
    				.then(r => {
    					frm.set_value('top_thread', r)
    			})
    	    }
    	    else if(frm.doc.top == "Hemmed (US)") {
    			frappe.db.get_single_value('Technical Costing Master', 'hemmed_us_thread')
    				.then(r => {
    					frm.set_value('top_thread', r)
    			})
    	    }
    	    else if(frm.doc.top == "Hemmed (Thread)") {
    			frappe.db.get_single_value('Technical Costing Master', 'hemmed_thread_thread')
    				.then(r => {
    					frm.set_value('top_thread', r)
    			})
    	    }
    	    else if(frm.doc.top == "Roll to Roll") {
    			frappe.db.get_single_value('Technical Costing Master', 'roll_to_roll_thread')
    				.then(r => {
    					frm.set_value('top_thread', r)
    			})
    	    }
    	}
	},
	bottom(frm){
		frm.trigger('calculation')
		frm.trigger('calculation1')
		frm.trigger('calculation2')
		if(frm.doc.bottom){
    	    if(frm.doc.bottom == "SFSS") {
    			frappe.db.get_single_value('Technical Costing Master', 'sfss_extra')
    				.then(r => {
    					frm.set_value('bottom_length', r)
    			})
    	    }
    	    else if(frm.doc.bottom == "SFDS") {
    			frappe.db.get_single_value('Technical Costing Master', 'sfds_extra')
    				.then(r => {
    					frm.set_value('bottom_length', r)
    			})
    	    }
    	    else if(frm.doc.bottom == "DFSS") {
    			frappe.db.get_single_value('Technical Costing Master', 'dfss_extra')
    				.then(r => {
    					frm.set_value('bottom_length', r)
    			})
    	    }
    	    else if(frm.doc.bottom == "DFDS") {
    			frappe.db.get_single_value('Technical Costing Master', 'dfds_extra')
    				.then(r => {
    					frm.set_value('bottom_length', r)
    			})
    	    }
    	    else if(frm.doc.bottom == "Roll to Roll") {
    			frappe.db.get_single_value('Technical Costing Master', 'bottom_roll_to_roll_extra')
    				.then(r => {
    					frm.set_value('bottom_length', r)
    			})
    	    }
    	}    	   	
    	if(frm.doc.bottom){
    	    if(frm.doc.bottom == "SFSS") {
    			frappe.db.get_single_value('Technical Costing Master', 'sfss_thread')
    				.then(r => {
    					frm.set_value('bottom_thread', r)
    			})
    	    }
    	    else if(frm.doc.bottom == "SFDS") {
    			frappe.db.get_single_value('Technical Costing Master', 'sfds_thread')
    				.then(r => {
    					frm.set_value('bottom_thread', r)
    			})
    	    }
    	    else if(frm.doc.bottom == "DFSS") {
    			frappe.db.get_single_value('Technical Costing Master', 'dfss_thread')
    				.then(r => {
    					frm.set_value('bottom_thread', r)
    			})
    	    }
    	    else if(frm.doc.bottom == "DFDS") {
    			frappe.db.get_single_value('Technical Costing Master', 'dfds_thread')
    				.then(r => {
    					frm.set_value('bottom_thread', r)
    			})
    	    }
    	    else if(frm.doc.bottom == "Roll to Roll") {
    			frappe.db.get_single_value('Technical Costing Master', 'bottom_roll_to_roll_thread')
    				.then(r => {
    					frm.set_value('bottom_thread', r)
    			})
    	    }
    	}
	},
	calculation(frm){
		frm.set_value('thread_and_others',frm.doc.top_thread+frm.doc.bottom_thread)
	},
	calculation1(frm){
		frm.set_value('production_size_cut_leng_x',frm.doc.width+frm.doc.extra)
	},
	calculation2(frm){
		frm.set_value('production_size_cut_leng_y',frm.doc.length+frm.doc.top_length+frm.doc.bottom_length+frm.doc.one)
	},
	one(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	warp(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	weft(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	top_length(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	bottom_length(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	
	length(frm){
		frm.trigger('liner_quantity_calculation');
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	unit_weight(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	extra(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	thread_and_others(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	top_thread(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	bottom_thread(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	lam_wt(frm){
		frm.set_value('lamination_wt_per_pcs_gms',(frm.doc.coating_gsm*(frm.doc.production_size_cut_leng_x*2)*frm.doc.production_size_cut_leng_y)/10000)
	},
	liner_weight_gms(frm){
		frm.trigger('unit_weight_biforcation')
	},
	unit_weight_biforcation(frm){
		// Unit Weight Biforcation
		var fabric = frm.doc.unit_weight - frm.doc.liner_weight_gms - frm.doc.lamination_wt_per_pcs_gms - frm.doc.thread_and_others
		frm.set_value('fabric_gms',Math.round(fabric * 100) / 100)
		frm.set_value('lamination_gms',Math.round(frm.doc.lamination_wt_per_pcs_gms * 100) / 100)
		frm.set_value('liner_gms',frm.doc.liner_weight_gms)
		frm.set_value('other_gms',frm.doc.thread_and_others)
		var total = frm.doc.fabric_gms + frm.doc.other_gms + frm.doc.lamination_gms + frm.doc.liner_gms
		frm.set_value('total',total)
		var no_of_units = 1000000/frm.doc.total
		frm.set_value('no_of_units',no_of_units)	
	},


	loom_picks_per_min(frm){
		frm.trigger('weft_output_kghour')
		frm.trigger('warp_output_kghour')
		frm.trigger('strip_output_kghour')
		frm.trigger('strip2_output_kghour')
		frm.trigger('lamination_machine_speed')
		frm.trigger('printing_output_mtrmin')
		frm.trigger('stitching_bags_manhour')
		var loom_fabric_width = frm.doc.production_size_cut_leng_x
		frm.set_value('loom_fabric_width',loom_fabric_width)
		 
		var loom_mesh = frm.doc.warp * frm.doc.weft
		frm.set_value('loom_mesh',loom_mesh)

		var loom_fabric_weight_pcs = frm.doc.fabric_gms
		frm.set_value('loom_fabric_weight_pcs',loom_fabric_weight_pcs)

		var loom_gsm = (frm.doc.loom_fabric_weight_pcs / frm.doc.loom_fabric_width / frm.doc.production_size_cut_leng_y / 2)*10000
		frm.set_value('loom_gsm',loom_gsm)

		var loom_linear_meter_wt = (frm.doc.loom_fabric_width *2) * frm.doc.loom_gsm / 100
		frm.set_value('loom_linear_meter_wt',loom_linear_meter_wt)

		var loom_order_requirement = Math.ceil(((frm.doc.production_size_cut_leng_y * frm.doc.qty)/100) * (1+ frm.doc.loom_wastage_provision_finishing/100))
		frm.set_value('loom_order_requirement',loom_order_requirement)
		var loom_machine_hours = frm.doc.loom_order_requirement / (frm.doc.loom_picks_per_min * 1.524 / ((frm.doc.warp + frm.doc.weft)/2)*(frm.doc.loom_efficiency/100))
		frm.set_value('loom_machine_hours',Math.round(loom_machine_hours * 100) / 100)
	},
	loom_efficiency(frm){
		frm.trigger('loom_picks_per_min')
	},
	loom_wastage_provision_finishing(frm){
		frm.trigger('loom_picks_per_min')
	},
	tape(frm){
		frm.trigger('weft_output_kghour')
		frm.trigger('warp_output_kghour')
		frm.trigger('strip_output_kghour')
		frm.trigger('strip2_output_kghour')
		frm.trigger('lamination_machine_speed')
		frm.trigger('printing_output_mtrmin')
		frm.trigger('stitching_bags_manhour')
		frm.trigger('liner_output_kghour')
		frm.trigger('cutting_machine_speed_bagsmin')
		
		
	},
	weft_output_kghour(frm){
		var weft_tape_width = 25.4/frm.doc.weft
		frm.set_value('weft_tape_width',weft_tape_width)		
		var weft_denier = ((frm.doc.loom_gsm *9000)/(frm.doc.weft*2)/39.37)
		frm.set_value('weft_denier',weft_denier)
		var weft_order_requirement = ((frm.doc.fabric_gms*frm.doc.qty)/1000/2) * (1 + frm.doc.weft_wastage_provision_loom/100)
		frm.set_value('weft_order_requirement',weft_order_requirement)
		var weft_machine_hours = (frm.doc.weft_order_requirement *(1+frm.doc.weft_tape_wastage/100))/frm.doc.weft_output_kghour
		frm.set_value('weft_machine_hours',weft_machine_hours)
	},
	weft_tape_wastage(frm){
		frm.trigger('weft_output_kghour')
	},
	weft_wastage_provision_loom(frm){
		frm.trigger('weft_output_kghour')
	},

	strip_output_kghour(frm){
		var strip1_tape_width = 25.4/frm.doc.weft
		frm.set_value('strip1_tape_width',strip1_tape_width)		
		var strip1_denier = ((frm.doc.loom_gsm *9000)/(frm.doc.warp*2)/39.37)
		frm.set_value('strip1_denier',strip1_denier)	
		var strip_order_requirement = (((((frm.doc.strip1_denier/9000)*frm.doc.strip1_width)/frm.doc.strip1_tape_width)/1000) * frm.doc.loom_order_requirement) * (1 + frm.doc.strip_wastage_provision_loom/100)
		frm.set_value('strip_order_requirement',strip_order_requirement)
		var strip_machine_hours = (frm.doc.strip_order_requirement *(1+frm.doc.strip1_tape_wastage/100))/frm.doc.strip_output_kghour
		frm.set_value('strip_machine_hours',strip_machine_hours)
	},
	strip1_tape_wastage(frm){
		frm.trigger('strip_output_kghour')
	},
	strip_wastage_provision_loom(frm){
		frm.trigger('strip_output_kghour')
	},


	strip2_output_kghour(frm){
		var strip2_tape_width = 25.4/frm.doc.weft
		frm.set_value('strip2_tape_width',strip2_tape_width)		
		var strip2_denier = ((frm.doc.loom_gsm *9000)/(frm.doc.warp*2)/39.37)
		frm.set_value('strip2_denier',strip2_denier)	
		var strip2_order_requirement = (((((frm.doc.strip2_denier/9000)*frm.doc.strip2_width)/frm.doc.strip2_tape_width)/1000) * frm.doc.loom_order_requirement) * (1 + frm.doc.strip2_wastage_provision_loom/100)
		frm.set_value('strip2_order_requirement',strip2_order_requirement)
		var strip2_machine_hours = (frm.doc.strip2_order_requirement *(1+frm.doc.strip2_tape_wastage/100))/frm.doc.strip2_output_kghour
		frm.set_value('strip2_machine_hours',strip2_machine_hours)
	},
	strip2_tape_wastage(frm){
		frm.trigger('strip2_output_kghour')
	},
	strip2_wastage_provision_loom(frm){
		frm.trigger('strip2_output_kghour')
	},
	strip2_width(frm){
		frm.trigger('strip2_output_kghour')
	},

	warp_output_kghour(frm){
		var warp_tape_width = 25.4/frm.doc.warp
		frm.set_value('warp_tape_width',warp_tape_width)		
		var warp_denier = ((frm.doc.loom_gsm *9000)/(frm.doc.warp*2)/39.37)
		frm.set_value('warp_denier',warp_denier)		
		var warp_order_requirement = (((frm.doc.fabric_gms*frm.doc.qty)/1000/2) * (1 + frm.doc.warp_wastage_provision_loom/100)) - frm.doc.strip_order_requirement
		frm.set_value('warp_order_requirement',warp_order_requirement)
		var warp_machine_hours = (frm.doc.warp_order_requirement *(1+frm.doc.warp_tape_wastage/100))/frm.doc.warp_output_kghour
		frm.set_value('warp_machine_hours',warp_machine_hours)
	},
	warp_tape_wastage(frm){
		frm.trigger('warp_output_kghour')
	},
	warp_wastage_provision_loom(frm){
		frm.trigger('warp_output_kghour')
	},

	printing_output_mtrmin(frm){
		var printing_width = frm.doc.width
		frm.set_value('printing_width',printing_width)
		var printing_length = frm.doc.length
		frm.set_value('printing_length',printing_length)
		var printing_cut_length = frm.doc.production_size_cut_leng_y
		frm.set_value('printing_cut_length',printing_cut_length)
		var printing_order_requirement = frm.doc.loom_order_requirement
		frm.set_value('printing_order_requirement',printing_order_requirement)
		var printing_machine_hours = frm.doc.printing_order_requirement / (frm.doc.printing_output_mtrmin * 60 * frm.doc.printing_efficiency/100)
		frm.set_value('printing_machine_hours',printing_machine_hours)
	},
	printing_efficiency(frm){
		frm.trigger('printing_output_mtrmin')
	},

	stitching_bags_manhour(frm){
		frm.set_value('stitching_order_requirement',frm.doc.qty)
		frm.set_value('stitching_manhour',frm.doc.stitching_order_requirement / frm.doc.stitching_bags_manhour)
	},

	lamination_machine_speed(frm){
		frm.set_value('pre_coat_gsm',frm.doc.loom_gsm)
		frm.set_value('lamination_coating_gsm',frm.doc.coating_gsm)
		frm.set_value('post_coating_gsm',frm.doc.pre_coat_gsm +frm.doc.lamination_coating_gsm)
		frm.set_value('pre_coat_weight',frm.doc.loom_fabric_weight_pcs)
		frm.set_value('coating_weight',frm.doc.lamination_wt_per_pcs_gms)
		frm.set_value('post_coating_weight',frm.doc.pre_coat_weight +frm.doc.coating_weight)		
		frm.set_value('pre_coat_linear',frm.doc.loom_linear_meter_wt)
		var spe = frm.doc.pre_coat_width *2*frm.doc.lamination_coating_gsm/100
		frm.set_value('coating_linear',spe)
		frm.set_value('post_coating_linear',frm.doc.pre_coat_linear +frm.doc.coating_linear)
		frm.set_value('pre_coat_width',frm.doc.production_size_cut_leng_x)
		frm.set_value('post_coating_width',frm.doc.coating_width +frm.doc.production_size_cut_leng_x)
		frm.set_value('lamination_coating_side',frm.doc.coating_side)
		frm.set_value('pre_coat_lamination_order_requirement',frm.doc.loom_order_requirement)
		frm.set_value('coating_order_requirement_mtr',frm.doc.pre_coat_lamination_order_requirement)
		frm.set_value('post_coating_order_requirement_mtr',frm.doc.coating_order_requirement_mtr)
		var lamination_machine_hours = frm.doc.pre_coat_lamination_order_requirement/(frm.doc.lamination_machine_speed * 60 * frm.doc.lamination_efficiency/100)
		frm.set_value('lam_machine_hours',lamination_machine_hours)
	},
	lamination_efficiency(frm){
		frm.trigger('lamination_machine_speed')
	},
	lam_material_wastage(frm){
		frm.trigger('lamination_machine_speed')
	},

	liner_output_kghour(frm){
		frm.trigger('liner_bottom')
		frm.set_value('bag_size_width',frm.doc.width)
		frm.set_value('liner_size_width',frm.doc.bag_size_width + frm.doc.extra_width)
		frm.set_value('liner_size_cut_length',frm.doc.bag_size_cut_length + frm.doc.extra_cut_length)
		frm.set_value('bag_size_cut_length',frm.doc.length)
		frm.set_value('post_coating_gsm',frm.doc.pre_coat_gsm +frm.doc.lamination_coating_gsm)	
		frm.set_value('liner_weight_pcs',frm.doc.liner_weight_gms)
		var liner_order_requirement = (((frm.doc.liner_weight_pcs * frm.doc.qty)/1000) * (1+ frm.doc.liner_wastage_provision/100))
		frm.set_value('liner_order_requirement',liner_order_requirement)
		var liner_machine_hours = (frm.doc.liner_order_requirement * (1 + frm.doc.liner_blown_film_wastage_/100))/ frm.doc.liner_output_kghour
		frm.set_value('liner_machine_hours',liner_machine_hours)
		frm.set_value('cut_length_liner',frm.doc.liner_size_cut_length)
		frm.set_value('order_requirement_liner',frm.doc.qty)
		var machine_hours_liner = frm.doc.order_requirement_liner / (frm.doc.output_bagsmin_liner * 60 * frm.doc.efficiency_liner/100)
		frm.set_value('machine_hours_liner',machine_hours_liner)
		// frm.set_value('weftmaterial_combination',frm.doc.weftmaterial_combination)
		var liner_mcron = (frm.doc.liner_weight_pcs * 10000)/(2*frm.doc.liner_size_cut_length *frm.doc.liner_size_width*0.92)
		frm.set_value('liner_mcron',liner_mcron)
		var order_requirement_mtr = (frm.doc.qty * (frm.doc.liner_size_cut_length/100))*(1+frm.doc.liner_wastage_provision/100)
		frm.set_value('order_requirement_mtr',order_requirement_mtr)
	},
	liner_blown_film_wastage_(frm){
		frm.trigger('liner_output_kghour')
	},
	efficiency_liner(frm){
		frm.trigger('liner_output_kghour')
	},
	liner_wastage_provision(frm){
		frm.trigger('liner_output_kghour')
	},
	liner_bottom(frm){
		if(frm.doc.liner_bottom){
    	    if(frm.doc.liner_bottom == "Heat Sealed") {
    			frappe.db.get_single_value('Technical Costing Master', 'heat_sealed')
    				.then(r => {
    					frm.set_value('extra_cut_length', r)
    			})
    	    }
    	    else if(frm.doc.liner_bottom == "Roll to Roll") {
    			frappe.db.get_single_value('Technical Costing Master', 'roll_to_roll')
    				.then(r => {
    					frm.set_value('extra_cut_length', r)
    			})
    	    }
    	    else if(frm.doc.liner_bottom == "Open") {
    			frappe.db.get_single_value('Technical Costing Master', 'open')
    				.then(r => {
    					frm.set_value('extra_cut_length', r)
    			})
    	    }
    	}
	},
	output_bagsmin_liner(frm){
		frm.trigger('liner_output_kghour')
	},
	extra_width(frm){
		frm.trigger('liner_output_kghour')
	},
	extra_cut_length(frm){
		frm.trigger('liner_output_kghour')
	},

	cutting_machine_speed_bagsmin(frm){
		var cutting_width = frm.doc.width
		frm.set_value('cutting_width',cutting_width)
		var cutting_length = frm.doc.length
		frm.set_value('cutting_length',cutting_length)
		var cutting_cut_length = frm.doc.production_size_cut_leng_y
		frm.set_value('cutting_cut_length',cutting_cut_length)		
		var cutting_fabric_thread_wt = frm.doc.fabric_gms + frm.doc.other_gms + frm.doc.lamination_gms
		frm.set_value('cutting_fabric_thread_wt',cutting_fabric_thread_wt)
		frm.set_value('cutting_liner_weight_gm',frm.doc.liner_gms)
		frm.set_value('cutting_bag_weight_gm',frm.doc.cutting_liner_weight_gm + frm.doc.cutting_fabric_thread_wt)
		frm.set_value('cutting_top',frm.doc.top)
		frm.set_value('cutting_bottom',frm.doc.bottom)
		frm.set_value('cutting_thread_wtbag_gm',frm.doc.thread_and_others)
		frm.set_value('cutting_order_requirement',frm.doc.qty)
		var cutting_machine_hours = frm.doc.cutting_order_requirement/(frm.doc.cutting_machine_speed_bagsmin * 60 * frm.doc.cutting_efficiency/100)		
		frm.set_value('cutting_machine_hours',cutting_machine_hours)
	},
	cutting_efficiency(frm){
		frm.trigger('cutting_machine_speed_bagsmin')
	},
	cutting_thread_wtbag_gm(frm){
		frm.trigger('cutting_machine_speed_bagsmin')
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
	},
	tape_weft_mesh(frm) {
		frm.trigger('running_denier_section_calculation');
		frm.trigger('calculate_tape_width');
		frm.trigger('calculate_denier_calculation');
		frm.trigger('calculate_loom_mhr');
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
	},
	fabric_speed_percentage(frm) {
		if (flt(frm.doc.fabric_speed_percentage) > 100 ) {
			frappe.msgprint("Fabric Speed Percentage cannot be more than 100%");
			frm.set_value("fabric_speed_percentage", 0);
		}
		else {
			frm.trigger('calculate_ppm');
		}
	},
	fabric_loom(frm) {
		frm.trigger("calculate_ppm");
	},
	fabric_width(frm) {
		frm.trigger('calculate_wt_mtr')
	},
	fabric_type(frm) {
		frm.trigger('calculate_wt_mtr')
	},
	fabric_total_gsm(frm) {
		frm.trigger('calculate_wt_mtr')
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
	},
	weft_tape_width(frm) {
		frm.set_value('weft_tape_width_calc', calculation_for_widht_calc_field(frm.doc.weft_tape_width))
	},
	weft_addn_tape_width(frm) {
		frm.set_value('weft_addn_tape_width_calc', calculation_for_widht_calc_field(frm.doc.weft_addn_tape_width))
	},
	reen_tape_width(frm) {
		frm.set_value('reen_tape_width_calc', calculation_for_widht_calc_field(frm.doc.reen_tape_width))
	},

	warp_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.warp_denier);
		frm.set_value('warp_denier_calc', result.denier_calc);
		frm.set_value('warp_mmt', result.mmt);
	},
	weft_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.weft_denier);
		frm.set_value('weft_denier_calc', result.denier_calc);
		frm.set_value('weft_mmt', result.mmt);
	},
	weft_addn_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.weft_addn_denier);
		frm.set_value('weft_addn_denier_calc', result.denier_calc);
		frm.set_value('weft_addn_mmt', result.mmt);
	},
	reenf_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.reenf_denier);
		frm.set_value('reenf_denier_calc', result.denier_calc);
		frm.set_value('reenf_mmt', result.mmt);
	},
	strip1_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.strip1_denier);
		frm.set_value('strip1_denier_calc', result.denier_calc);
		frm.set_value('strip1_mmt', result.mmt);
	},
	strip2_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.strip2_denier);
		frm.set_value('strip2_denier_calc', result.denier_calc);
		frm.set_value('strip2_mmt', result.mmt);
	},
	strip3_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.strip3_denier);
		frm.set_value('strip3_denier_calc', result.denier_calc);
		frm.set_value('strip3_mmt', result.mmt);
	},
	strip4_denier(frm) {
		const result = calculation_for_denier_calc_and_mmt_fields(frm.doc.strip4_denier);
		frm.set_value('strip4_denier_calc', result.denier_calc);
		frm.set_value('strip4_mmt', result.mmt);
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
	},
	weft_addn_tape_width(frm) {
		let tape_weft_addn_mesh = 0;
		if (weft_addn_tape_width > 0) {
			tape_weft_addn_mesh = (frm.doc.weft_addn_gsm / (frm.doc.weft_addn_denier / 9000)) / (100 / 2.54);
		}
		frm.set_value('tape_weft_addn_mesh', tape_weft_addn_mesh)
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
	},
	// Loom tab
	loom_material_combination(frm) {
		get_raw_materials_and_others_loom(frm, 'loom_material_combination', 'loommaterial_combination', 'loom_others', 'loom_hrsmt', 'Loom');
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

	tape_weft_mesh(frm) {
		frm.trigger('calculate_loom_mhr');
	},


	// Calculations
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
				method: "qpic.qpic.doctype.technical_sheet_sb.technical_sheet_sb.get_ppm",
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
        row.amount = flt(row.qty) * flt(row.rate);
		frm.refresh_fields(["warpmaterial_combination", "weftmaterial_combination"]);
    }
});

frappe.ui.form.on('Technical Sheet Others', {
	// Fields
    rate(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },
    qty(frm, cdt, cdn) {
        frm.trigger('calculate_amount', cdt, cdn);
    },
});


frappe.ui.form.on('Liner Material Combination', {
	// Fields
	dosage(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const wastage = flt(frm.doc.liner_production_wastage);
        const dosage = flt(row.dosage);

        row.qty = (dosage / 100) * (1 + (wastage / 100));
        frm.trigger('calculate_amount', cdt, cdn);
		frm.refresh_field("linermaterial_combination");
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
		frm.refresh_field("linermaterial_combination");
    },
	
});

frappe.ui.form.on('Lamination Material Combination', {
	// Fields
	dosage(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const wastage = flt(frm.doc.lamination_production_wastage);
        const dosage = flt(row.dosage);
		if (frm.doc.coating_side && frm.doc.coating_side != "No") {
			row.qty = (dosage / 100) * (1 + (wastage / 100)) * frm.doc.lamination_wt_ratio;
			frm.trigger('calculate_amount', cdt, cdn);
			frm.refresh_field("laminationmaterial_combination");
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
    calculate_amount(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const amount = flt(row.qty) * flt(row.rate);
		frappe.model.set_value(cdt, cdn, "amount", amount)
		frm.refresh_field("laminationmaterial_combination");
    },
	
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
    calculate_amount(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const amount = flt(row.qty) * flt(row.rate);
		frappe.model.set_value(cdt, cdn, "amount", amount)
		frm.refresh_field("loommaterial_combination");
    },
	
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
		frm.refresh_field("linermaterial_combination");
    },
	
});


frappe.ui.form.on('Warp Material Combination', {
	dosage: function(frm,cdt,cdn){
		var warp_mat_comb = frm.doc.warp_order_requirement * (1 + (frm.doc.warp_tape_wastage/100))
		var row = locals[cdt][cdn]
		var qty = ((row.dosage/100)*warp_mat_comb)
		row.qty = qty
		frm.refresh_field("warpmaterial_combination")
	}
})
frappe.ui.form.on('Strip Material Combination', {
	dosage: function(frm,cdt,cdn){
		var strip_mat_comb = frm.doc.strip_order_requirement * (1 + (frm.doc.strip1_tape_wastage/100))
		var row = locals[cdt][cdn]
		var qty = ((row.dosage/100)*strip_mat_comb)
		row.qty = qty
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
            method: "qpic.qpic.doctype.technical_sheet_sb.technical_sheet_sb.get_tape_capacity_width",
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
				method: "qpic.qpic.doctype.technical_sheet_sb.technical_sheet_sb.get_raw_materials",
				args: {
					fg_item: frm.doc.technical_costing_item?.[0].item_code,
					operation: operation,
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
				method: "qpic.qpic.doctype.technical_sheet_sb.technical_sheet_sb.get_overheads_and_others",
				args: {
					operation: operation,
					hrsmt: frm.doc[hrsmt],
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
				method: "qpic.qpic.doctype.technical_sheet_sb.technical_sheet_sb.get_raw_materials",
				args: {
					fg_item: frm.doc.technical_costing_item?.[0].item_code,
					operation: operation,
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
				method: "qpic.qpic.doctype.technical_sheet_sb.technical_sheet_sb.get_overheads_and_others",
				args: {
					operation: operation,
					hrsmt: frm.doc[hrsmt],
					lamination_side: frm.doc.coating_side,
					lamination_width: frm.doc.lamination_width,
					fabric_type: frm.doc.fabric_type_size,
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
				method: "qpic.qpic.doctype.technical_sheet_sb.technical_sheet_sb.get_raw_materials",
				args: {
					fg_item: frm.doc.technical_costing_item?.[0].item_code,
					operation: operation,
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
				method: "qpic.qpic.doctype.technical_sheet_sb.technical_sheet_sb.get_overheads_and_others",
				args: {
					operation: operation,
					hrsmt: frm.doc[hrsmt],
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

