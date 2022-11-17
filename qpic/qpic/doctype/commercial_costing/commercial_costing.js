// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Commercial Costing', {
	loom_manhrmachhr(frm){
		var loom = frm.doc.loom_manhrmachhr * frm.doc.loom_machine_hours
		frm.set_value('loom_total_man_hrs',loom)
	},
	loom_manhr_rate(frm){
		var loom = frm.doc.loom_total_man_hrs * frm.doc.loom_manhr_rate
		frm.set_value('loom_cost',loom)
	},
	tape_manhrmachhr(frm){
		var tape = frm.doc.tape_manhrmachhr * frm.doc.tape_machine_hours
		frm.set_value('tape_total_man_hrs',tape)
		frm.set_value('tapemachine_hours',frm.doc.tape_machine_hours)
	},
	tape_manhr_rate(frm){
		var tape = frm.doc.tape_total_man_hrs * frm.doc.tape_manhr_rate
		frm.set_value('tape_cost',tape)
	},
	lamination_manhrmachhr(frm){
		var lamination = frm.doc.lamination_manhrmachhr * frm.doc.lamination_machine_hours
		frm.set_value('lamination_total_man_hrs',lamination)
	},
	lamination_manhr_rate(frm){
		var lamination = frm.doc.lamination_total_man_hrs * frm.doc.lamination_manhr_rate
		frm.set_value('lamination_cost',lamination)
	},
	printing_manhrmachhr(frm){
		var printing = frm.doc.printing_manhrmachhr * frm.doc.printing_machine_hours
		frm.set_value('printing_total_man_hrs',printing)
	},
	printing_manhr_rate(frm){
		var printing = frm.doc.printing_total_man_hrs * frm.doc.printing_manhr_rate
		frm.set_value('printing_cost',printing)
	},
	blown_film_manhr_machhr(frm){
		var blown_film = frm.doc.blown_film_manhr_machhr * frm.doc.blown_film_machine_hours
		frm.set_value('total_man_hrs',blown_film)
		frm.set_value('blownfilm_machine_hours',frm.doc.blown_film_machine_hours)
	},
	manhr_rate(frm){
		var blown_film = frm.doc.total_man_hrs * frm.doc.manhr_rate
		frm.set_value('cost',blown_film)
	},

	liner_cutting_manhr_machhr(frm){
		var liner_cutting = frm.doc.liner_cutting_manhr_machhr * frm.doc.liner_cutting_machine_hours
		frm.set_value('liner_cutting_total_man_hrs',liner_cutting)
	},
	liner_cutting_manhr_rate(frm){
		var liner_cutting = frm.doc.liner_cutting_total_man_hrs * frm.doc.liner_cutting_manhr_rate
		frm.set_value('liner_cutting_cost',liner_cutting)
	},
	cutting_manhr_machhr(frm){
		var cutting = frm.doc.cutting_manhr_machhr * frm.doc.cutting_machine_hours
		frm.set_value('cuttingmachine_hours',frm.doc.cutting_machine_hours)
		frm.set_value('cutting_total_man_hrs',cutting)
	},
	cutting_manhr_rate(frm){
		var cutting = frm.doc.cutting_total_man_hrs * frm.doc.cutting_manhr_rate
		frm.set_value('cutting_cost',cutting)
	},
	stitching_manhr_machhr(frm){
		var stitching = frm.doc.stitching_manhr_machhr * frm.doc.stitching_machine_hours
		frm.set_value('stitching_total_man_hrs',stitching)
	},
	stitching_manhr_rate(frm){
		var stitching = frm.doc.stitching_total_man_hrs * frm.doc.stitching_manhr_rate
		frm.set_value('stitching_cost',stitching)
	},
	bailing_manhr_machhr(frm){
		var bailing = frm.doc.bailing_manhr_machhr * frm.doc.bailing_machine_hours
		frm.set_value('bailing_total_man_hrs',bailing)
	},
	bailing_manhr_rate(frm){
		var bailing = frm.doc.bailing_total_man_hrs * frm.doc.bailing_manhr_rate
		frm.set_value('bailing_cost',bailing)
	},
	taperate(frm){
		var taperate = frm.doc.tapemachine_hours * frm.doc.taperate
		frm.set_value('tapecost',taperate)
	},
	cuttingrate(frm){
		var cuttingrate = frm.doc.cuttingmachine_hours * frm.doc.cuttingrate
		frm.set_value('cuttingcost',cuttingrate)
	},
	blownfilm__rate(frm){
		var blownfilmrate = frm.doc.blownfilm_machine_hours * frm.doc.blownfilm__rate
		frm.set_value('blownfilm_cost',blownfilmrate)
	},
	freight_rate(frm){
		var freight_amount = frm.doc.freight_machine_hours * frm.doc.freight_rate
		frm.set_value('freight_amount',freight_amount)
	},
	css(frm){
		$('input[data-fieldname="freight_rate"]').css("background-color","#deeefa")
		$('input[data-fieldname="freight_currency"]').css("background-color","#deeefa")
		$('input[data-fieldname="loom_manhrmachhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="tape_manhrmachhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="lamination_manhrmachhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="printing_manhrmachhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="blown_film_manhr_machhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="liner_cutting_manhr_machhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="cutting_manhr_machhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="stitching_manhr_machhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="bailing_manhr_machhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="taperate"]').css("background-color","#deeefa")
		$('input[data-fieldname="cuttingrate"]').css("background-color","#deeefa")
		$('input[data-fieldname="blownfilm__rate"]').css("background-color","#deeefa")
	},
	refresh(frm){
		frm.trigger('css')
	},
	onload(frm){
		if(!frm.doc.__islocal){
			frappe.db.get_single_value('Commercial Costing Master', 'loom_manhr')
				.then(r => {
					frm.set_value('loom_manhrmachhr',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'tape_manhr')
				.then(r => {
					frm.set_value('tape_manhrmachhr',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'lamination_manhr')
				.then(r => {
					frm.set_value('lamination_manhrmachhr',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'printing_manhr')
				.then(r => {
					frm.set_value('printing_manhrmachhr',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'blown_film_manhr')
				.then(r => {
					frm.set_value('blown_film_manhr_machhr',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'liner_cutting_manhr')
				.then(r => {
					frm.set_value('liner_cutting_manhr_machhr',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'cutting_manhr')
				.then(r => {
					frm.set_value('cutting_manhr_machhr',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'stitching_manhr')
				.then(r => {
					frm.set_value('stitching_manhr_machhr',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'bailing_manhr')
				.then(r => {
					frm.set_value('bailing_manhr_machhr',r)
			})


			frappe.db.get_single_value('Commercial Costing Master', 'loom_manhr_rate')
				.then(r => {
					frm.set_value('loom_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'tape_manhr_rate')
				.then(r => {
					frm.set_value('tape_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'lamination_manhr_rate')
				.then(r => {
					frm.set_value('lamination_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'printing_manhr_rate')
				.then(r => {
					frm.set_value('printing_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'blown_film_manhr_rate')
				.then(r => {
					frm.set_value('manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'liner_cutting_manhr_rate')
				.then(r => {
					frm.set_value('liner_cutting_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'cutting_manhr_rate')
				.then(r => {
					frm.set_value('cutting_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'stitching_manhr_rate')
				.then(r => {
					frm.set_value('stitching_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'bailing_manhr_rate')
				.then(r => {
					frm.set_value('bailing_manhr_rate',r)
			})

			frappe.db.get_single_value('Commercial Costing Master', 'tape_overhead_rate')
				.then(r => {
					frm.set_value('taperate',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'cutting_overhead_rate')
				.then(r => {
					frm.set_value('cuttingrate',r)
			})
			frappe.db.get_single_value('Commercial Costing Master', 'blown_film_overhead_rate')
				.then(r => {
					frm.set_value('blownfilm__rate',r)
			})
		}
		frm.trigger('loom_manhrmachhr')
		frm.trigger('loom_manhr_rate')
		frm.trigger('tape_manhrmachhr')
		frm.trigger('tape_manhr_rate')
		frm.trigger('lamination_manhrmachhr')
		frm.trigger('lamination_manhr_rate')
		frm.trigger('printing_manhrmachhr')
		frm.trigger('printing_manhr_rate')
		frm.trigger('blown_film_manhr_machhr')
		frm.trigger('manhr_rate')
		frm.trigger('liner_cutting_manhr_machhr')
		frm.trigger('liner_cutting_manhr_rate')
		frm.trigger('cutting_manhr_machhr')
		frm.trigger('cutting_manhr_rate')
		frm.trigger('stitching_manhr_machhr')
		frm.trigger('stitching_manhr_rate')
		frm.trigger('bailing_manhr_machhr')
		frm.trigger('bailing_manhr_rate')
		frm.trigger('taperate')
		frm.trigger('cuttingrate')
		frm.trigger('blownfilm__rate')
		frm.trigger('freight_rate')
		frm.trigger('child_calculation')
		frm.trigger('total_calc')
	},
	child_calculation(frm){
		var weft_total = 0 
		$.each(frm.doc.weft_raw_material,function(i,d){
			weft_total += d.amount
		})
		frm.set_value('weft_raw_material_',weft_total)

		var warp_total = 0 
		$.each(frm.doc.warp_raw_material,function(i,d){
			warp_total += d.amount
		})
		frm.set_value('warp_raw_material_',warp_total)


		var strip_total = 0 
		$.each(frm.doc.strip_raw_material,function(i,d){
			strip_total += d.amount
		})
		frm.set_value('strip_raw_material_',strip_total)


		var liner_total = 0 
		$.each(frm.doc.liner_raw_material,function(i,d){
			liner_total += d.amount
		})
		frm.set_value('liner_raw_material_',liner_total)


		var lamination_total = 0 
		$.each(frm.doc.lamination_raw_material,function(i,d){
			lamination_total += d.amount
		})
		frm.set_value('lamination_raw_material_',lamination_total)

		var total_raw_material_cost = frm.doc.lamination_raw_material_+frm.doc.liner_raw_material_+frm.doc.strip_raw_material_+frm.doc.warp_raw_material_+frm.doc.weft_raw_material_
		frm.set_value('total_raw_material_cost',total_raw_material_cost)
	},
	total_raw_material_cost(frm){
		frm.set_value('raw_material_cost',frm.doc.total_raw_material_cost)
	},
	total_calc(frm){
		var man_total = frm.doc.loom_cost +frm.doc.tape_cost + frm.doc.lamination_cost + frm.doc.printing_cost + frm.doc.cost +frm.doc.liner_cutting_cost +frm.doc.cutting_cost + frm.doc.stitching_cost + frm.doc.bailing_cost
		var ovr_total = frm.doc.tapecost + frm.doc.cuttingcost + frm.doc.blownfilm_cost

		frm.set_value('total_manpower',man_total)
		frm.set_value('manpower_cost',man_total)

		frm.set_value('total_overhead',ovr_total)
		frm.set_value('overhead_cost',ovr_total)
		frm.set_value('freight_cost',frm.doc.freight_amount)



		var total = frm.doc.total_manpower + frm.doc.total_overhead +frm.doc.freight_amount + frm.doc.total_raw_material_cost
		frm.set_value('cost_per_order',total)

		var metric = frm.doc.cost_per_order / frm.doc.no_of_units
		frm.set_value('cost_per_metric_ton',metric)
		var met = frm.doc.cost_per_metric_ton / 3.64
		frm.set_value('cost_per_metric_ton_usd',met)

		var unit = frm.doc.cost_per_metric_ton / frm.doc.order_quantity
		console.log(unit)
	},
	validate(frm){
		frm.trigger('total_calc')
		frm.trigger('child_calculation')
		frm.trigger('loom_manhrmachhr')
		frm.trigger('loom_manhr_rate')
		frm.trigger('tape_manhrmachhr')
		frm.trigger('tape_manhr_rate')
		frm.trigger('lamination_manhrmachhr')
		frm.trigger('lamination_manhr_rate')
		frm.trigger('printing_manhrmachhr')
		frm.trigger('printing_manhr_rate')
		frm.trigger('blown_film_manhr_machhr')
		frm.trigger('manhr_rate')
		frm.trigger('liner_cutting_manhr_machhr')
		frm.trigger('liner_cutting_manhr_rate')
		frm.trigger('cutting_manhr_machhr')
		frm.trigger('cutting_manhr_rate')
		frm.trigger('stitching_manhr_machhr')
		frm.trigger('stitching_manhr_rate')
		frm.trigger('bailing_manhr_machhr')
		frm.trigger('bailing_manhr_rate')
		frm.trigger('taperate')
		frm.trigger('cuttingrate')
		frm.trigger('blownfilm__rate')
		frm.trigger('freight_rate')
		frm.set_value('tapemachine_hours',frm.doc.tape_machine_hours)
		frm.set_value('cuttingmachine_hours',frm.doc.cutting_machine_hours)
		frm.set_value('blownfilm_machine_hours',frm.doc.blown_film_machine_hours)
		
		// frm.set_value('cost_per_unit',unit)

		// var unitmet = frm.doc.cost_per_unit / 3.64
		// frm.set_value('cost_per_unit',unitmet)
	}
});
frappe.ui.form.on('Tape Raw Material', {
	rate: function(frm,cdt,cdn){
		var row = locals[cdt][cdn]
		row.amount = row.qty * row.rate
		frm.refresh_field("warp_raw_material")
		frm.refresh_field("weft_raw_material")
		frm.refresh_field("strip_raw_material")
		frm.refresh_field("liner_raw_material")
		frm.refresh_field("lamination_raw_material")
	}
})