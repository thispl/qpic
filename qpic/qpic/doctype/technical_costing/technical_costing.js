// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt
frappe.ui.form.on('Technical Costing', {
	onload(frm){
		console.log(frm.doc.delivery_term)
	},
	refresh : function(frm){ 
		frm.trigger('set_css')
	},
	set_css(frm){
		$('input[data-fieldname="technical_costing_item"]').css("background-color","#deeefa")
		$('input[data-fieldname="warp"]').css("background-color","#deeefa")
		$('input[data-fieldname="weft"]').css("background-color","#deeefa")
		$('input[data-fieldname="width"]').css("background-color","#deeefa")
		$('input[data-fieldname="length"]').css("background-color","#deeefa")
		$('input[data-fieldname="unit_weight"]').css("background-color","#deeefa")
		$('input[data-fieldname="coating_gsm"]').css("background-color","#deeefa")
		$('input[data-fieldname="liner_weight_gms"]').css("background-color","#deeefa")
		$('input[data-fieldname="loom_picks_per_min"]').css("background-color","#deeefa")
		$('input[data-fieldname="weft_output_kghour"]').css("background-color","#deeefa")
		$('input[data-fieldname="warp_output_kghour"]').css("background-color","#deeefa")
		$('input[data-fieldname="strip_output_kghour"]').css("background-color","#deeefa")
		$('input[data-fieldname="strip_width"]').css("background-color","#deeefa")
		$('input[data-fieldname="strip_colour"]').css("background-color","#deeefa")
		$('input[data-fieldname="coating_width"]').css("background-color","#deeefa")
		$('input[data-fieldname="lamination_machine_speed"]').css("background-color","#deeefa")
		$('input[data-fieldname="liner_color"]').css("background-color","#deeefa")
		$('input[data-fieldname="liner_output_kghour"]').css("background-color","#deeefa")
		$('input[data-fieldname="liner_top"]').css("background-color","#deeefa")
		$('input[data-fieldname="output_bagsmin_liner"]').css("background-color","#deeefa")
		$('input[data-fieldname="printing_output_mtrmin"]').css("background-color","#deeefa")
		$('input[data-fieldname="cutting_machine_speed_bagsmin"]').css("background-color","#deeefa")
		$('input[data-fieldname="stitching_bags_manhour"]').css("background-color","#deeefa")
		$('input[data-fieldname="bailing_units__bale_or_roll"]').css("background-color","#deeefa")
		$('input[data-fieldname="bailing_no_of_bales__rolls"]').css("background-color","#deeefa")
		$('input[data-fieldname="bailing_required_manhours"]').css("background-color","#deeefa")
		$('input[data-fieldname="bailing_bale_cover"]').css("background-color","#deeefa")
		$('input[data-fieldname="bailing_extra_packing_requirement"]').css("background-color","#deeefa")/



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
		$('input[data-fieldname="strip_tape_wastage"]').css("background-color","#f5ece4")
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
	},

	validate(frm) {
		if(frm.doc.weft_material_combination == 1){
			var dosage = 0
			if(frm.doc.weftmaterial_combination){
				$.each(frm.doc.weftmaterial_combination, function (i, d) {
					dosage += d.dosage
					console.log(dosage)
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
					console.log(dosage)
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
		if(frm.doc.strip_material_combination == 1){
			if(frm.doc.stripmaterial_combination){
				var dosage = 0
				$.each(frm.doc.stripmaterial_combination, function (i, d) {
					dosage += d.dosage
					console.log(dosage)
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
					console.log(dosage)
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
					console.log(dosage)
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
	width(frm){
		frm.trigger('calculation')
		frm.trigger('calculation2')
		frm.trigger('calculation1')
		frm.trigger('unit_weight_biforcation')
	},
	length(frm){
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
	coating_gsm(frm){
		frm.trigger('lam_wt')
		frm.trigger('unit_weight_biforcation')
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
		var strip_tape_width = 25.4/frm.doc.weft
		frm.set_value('strip_tape_width',strip_tape_width)		
		var strip_denier = ((frm.doc.loom_gsm *9000)/(frm.doc.warp*2)/39.37)
		frm.set_value('strip_denier',strip_denier)	
		var strip_order_requirement = (((((frm.doc.strip_denier/9000)*frm.doc.strip_width)/frm.doc.strip_tape_width)/1000) * frm.doc.loom_order_requirement) * (1 + frm.doc.strip_wastage_provision_loom/100)
		frm.set_value('strip_order_requirement',strip_order_requirement)
		var strip_machine_hours = (frm.doc.strip_order_requirement *(1+frm.doc.strip_tape_wastage/100))/frm.doc.strip_output_kghour
		frm.set_value('strip_machine_hours',strip_machine_hours)
	},
	strip_tape_wastage(frm){
		frm.trigger('strip_output_kghour')
	},
	strip_wastage_provision_loom(frm){
		frm.trigger('strip_output_kghour')
	},
	strip_width(frm){
		frm.trigger('strip_output_kghour')
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
	


});




frappe.ui.form.on('Lamination Material Combination', {
	dosage: function(frm,cdt,cdn){
		var lam_mat_comb = ((frm.doc.coating_linear * frm.doc.pre_coat_lamination_order_requirement)/1000) * (1+frm.doc.lam_material_wastage/100)
		console.log(lam_mat_comb)
		var row = locals[cdt][cdn]
		var qty = ((row.dosage/100) * lam_mat_comb)
		console.log(qty)
		row.qty = qty
		frm.refresh_field("laminationmaterial_combination")
	},
})
frappe.ui.form.on('Weft Material Combination', {
	dosage: function(frm,cdt,cdn){
		var weft_mat_comb = frm.doc.weft_order_requirement * (1 + (frm.doc.weft_tape_wastage/100))
		var row = locals[cdt][cdn]
		var qty = ((row.dosage/100)*weft_mat_comb)
		row.qty = qty
		frm.refresh_field("weftmaterial_combination")
	},
})
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
		var strip_mat_comb = frm.doc.strip_order_requirement * (1 + (frm.doc.strip_tape_wastage/100))
		var row = locals[cdt][cdn]
		var qty = ((row.dosage/100)*strip_mat_comb)
		row.qty = qty
		frm.refresh_field("stripmaterial_combination")
	}
})
frappe.ui.form.on('Liner Material Combination', {
	dosage: function(frm,cdt,cdn){
		var liner_mat_comb = frm.doc.liner_order_requirement * (1 + (frm.doc.liner_blown_film_wastage_/100))
		// console.log(liner_mat_comb)
		var row = locals[cdt][cdn]
		var qty = ((row.dosage/100)*liner_mat_comb)
		row.qty = qty
		frm.refresh_field("linermaterial_combination")
	}
})
