// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Technical Costing', {
	validate(frm) {
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

		// Main section calculation

		frm.set_value('thread_and_others',frm.doc.top_thread+frm.doc.bottom_thread)
		frm.set_value('extra',0.5)
		frm.set_value('production_size_cut_leng_x',frm.doc.width+frm.doc.extra)
		frm.set_value('production_size_cut_leng_y',frm.doc.length+frm.doc.top_length+frm.doc.bottom_length+1)
		frm.set_value('lamination_wt_per_pcs_gms',(frm.doc.coating_gsm*(frm.doc.production_size_cut_leng_x*2)*frm.doc.production_size_cut_leng_y)/10000)
		


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

		// Loom Section

		var loom_fabric_width = frm.doc.production_size_cut_leng_x
		frm.set_value('loom_fabric_width',loom_fabric_width)
		 
		var loom_mesh = frm.doc.warp * frm.doc.weft
		frm.set_value('loom_mesh',loom_mesh)

		var loom_fabric_weight_pcs = frm.doc.fabric_gms
		frm.set_value('loom_fabric_weight_pcs',loom_fabric_weight_pcs)

		var loom_gsm = (frm.doc.loom_fabric_weight_pcs / frm.doc.loom_fabric_width / frm.doc.production_size_cut_leng_y / 2)*10000
		frm.set_value('loom_gsm',loom_gsm)

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
		var loom_linear_meter_wt = (frm.doc.loom_fabric_width *2) * frm.doc.loom_gsm / 100
		frm.set_value('loom_linear_meter_wt',loom_linear_meter_wt)

		var loom_order_requirement = Math.ceil(((frm.doc.production_size_cut_leng_y * frm.doc.qty)/100) * (1+ frm.doc.loom_wastage_provision_finishing/100))
		frm.set_value('loom_order_requirement',loom_order_requirement)

		frm.set_value('loom_efficiency',85)

		var loom_machine_hours = frm.doc.loom_order_requirement / (frm.doc.loom_picks_per_min * 1.524 / ((frm.doc.warp + frm.doc.weft)/2)*(frm.doc.loom_efficiency/100))
		frm.set_value('loom_machine_hours',Math.round(loom_machine_hours * 100) / 100)


		// weft calculation

		var weft_tape_width = 25.4/frm.doc.weft
		frm.set_value('weft_tape_width',weft_tape_width)
		
		var weft_denier = ((frm.doc.loom_gsm *9000)/(frm.doc.weft*2)/39.37)
		frm.set_value('weft_denier',weft_denier)
		
		frm.set_value('weft_wastage_provision_loom',1.5)

		var weft_order_requirement = ((frm.doc.fabric_gms*frm.doc.qty)/1000/2) * (1 + frm.doc.weft_wastage_provision_loom/100)
		frm.set_value('weft_order_requirement',weft_order_requirement)

		frm.set_value('weft_tape_wastage',1)
		var weft_machine_hours = (frm.doc.weft_order_requirement *(1+frm.doc.weft_tape_wastage/100))/frm.doc.weft_output_kghour
		frm.set_value('weft_machine_hours',weft_machine_hours)


		// Strip Calculation

		var strip_tape_width = 25.4/frm.doc.weft
		frm.set_value('strip_tape_width',strip_tape_width)
		
		var strip_denier = ((frm.doc.loom_gsm *9000)/(frm.doc.warp*2)/39.37)
		frm.set_value('strip_denier',strip_denier)
		
		frm.set_value('strip_wastage_provision_loom',1.5)

		var strip_order_requirement = (((((frm.doc.strip_denier/9000)*frm.doc.strip_width)/frm.doc.strip_tape_width)/1000) * frm.doc.loom_order_requirement) * (1 + frm.doc.strip_wastage_provision_loom/100)
		frm.set_value('strip_order_requirement',strip_order_requirement)

		frm.set_value('strip_tape_wastage',1)
		var strip_machine_hours = (frm.doc.strip_order_requirement *(1+frm.doc.strip_tape_wastage/100))/frm.doc.strip_output_kghour
		frm.set_value('strip_machine_hours',strip_machine_hours)

		// warp calculation

		var warp_tape_width = 25.4/frm.doc.warp
		frm.set_value('warp_tape_width',warp_tape_width)
		
		var warp_denier = ((frm.doc.loom_gsm *9000)/(frm.doc.warp*2)/39.37)
		frm.set_value('warp_denier',warp_denier)
		
		frm.set_value('warp_wastage_provision_loom',1.5)

		var warp_order_requirement = ((frm.doc.fabric_gms*frm.doc.qty)/1000/2) * (1 + frm.doc.warp_wastage_provision_loom/100) - frm.doc.strip_order_requirement
		frm.set_value('warp_order_requirement',warp_order_requirement)

		frm.set_value('warp_tape_wastage',1)

		var warp_machine_hours = (frm.doc.warp_order_requirement *(1+frm.doc.warp_tape_wastage/100))/frm.doc.warp_output_kghour
		frm.set_value('warp_machine_hours',warp_machine_hours)


		// Printing Calculation

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
		

		//stitching calculation

		frm.set_value('stitching_order_requirement',frm.doc.qty)
		frm.set_value('stitching_manhour',frm.doc.stitching_order_requirement / frm.doc.stitching_bags_manhour)
		
		// Cutting Calculation

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




		// Lamination Calculation

		frm.set_value('pre_coat_gsm',frm.doc.loom_gsm)
		frm.set_value('lamination_coating_gsm',frm.doc.coating_gsm)
		frm.set_value('post_coating_gsm',frm.doc.pre_coat_gsm +frm.doc.lamination_coating_gsm)

		frm.set_value('pre_coat_weight',frm.doc.loom_fabric_weight_pcs)
		frm.set_value('coating_weight',frm.doc.lamination_wt_per_pcs_gms)
		frm.set_value('post_coating_weight',frm.doc.pre_coat_weight +frm.doc.coating_weight)

		
		frm.set_value('pre_coat_linear',frm.doc.loom_linear_meter_wt)
		frm.set_value('coating_linear',frm.doc.pre_coat_width *2*frm.doc.lamination_coating_gsm/100)
		frm.set_value('post_coating_linear',frm.doc.pre_coat_linear +frm.doc.coating_linear)

		frm.set_value('pre_coat_width',frm.doc.production_size_cut_leng_x)
		frm.set_value('post_coating_width',frm.doc.coating_width +frm.doc.production_size_cut_leng_x)

		frm.set_value('lamination_coating_side',frm.doc.coating_side)
		frm.set_value('pre_coat_lamination_order_requirement',frm.doc.loom_order_requirement)
		frm.set_value('coating_order_requirement_mtr',frm.doc.pre_coat_lamination_order_requirement)
		frm.set_value('post_coating_order_requirement_mtr',frm.doc.coating_order_requirement_mtr)

		var lamination_machine_hours = frm.doc.pre_coat_lamination_order_requirement/(frm.doc.lamination_machine_speed * 60 * frm.doc.lamination_efficiency/100)
		frm.set_value('lam_machine_hours',lamination_machine_hours)

		// Liner Calculation
		
		frm.set_value('bag_size_width',frm.doc.width)
		frm.set_value('liner_size_width',frm.doc.bag_size_width + frm.doc.extra_width)
		frm.set_value('liner_size_cut_length',frm.doc.bag_size_cut_length + frm.doc.extra_cut_length)
		frm.set_value('bag_size_cut_length',frm.doc.length)
		frm.set_value('post_coating_gsm',frm.doc.pre_coat_gsm +frm.doc.lamination_coating_gsm)

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
		



	},


});
