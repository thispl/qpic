// Copyright (c) 2023, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sub Commercial Costing', {
	cost(frm){
		var metric = frm.doc.cost_per_unit_usd * frm.doc.no_of_units
		frm.set_value('cost_per_metric_ton_usd',metric)

		var unit = frm.doc.cost_per_order / frm.doc.order_quantity
		frm.set_value('cost_per_unit_usd',unit)
	},
	cost_per_metric_ton(frm){
		frm.trigger('perm_discount')
		frm.trigger('permdiscount')
		frm.trigger('discount_tolerance')
	},
	cost_pu_raw(frm){
		frm.set_value('raw_material_cost_pu',frm.doc.cost_pu_raw)
	},
	cost_pmt_raw(frm){		
		frm.set_value('raw_material_cost_pmt',frm.doc.cost_pmt_raw)
	},

	cost_pu_man(frm){
		frm.set_value('manpower_cost_pu',frm.doc.cost_pu_man)
	},
	cost_pmt_man(frm){		
		frm.set_value('manpower_cost_pmt',frm.doc.cost_pmt_man)
	},

	cost_pu_over(frm){
		frm.set_value('overhead_cost_pu',frm.doc.cost_pu_over)
	},
	cost_pmt_over(frm){		
		frm.set_value('overhead_cost_pmt',frm.doc.cost_pmt_over)
	},

	cost_pu_freight(frm){
		frm.set_value('freight_cost_pu',frm.doc.cost_pu_freight)
	},
	cost_pmt_freight(frm){		
		frm.set_value('freight_cost_pmt',frm.doc.cost_pmt_freight)
	},
	costing_currency(frm){
		frm.trigger('discount_tolerance')
		frm.trigger('cost')
		$.each(frm.doc.weft_raw_material,function(i,d){
			d.currency = frm.doc.costing_currency
		})
		frm.refresh_field("weft_raw_material")
		$.each(frm.doc.strip_raw_material,function(i,d){
			d.currency = frm.doc.costing_currency
		})
		frm.refresh_field("strip_raw_material")
		$.each(frm.doc.warp_raw_material,function(i,d){
			d.currency = frm.doc.costing_currency
		})
		frm.refresh_field("warp_raw_material")
		$.each(frm.doc.liner_raw_material,function(i,d){
			d.currency = frm.doc.costing_currency
		})
		frm.refresh_field("liner_raw_material")
		$.each(frm.doc.lamination_raw_material,function(i,d){
			d.currency = frm.doc.costing_currency
		})
		frm.refresh_field("lamination_raw_material")
		frm.set_value('freight_currency',frm.doc.costing_currency)
	},
	loom_manhrmachhr(frm){
		var loom = frm.doc.loom_manhrmachhr * frm.doc.loom_machine_hours
		frm.set_value('loom_total_man_hrs',loom)
		frm.set_value('loommachine_hours',frm.doc.loom_machine_hours)
	},
	loom_manhr_rate(frm){
		var loom = frm.doc.loom_total_man_hrs * frm.doc.loom_manhr_rate
		frm.set_value('loom_cost',loom)
	},
	tape_manhrmachhr(frm){
		var tape = frm.doc.tape_manhrmachhr * frm.doc.tape_machine_hours
		frm.set_value('tape_total_man_hrs',tape)
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
	loomrate(frm){
		var loomcost = frm.doc.loommachine_hours * frm.doc.loomrate
		frm.set_value('loomcost',loomcost)
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
	master_data(frm){
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'loom_manhr')
				.then(r => {
					frm.set_value('loom_manhrmachhr',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'tape_manhr')
				.then(r => {
					frm.set_value('tape_manhrmachhr',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'needle_loom_manhr')
				.then(r => {
					frm.set_value('needle_loom_manhrmachhr',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'lamination_manhr')
				.then(r => {
					frm.set_value('lamination_manhrmachhr',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'printing_manhr')
				.then(r => {
					frm.set_value('printing_manhrmachhr',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'blown_film_manhr')
				.then(r => {
					frm.set_value('blown_film_manhr_machhr',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'liner_cutting_manhr')
				.then(r => {
					frm.set_value('liner_cutting_manhr_machhr',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'cutting_manhr')
				.then(r => {
					frm.set_value('cutting_manhr_machhr',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'stitching_manhr')
				.then(r => {
					frm.set_value('stitching_manhr_machhr',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'bailing_manhr')
				.then(r => {
					frm.set_value('bailing_manhr_machhr',r)
			})


			frappe.db.get_single_value('Commercial Costing FIBC Master', 'loom_manhr_rate')
				.then(r => {
					frm.set_value('loom_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'tape_manhr_rate')
				.then(r => {
					frm.set_value('tape_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'lamination_manhr_rate')
				.then(r => {
					frm.set_value('lamination_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'needle_loom_manhr_rate')
				.then(r => {
					frm.set_value('needle_loom_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'printing_manhr_rate')
				.then(r => {
					frm.set_value('printing_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'blown_film_manhr_rate')
				.then(r => {
					frm.set_value('manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'liner_cutting_manhr_rate')
				.then(r => {
					frm.set_value('liner_cutting_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'cutting_manhr_rate')
				.then(r => {
					frm.set_value('cutting_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'stitching_manhr_rate')
				.then(r => {
					frm.set_value('stitching_manhr_rate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'bailing_manhr_rate')
				.then(r => {
					frm.set_value('bailing_manhr_rate',r)
			})

			frappe.db.get_single_value('Commercial Costing FIBC Master', 'loom_overhead_rate')
				.then(r => {
					frm.set_value('loomrate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'cutting_overhead_rate')
				.then(r => {
					frm.set_value('cuttingrate',r)
			})
			frappe.db.get_single_value('Commercial Costing FIBC Master', 'blown_film_overhead_rate')
				.then(r => {
					frm.set_value('blownfilm__rate',r)
			})
	
	},
	css(frm){
		$('input[data-fieldname="freight_rate"]').css("background-color","#deeefa")
		$('input[data-fieldname="freight_currency"]').css("background-color","#deeefa")
		$('input[data-fieldname="loom_manhrmachhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="tape_manhrmachhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="needle_loom_manhrmachhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="lamination_manhrmachhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="printing_manhrmachhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="blown_film_manhr_machhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="liner_cutting_manhr_machhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="cutting_manhr_machhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="stitching_manhr_machhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="bailing_manhr_machhr"]').css("background-color","#deeefa")
		$('input[data-fieldname="loomrate"]').css("background-color","#deeefa")
		$('input[data-fieldname="cuttingrate"]').css("background-color","#deeefa")
		$('input[data-fieldname="blownfilm__rate"]').css("background-color","#deeefa")
	},
	refresh(frm){
		// frm.add_custom_button(__("Print"), function () {
		// 	var f_name = frm.doc.name
		// 	var print_format = "Commercial Costing";
		// 	window.open(frappe.urllib.get_full_url("/api/method/frappe.utils.print_format.download_pdf?"
		// 		+ "doctype=" + encodeURIComponent("Commercial Costing")
		// 		+ "&name=" + encodeURIComponent(f_name)
		// 		+ "&trigger_print=1"
		// 		+ "&format=" + print_format
		// 		+ "&no_letterhead=0"
				
		// 	));


		// });
		frm.trigger('css')
		var company_currency = "QAR"
		cur_frm.set_df_property("cost_per_metric_ton_usd", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));

		cur_frm.set_df_property("cost_per_unit_usd", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));

		cur_frm.set_df_property("dis_cost_pmt", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));

		cur_frm.set_df_property("dis_cost_pu", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));

		cur_frm.set_df_property("cost_per_metric_ton", "label",
		("Cost (per metric ton)" + " " + "("+company_currency+")"));

		cur_frm.set_df_property("cost_per_unit", "label",
		("Cost (per unit)" + " " + "("+company_currency+")"));

		cur_frm.set_df_property("dis_comp_cost_pmt", "label",
		("Cost (per metric ton)" + " " + "("+company_currency+")"));

		cur_frm.set_df_property("dis_comp_cost_pu", "label",
		("Cost (per unit)" + " " + "("+company_currency+")"));
		
		cur_frm.set_df_property("weft_cost_pu", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("weft_cost_pmt", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("strip_cost_pu", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("strip_cost_pmt", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("warp_cost_pu", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("warp_cost_pmt", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("nl_cost_pu", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("nl_cost_pmt", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("lam_cost_pu", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("lam_cost_pmt", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("liner_cost_pu", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("liner_cost_pmt", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("cost_pu_raw", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("cost_pmt_raw", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("cost_pu_man", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("cost_pmt_man", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("cost_pu_over", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("cost_pmt_over", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("cost_pu_freight", "label",
		("Cost (per unit)" + " " + "("+frm.doc.costing_currency+")"));
		cur_frm.set_df_property("cost_pmt_freight", "label",
		("Cost (per metric ton)" + " " + "("+frm.doc.costing_currency+")"));

	},
	onload(frm){
		frm.trigger('master_data')
		// var tape_list = []
		// var tape = {}
		// $.each(frm.doc.warp_raw_material, function (i, d) {
		// 	tape = {}
		// 	tape['item_code'] = d.item_code
		// 	tape['item_description'] = d.item_description
		// 	tape['dosage'] = d.dosage
		// 	tape['unit'] = d.unit
		// 	tape['currency'] = d.currency
		// 	tape['rate'] = d.rate
		// 	tape['amount'] = d.amount
		// 	tape_list.push(tape)
		// })
		// $.each(frm.doc.weft_raw_material, function (i, d) {
		// 	tape = {}
		// 	tape['item_code'] = d.item_code
		// 	tape['item_description'] = d.item_description
		// 	tape['dosage'] = d.dosage
		// 	tape['unit'] = d.unit
		// 	tape['currency'] = d.currency
		// 	tape['rate'] = d.rate
		// 	tape['amount'] = d.amount
		// 	tape_list.push(tape)
		// })
		// $.each(frm.doc.strip_raw_material, function (i, d) {
		// 	tape = {}
		// 	tape['item_code'] = d.item_code
		// 	tape['item_description'] = d.item_description
		// 	tape['dosage'] = d.dosage
		// 	tape['unit'] = d.unit
		// 	tape['currency'] = d.currency
		// 	tape['rate'] = d.rate
		// 	tape['amount'] = d.amount
		// 	tape_list.push(tape)
		// })
		// frappe.call({
		// 	method:"qpic.custom.get_duplicate",
		// 	args: {
		// 	    'tape': tape_list,
		// 	},
        //     callback(r){
        //         if(r.message){
        //              $.each(r.message,function(i,j){
		// 				console.log(j)
		// 				var qt=0
		// 				var dos = 0 
		// 				var rat = 0 
		// 				var amt = 0 
		// 				$.each(frm.doc.tape_raw_material,function(i,k){							
		// 					if(j== k.item_code){
		// 						qt += k.qty
		// 						dos += k.dosage
		// 						rat += k.rate
		// 						amt += k.amount
		// 						console.log(qt)								
		// 					}frm.clear_table('')
		// 					frm.add_child('tape_raw_material',{
		// 						"item_code": j,
		// 						"qty":qt
		// 					})
		// 					frm.refresh_field("tape_raw_material")
		// 				})
					
		// 			 })                    
        //         }
        //     }
		// })

	














		// $.each(frm.doc.warp_raw_material,function(i,j){
		// 	$.each(frm.doc.weft_raw_material,function(i,k){
		// 		$.each(frm.doc.strip_raw_material,function(i,l){
		// 			if(j.item_code == k.item_code){
		// 				if(k.item_code == l.item_code){
		// 					console.log(j.item_code)
		// 					var dos = j.dosage + k.dosage +l.dosage
		// 					var rat = j.rate + k.rate +l.rate
		// 					var qt = j.qty + k.qty +l.qty
		// 					console.log(qt)
		// 				}
		// 			}
		// 		})
		// 	})
		// })
		// frm.clear_table('tape_raw_material')
		// $.each(frm.doc.weft_raw_material,function(i,w){
		// frm.add_child('tape_raw_material',{
		// 		"item_code" : w.item_code,
		// 		"item_description" : w.item_description,
		// 		"rate" : w.rate,
		// 		"currency" : w.currency,
		// 		"amount" : w.amount,
		// 		"qty" : w.qty,
		// 		"dosage" : w.dosage,
		// 		"unit" : w.unit
		// 	})
		// 	frm.refresh_field('tape_raw_material')
		// })
		// $.each(frm.doc.warp_raw_material,function(i,w){
		// frm.add_child('tape_raw_material',{
		// 		"item_code" : w.item_code,
		// 		"item_description" : w.item_description,
		// 		"rate" : w.rate,
		// 		"currency" : w.currency,
		// 		"amount" : w.amount,
		// 		"qty" : w.qty,
		// 		"dosage" : w.dosage,
		// 		"unit" : w.unit
		// 	})
		// 	frm.refresh_field('tape_raw_material')			
		// })
		// $.each(frm.doc.strip_raw_material,function(i,w){
		// frm.add_child('tape_raw_material',{
		// 		"item_code" : w.item_code,
		// 		"item_description" : w.item_description,
		// 		"rate" : w.rate,
		// 		"currency" : w.currency,
		// 		"amount" : w.amount,
		// 		"qty" : w.qty,
		// 		"dosage" : w.dosage,
		// 		"unit" : w.unit
		// 	})
		// 	frm.refresh_field('tape_raw_material')			
		// })
		
		if(frm.doc.docstatus !=1){

		frm.trigger('lamination_manhrmachhr')
		frm.trigger('total_calc')
		frm.trigger('lamination_manhr_rate')
		frm.trigger('child_calculation')
		}
		
		frm.trigger('loom_manhrmachhr')
		frm.trigger('loom_manhr_rate')
		frm.trigger('tape_manhrmachhr')
		frm.trigger('tape_manhr_rate')
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
		frm.trigger('loomrate')
		frm.trigger('cuttingrate')
		frm.trigger('blownfilm__rate')
		frm.trigger('freight_rate')
	},
	child_calculation(frm){
		var weft_total = 0 
		var weft_dosage = 0
		var weft_qty=0
		$.each(frm.doc.weft_raw_material,function(i,d){
			weft_total += d.amount
			weft_qty += d.qty
			weft_dosage += d.dosage
		})
		frm.set_value('weft_raw_material_',weft_total)
		var wef = frm.doc.weft_raw_material_ / frm.doc.order_quantity
		frm.set_value('weft_cost_pu',wef)
		var wefpmt = frm.doc.weft_cost_pu * frm.doc.no_of_units
		frm.set_value('weft_cost_pmt',wefpmt)
		frm.set_value('total_quantity_weft',weft_qty)
		frm.set_value('total_dosage_weft',weft_dosage)

		var warp_total = 0 
		var warp_dosage = 0
		var warp_qty=0
		$.each(frm.doc.warp_raw_material,function(i,d){
			warp_total += d.amount
			warp_qty += d.qty
			warp_dosage += d.dosage
		})
		frm.set_value('warp_raw_material_',warp_total)
		var war = frm.doc.warp_raw_material_ / frm.doc.order_quantity
		frm.set_value('warp_cost_pu',war)
		var warpmt = frm.doc.warp_cost_pu * frm.doc.no_of_units
		frm.set_value('warp_cost_pmt',warpmt)
		frm.set_value('total_quantity_warp',warp_qty)
		frm.set_value('total_dosage_warp',warp_dosage)


		var strip_total = 0 
		var strip_dosage = 0
		var strip_qty=0
		$.each(frm.doc.strip_raw_material,function(i,d){
			strip_total += d.amount
			strip_qty += d.qty
			strip_dosage += d.dosage
		})
		frm.set_value('strip_raw_material_',strip_total)
		var strip = frm.doc.strip_raw_material_ / frm.doc.order_quantity
		frm.set_value('strip_cost_pu',strip)
		var strippmt = frm.doc.strip_cost_pu * frm.doc.no_of_units
		frm.set_value('strip_cost_pmt',strippmt)
		frm.set_value('total_quantity_strip',strip_qty)
		frm.set_value('total_dosage_strip',strip_dosage)


		var nl_total = 0 
		var nl_dosage = 0
		var nl_qty=0
		$.each(frm.doc.needle_loom_raw_material,function(i,d){
			nl_total += d.amount
			nl_qty += d.qty
			nl_dosage += d.dosage
		})
		frm.set_value('nl_raw_material_',nl_total)
		var nl = frm.doc.nl_raw_material_ / frm.doc.order_quantity
		frm.set_value('nl_cost_pu',nl)
		var nlpmt = frm.doc.nl_cost_pu * frm.doc.no_of_units
		frm.set_value('nl_cost_pmt',nlpmt)
		frm.set_value('total_quantity_nl',nl_qty)
		frm.set_value('total_dosage_nl',nl_dosage)



		var liner_total = 0 
		var liner_dosage = 0
		var liner_qty=0
		$.each(frm.doc.liner_raw_material,function(i,d){
			liner_total += d.amount
			liner_qty += d.qty
			liner_dosage += d.dosage
		})
		frm.set_value('liner_raw_material_',liner_total)
		var line = frm.doc.liner_raw_material_ / frm.doc.order_quantity
		frm.set_value('liner_cost_pu',line)
		var linerpmt = frm.doc.liner_cost_pu * frm.doc.no_of_units
		frm.set_value('liner_cost_pmt',linerpmt)
		frm.set_value('total_quantity_liner',liner_qty)
		frm.set_value('total_dosage_liner',liner_dosage)


		var lamination_total = 0 
		var lamination_dosage = 0
		var lamination_qty=0
		$.each(frm.doc.lamination_raw_material,function(i,d){
			lamination_total += d.amount
			lamination_qty += d.qty
			lamination_dosage += d.dosage
		})
		frm.set_value('lamination_raw_material_',lamination_total)
		var lam = frm.doc.lamination_raw_material_ / frm.doc.order_quantity
		frm.set_value('lam_cost_pu',lam)
		var lampmt = frm.doc.lam_cost_pu * frm.doc.no_of_units
		frm.set_value('lam_cost_pmt',lampmt)
		frm.set_value('total_quantity_lamination',lamination_qty)
		frm.set_value('total_dosage_lamination',lamination_dosage)

		var total_raw_material_cost = frm.doc.lamination_raw_material_+frm.doc.liner_raw_material_+frm.doc.strip_raw_material_+frm.doc.warp_raw_material_+frm.doc.nl_raw_material_+frm.doc.weft_raw_material_
		frm.set_value('total_raw_material_cost',total_raw_material_cost)
		var costpuraw = frm.doc.total_raw_material_cost /frm.doc.order_quantity
		frm.set_value('cost_pu_raw',costpuraw)
		var costpmtraw = frm.doc.cost_pu_raw * frm.doc.no_of_units
		frm.set_value('cost_pmt_raw',costpmtraw)
	},
	total_raw_material_cost(frm){
		frm.set_value('raw_material_cost',frm.doc.total_raw_material_cost)
	},
	total_calc(frm){
		var man_total = frm.doc.loom_cost +frm.doc.tape_cost + frm.doc.lamination_cost + frm.doc.printing_cost + frm.doc.cost +frm.doc.liner_cutting_cost +frm.doc.cutting_cost + frm.doc.stitching_cost + frm.doc.bailing_cost
		var ovr_total = frm.doc.loomcost + frm.doc.cuttingcost + frm.doc.blownfilm_cost

		frm.set_value('total_manpower',man_total)
		var costpuman = frm.doc.total_manpower /frm.doc.order_quantity
		frm.set_value('cost_pu_man',costpuman)
		var costpmtman = frm.doc.cost_pu_man * frm.doc.no_of_units
		frm.set_value('cost_pmt_man',costpmtman)

		frm.set_value('manpower_cost',man_total)

		frm.set_value('total_overhead',ovr_total)
		frm.set_value('overhead_cost',ovr_total)

		var costpuover = frm.doc.overhead_cost /frm.doc.order_quantity
		frm.set_value('cost_pu_over',costpuover)
		var costpmtover = frm.doc.cost_pu_over * frm.doc.no_of_units
		frm.set_value('cost_pmt_over',costpmtover)

		frm.set_value('freight_cost',frm.doc.freight_amount)



		var total = frm.doc.total_manpower + frm.doc.total_overhead +frm.doc.freight_amount + frm.doc.total_raw_material_cost
		frm.set_value('cost_per_order',total)

		var costpufreight = frm.doc.freight_amount /frm.doc.order_quantity
		frm.set_value('cost_pu_freight',costpufreight)
		var costpmtfreight = frm.doc.cost_pu_freight * frm.doc.no_of_units
		frm.set_value('cost_pmt_freight',costpmtfreight)


	},
	permdiscount(frm){
		var calc = frm.doc.cost_per_metric_ton - (frm.doc.cost_per_metric_ton * (frm.doc.discount_tolerance/100))
		frm.set_value("dis_comp_cost_pmt",calc)
		var calc = frm.doc.cost_per_unit - (frm.doc.cost_per_unit * (frm.doc.discount_tolerance/100))
		frm.set_value("dis_comp_cost_pu",calc)
	},
	perm_discount(frm){
		var calc = frm.doc.cost_per_metric_ton_usd - (frm.doc.cost_per_metric_ton_usd * (frm.doc.discount_tolerance/100))
		frm.set_value("dis_cost_pmt",calc)
		var calc = frm.doc.cost_per_unit_usd - (frm.doc.cost_per_unit_usd * (frm.doc.discount_tolerance/100))
		frm.set_value("dis_cost_pu",calc)
		frm.trigger('permdiscount')
	},
	discount_tolerance(frm){
		frm.trigger('perm_discount')
		frm.trigger('permdiscount')
		// var rate_calc = d.cost_per_metric_ton - (d.cost_per_metric_ton * (d.discount_tolerance/100))
		// if(d.rate<calc){
		// 	frappe.validated=false
		// 	frappe.msgprint("Rate should not be less than Cost")
		// }
		// if(d.rate_per_metric_ton<rate_calc){
		// 	frappe.validated=false
		// 	frappe.msgprint("Rate Per Metric Ton should not be less than Cost Per Metric Ton")
		// }
	},
	validate(frm){
		frm.trigger('perm_discount')
		frm.trigger('permdiscount')
		frm.trigger('cost')
		frm.trigger('cost_pu_raw')
		frm.trigger('cost_pmt_raw')
		frm.trigger('cost_pu_man')
		frm.trigger('cost_pmt_man')
		frm.trigger('cost_pu_over')
		frm.trigger('cost_pmt_over')
		frm.trigger('cost_pu_freight')
		frm.trigger('cost_pmt_freight')
		frm.trigger('discount_tolerance')
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
		frm.trigger('loomrate')
		frm.trigger('cuttingrate')
		frm.trigger('blownfilm__rate')
		frm.trigger('freight_rate')
		frm.set_value('loommachine_hours',frm.doc.loom_machine_hours)
		frm.set_value('cuttingmachine_hours',frm.doc.cutting_machine_hours)
		frm.set_value('blownfilm_machine_hours',frm.doc.blown_film_machine_hours)

		if(frm.doc.discount_tolerance > 100){
			frappe.validated =false;
			frappe.msgprint("Percentage should be within 100")
		}
		
	}
});
frappe.ui.form.on('Tape Raw Material', {
	rate: function(frm,cdt,cdn){
		var row = locals[cdt][cdn]
		row.amount = row.qty * row.rate
		frm.refresh_field("warp_raw_material")
	}
})
frappe.ui.form.on('Weft Raw Material', {
	rate: function(frm,cdt,cdn){
		var row = locals[cdt][cdn]
		row.amount = row.qty * row.rate
		frm.refresh_field("weft_raw_material")
	}
})
frappe.ui.form.on('Strip Raw Material', {
	rate: function(frm,cdt,cdn){
		var row = locals[cdt][cdn]
		row.amount = row.qty * row.rate
		frm.refresh_field("strip_raw_material")
	}
})
frappe.ui.form.on('Needle Loom Raw Material', {
	rate: function(frm,cdt,cdn){
		var row = locals[cdt][cdn]
		row.amount = row.qty * row.rate
		frm.refresh_field("needle_loom_raw_material")
	}
})
frappe.ui.form.on('Lamination Raw Material', {
	rate: function(frm,cdt,cdn){
		var row = locals[cdt][cdn]
		row.amount = row.qty * row.rate
		frm.refresh_field("lamination_raw_material")
	}
})
frappe.ui.form.on('Liner Raw Material', {
	rate: function(frm,cdt,cdn){
		var row = locals[cdt][cdn]
		row.amount = row.qty * row.rate
		frm.refresh_field("liner_raw_material")
	}
})
frappe.ui.form.on('Raw Material Commercial Costing', {
	rate: function(frm,cdt,cdn){
		var row = locals[cdt][cdn]
		row.amount = row.qty * row.rate
		frm.refresh_field("liner_raw_material")
		frm.refresh_field("tape_raw_material")
		frm.refresh_field("lamination_raw_material")
	}
})
