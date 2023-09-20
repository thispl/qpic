// Copyright (c) 2023, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Production Budget', {
	setup(frm){
		frm.set_query('weft_parent_workstation', () => {
			return {
				filters: {
					is_parent: 1,
				}
			}
		})	
		frm.set_query('weft_workstation', () => {
			if(frm.doc.weft_parent_workstation){
				return {
					filters: {
						parent_workstation: frm.doc.weft_parent_workstation,
					}
				}
			}			
		})
		frm.set_query('strip_parent_workstation', () => {
			return {
				filters: {
					is_parent: 1,
				}
			}
		})	
		frm.set_query('strip_workstation', () => {
			if(frm.doc.strip_parent_workstation){
				return {
					filters: {
						parent_workstation: frm.doc.strip_parent_workstation,
					}
				}
			}
		})
		frm.set_query('warp_parent_workstation', () => {
			return {
				filters: {
					is_parent: 1,
				}
			}
		})	
		frm.set_query('warp_workstation', () => {
			if(frm.doc.warp_parent_workstation){
				return {
					filters: {
						parent_workstation: frm.doc.warp_parent_workstation,
					}
				}
			}
		})
		frm.set_query('loom_parent_workstation', () => {
			return {
				filters: {
					is_parent: 1,
				}
			}
		})	
		frm.set_query('loom_workstation', () => {
			if(frm.doc.loom_parent_workstation){
				return {
					filters: {
						parent_workstation: frm.doc.loom_parent_workstation,
					}
				}
			}
		})
		frm.set_query('liner_parent_workstation', () => {
			return {
				filters: {
					is_parent: 1,
				}
			}
		})	
		frm.set_query('liner_workstation', () => {
			if(frm.doc.liner_parent_workstation){
				return {
					filters: {
						parent_workstation: frm.doc.liner_parent_workstation,
					}
				}
			}
		})
		frm.set_query('lamination_parent_workstation', () => {
			return {
				filters: {
					is_parent: 1,
				}
			}
		})	
		frm.set_query('lamination_workstation', () => {
			if(frm.doc.lamination_parent_workstation){
				return {
					filters: {
						parent_workstation: frm.doc.lamination_parent_workstation,
					}
				}
			}
		})
		frm.set_query('cutting_parent_workstation', () => {
			return {
				filters: {
					is_parent: 1,
				}
			}
		})	
		frm.set_query('cutting_workstation', () => {
			if(frm.doc.cutting_parent_workstation){
				return {
					filters: {
						parent_workstation: frm.doc.cutting_parent_workstation,
					}
				}
			}
		})
		frm.set_query('stitching_parent_workstation', () => {
			return {
				filters: {
					is_parent: 1,
				}
			}
		})	
		frm.set_query('stitching_workstation', () => {
			if(frm.doc.stitching_parent_workstation){
				return {
					filters: {
						parent_workstation: frm.doc.stitching_parent_workstation,
					}
				}
			}
		})
	},
	weft_parent_workstation(frm){

	},
    input_for_stitching(frm){
        frm.clear_table("stitching_raw_material")
        $.each(frm.doc.liner_output,function(i,d){
            if(d.type == "Output"){
                frm.add_child("stitching_raw_material",{
                    'item_code':d.item_code,
                    'unit':d.unit,
                    'stock_qty':d.stock_qty
                })
            }
        })
        $.each(frm.doc.cutting_output,function(i,d){
            if(d.type == "Output"){
                frm.add_child("stitching_raw_material",{
                    'item_code':d.item_code,
                    'unit':d.unit,
                    'stock_qty':d.stock_qty
                })
            }
        })
        frm.refresh_field("stitching_raw_material")
    },
    liner_wt_per_unit(frm){
        $.each(frm.doc.liner_raw_material,function(i,e){
            e.quantity_per_unit = (e.final_dosage/100) * frm.doc.liner_wt_per_unit
            e.stock_qty = e.quantity_per_unit / e.conversion_factor
        })
        frm.refresh_field("liner_raw_material")
        // $.each(frm.doc.liner_output,function(i,e){
        //     e.quantity_per_unit = (e.final_dosage/100) * frm.doc.liner_wt_per_unit
        //     e.stock_qty = e.quantity_per_unit / e.conversion_factor
        // })
        // frm.refresh_field("liner_output")
    },
	loom_calc(frm){
		$.each(frm.doc.warp_output,function(i,b){
			if(b.type == "Output"){
				frm.set_value("warp_out",b.quantity_per_unit)
			}
		})
		$.each(frm.doc.weft_output,function(i,c){
			if(c.type == "Output"){
				frm.set_value("weft_out",c.quantity_per_unit)
			}
		})
		$.each(frm.doc.strip_output,function(i,a){
			if(a.type == "Output"){
				frm.set_value("strip_out",a.quantity_per_unit)
			}				
		})
		frm.set_value("out",frm.doc.warp_out+frm.doc.weft_out+frm.doc.strip_out)
		// console.log(frm.doc.out)
	},
	onload(frm){
        // var arr = ["Weft","Warp","Strip","Loom","Lamination","Cutting","Liner","Stitching"]
        // frm.clear_table("routing_sequence")
        // $.each(arr,function(i,d){
        //     frm.add_child("routing_sequence",{
        //         'operation':d
        //     })
        // })
        // frm.refresh_field("routing_sequence")
		frappe.call({
			method: "qpic.custom.get_tech_sheet_name",
			args: {
				'sales_order': frm.doc.sales_order
			},
			callback: function(r) {
				if(r){
					$.each(r,function(i,j){
						frappe.db.get_value('Quotation',j.prevdoc_docname,'technical_sheet_sb')
						.then(r => {
							var tech = r.message.technical_sheet_sb
							frappe.db.get_value('Technical Sheet SB',tech,['lamination_gms','fabric_gms','liner_gms'])
							.then(r => {
								var lam = r.message.lamination_gms
								var fab = r.message.fabric_gms
								var lin = r.message.liner_gms
								var calc =  (lam + fab)/1000 
                                var lin_calc = (lin/1000)*1.01
                                frm.set_value("liner_wt_per_unit",lin_calc)
								frm.set_value("lam_wt_per_unit",calc)
							})
							
						})
					})
				}
			}
		});
		frm.trigger("loom_calc")
		$.each(frm.doc.strip_raw_material,function(i,d){
			d.uom = "Gram"
			d.quantity_per_unit = d.final_qty / frm.doc.order_quantity
			frappe.call({
				method: "qpic.custom.get_item_conv_factor",
				args: {
					item_code: d.item_code
				},
				callback: function(r) {
					if(r){
						$.each(r.message,function(i,j){
							if(j.uom == d.uom){
								d.conversion_factor = j.conversion_factor
								d.stock_qty = d.quantity_per_unit / j.conversion_factor
							}
						})
					}
				}
			});
		})
        
		$.each(frm.doc.lamination_raw_material,function(i,d){
			d.uom = "Gram"
			if(d.final_dosage > 0){
				d.quantity_per_unit = (frm.doc.total_quantity_lamination / frm.doc.order_quantity)*(d.final_dosage/100)
				frappe.call({
					method: "qpic.custom.get_item_conv_factor",
					args: {
						item_code: d.item_code
					},
					callback: function(r) {
						if(r){
							$.each(r.message,function(i,j){
								if(j.uom == d.uom){
									d.conversion_factor = j.conversion_factor
									d.stock_qty = (d.quantity_per_unit / d.conversion_factor)
								}
							})
						}
					}
				});
			}			
		})
        
		$.each(frm.doc.warp_raw_material,function(i,d){
			d.uom = "Gram"
			d.quantity_per_unit = d.final_qty / frm.doc.order_quantity
			frappe.call({
				method: "qpic.custom.get_item_conv_factor",
				args: {
					item_code: d.item_code
				},
				callback: function(r) {
					if(r){
						$.each(r.message,function(i,j){
							if(j.uom == d.uom){
								d.conversion_factor = j.conversion_factor
								d.stock_qty = d.quantity_per_unit / j.conversion_factor
							}
						})
					}
				}
			});
		})
        $.each(frm.doc.liner_raw_material,function(i,d){
			d.uom = "Gram"
			d.quantity_per_unit = d.final_qty / frm.doc.order_quantity
			frappe.call({
				method: "qpic.custom.get_item_conv_factor",
				args: {
					item_code: d.item_code
				},
				callback: function(r) {
					if(r){
						$.each(r.message,function(i,j){
							if(j.uom == d.uom){
								d.conversion_factor = j.conversion_factor
								d.stock_qty = d.quantity_per_unit / j.conversion_factor
							}
						})
					}
				}
			});
		})
		$.each(frm.doc.weft_raw_material,function(i,d){
			d.uom = "Gram"
			d.quantity_per_unit = d.final_qty / frm.doc.order_quantity
			frappe.call({
				method: "qpic.custom.get_item_conv_factor",
				args: {
					item_code: d.item_code
				},
				callback: function(r) {
					if(r){
						$.each(r.message,function(i,j){
							if(j.uom == d.uom){
								d.conversion_factor = j.conversion_factor
								d.stock_qty = d.quantity_per_unit / j.conversion_factor
							}
						})
					}
				}
			});
		})
	},
	lam_total(frm){
		$.each(frm.doc.lamination_output,function(i,j){
			if(j.type == "Scrap"){
				j.quantity_per_unit=frm.doc.lam_total
				j.stock_qty = j.quantity_per_unit / j.conversion_factor
			}
		})
		frm.refresh_field("lamination_output")
	},
	validate(frm){		
        $.each(frm.doc.routing_sequence,function(i,j){
            if(j.operation == "Warp"){
                frm.set_value("warp_routing_sequence",j.idx)
            }
            if(j.operation == "Weft"){
                frm.set_value("weft_routing_sequence",j.idx)
            }
            if(j.operation == "Lamination"){
                frm.set_value("lamination_routing_sequence",j.idx)
            }
            if(j.operation == "Strip"){
                frm.set_value("strip_routing_sequence",j.idx)
            }
            if(j.operation == "Loom"){
                frm.set_value("loom_routing_sequence",j.idx)
            }
            if(j.operation == "Cutting"){
                frm.set_value("cutting_routing_sequence",j.idx)
            }
            if(j.operation == "Liner"){
                frm.set_value("liner_routing_sequence",j.idx)
            }
            if(j.operation == "Stitching"){
                frm.set_value("stitching_routing_sequence",j.idx)
            }
        })
        frm.trigger("liner_wt_per_unit")
        frm.trigger("lam_total")
		var total = 0
		$.each(frm.doc.lamination_raw_material,function(i,k){
			total += k.stock_qty
		})
		var lam_total = (total- (frm.doc.lam_wt_per_unit * 1000))/1000
		frm.set_value("lam_total",lam_total)
		// frm.set_value("lam_total",lam_total)
		// $.each(frm.doc.loom_output,function(i,l){
		// 	$.each(frm.doc.lamination_raw_material,function(i,s){
		// 		if(l.item_code == s.item_code){
		// 			s.quantity_per_unit = l.quantity_per_unit
		// 			s.stock_qty = l.stock_qty
		// 			console.log(s.quantity_per_unit)
		// 			console.log(s.stock_qty)
		// 		}
		// 	})

		// 	frm.refresh_field("lamination_raw_material")
		// })
		
		frm.trigger("loom_calc")
		$.each(frm.doc.loom_raw_material,function(i,f){
			f.quantity_per_unit = frm.doc.out
            f.stock_qty = f.quantity_per_unit / f.conversion_factor
		})
		var weft = (frm.doc.total_quantity_weft / frm.doc.order_quantity)
		frm.set_value('quantity_per_unit_weft',weft)
		var warp = (frm.doc.total_quantity_warp / frm.doc.order_quantity)
		frm.set_value('quantity_per_unit_warp',warp)
		var strip = (frm.doc.total_quantity_strip / frm.doc.order_quantity)
		frm.set_value('quantity_per_unit_strip',strip)
		var lam = (frm.doc.total_quantity_lamination / frm.doc.order_quantity)
		frm.set_value('quantity_per_unit_lamination',lam)
		var liner = (frm.doc.total_quantity_liner / frm.doc.order_quantity)
		frm.set_value('quantity_per_unit_liner',liner)
	    frm.trigger('child_calculation')
	},
	child_calculation(frm){
		var weft_total = 0
		var weft_p = 0 
		$.each(frm.doc.weft_raw_material,function(i,d){
			weft_total += d.final_amount
			weft_p += d.final_dosage
		})
		frm.set_value('final_weft',weft_total)
		frm.set_value('weft_percent',weft_p)
		if(frm.doc.weft_percent ==100){
			frappe.validated = true;
		}
		else{
			frappe.validated = false;
			frappe.throw("Weft Dosage should be 100")
		}

		var warp_total = 0 
		var warp_p = 0 
		$.each(frm.doc.warp_raw_material,function(i,d){
			warp_total += d.final_amount
			warp_p += d.final_dosage
		})
		frm.set_value('final_warp',warp_total)
		frm.set_value('warp_percent',warp_p)
		if(frm.doc.warp_percent ==100){
			frappe.validated = true;
		}
		else{
			frappe.validated = false;
			frappe.throw("Warp Dosage should be 100")
		}

		var strip_total = 0 
		var strip_p = 0 
		$.each(frm.doc.strip_raw_material,function(i,d){
			strip_total += d.final_amount
			strip_p += d.final_dosage
		})
		frm.set_value('final_strip',strip_total)
		frm.set_value('strip_percent',strip_p)
		if(frm.doc.strip_percent ==100){
			frappe.validated = true;
		}
		else{
			frappe.validated = false;
			frappe.throw("Strip Dosage should be 100")
		}

		var liner_total = 0 
		var liner_p = 0 
		$.each(frm.doc.liner_raw_material,function(i,d){
			liner_total += d.final_amount
			liner_p += d.final_dosage
		})
		frm.set_value('final_liner',liner_total)
		frm.set_value('liner_percent',liner_p)
		if(frm.doc.liner_percent ==100){
			frappe.validated = true;
		}
		else{
			frappe.validated = false;
			frappe.throw("Liner Dosage should be 100")
		}
		var lamination_total = 0 
		var lamination_p = 0 
		$.each(frm.doc.lamination_raw_material,function(i,d){
			lamination_total += d.final_amount
			lamination_p += d.final_dosage
		})
		frm.set_value('final_lamination',lamination_total)
		frm.set_value('lamination_percent',lamination_p)
		if(frm.doc.lamination_percent ==100){
			frappe.validated = true;
		}
		else{
			frappe.validated = false;
			frappe.throw("Lamination Dosage should be 100")
		}

		if(frm.doc.liner_output_check){
			var out_dosage_liner = 0 
			$.each(frm.doc.liner_output,function(i,d){
				out_dosage_liner += d.dosage
			})
			frm.set_value('out_dosage_liner',out_dosage_liner)
			if(frm.doc.out_dosage_liner ==100){
				frappe.validated = true;
			}
			else{
				frappe.validated = false;
				frappe.throw("Liner Output Dosage should be 100")
			}
		}
		
		if(frm.doc.lamination_output_check){
			var out_dosage_lamination = 0 
			$.each(frm.doc.lamination_output,function(i,d){
				out_dosage_lamination += d.dosage
			})
			frm.set_value('out_dosage_lamination',out_dosage_lamination)
			if(frm.doc.out_dosage_lamination ==100){
				frappe.validated = true;
			}
			else{
				frappe.validated = false;
				frappe.throw("Lamination Output Dosage should be 100")
			}
		}

		if(frm.doc.weft_output_check){
			var out_dosage_weft = 0 
			$.each(frm.doc.weft_output,function(i,d){
				out_dosage_weft += d.dosage
			})
			frm.set_value('out_dosage_weft',out_dosage_weft)
			if(frm.doc.out_dosage_weft ==100){
				frappe.validated = true;
			}
			else{
				frappe.validated = false;
				frappe.throw("Weft Output Dosage should be 100")
			}
		}

		if(frm.doc.warp_output_check){
			var out_dosage_warp = 0 
			$.each(frm.doc.warp_output,function(i,d){
				out_dosage_warp += d.dosage
			})
			frm.set_value('out_dosage_warp',out_dosage_warp)
			if(frm.doc.out_dosage_warp ==100){
				frappe.validated = true;
			}
			else{
				frappe.validated = false;
				frappe.throw("Warp Output Dosage should be 100")
			}
		}
		
		if(frm.doc.strip_output_check){
			var out_dosage_strip = 0 
			$.each(frm.doc.strip_output,function(i,d){
				out_dosage_strip += d.dosage
			})
			frm.set_value('out_dosage_strip',out_dosage_strip)
			if(frm.doc.out_dosage_strip ==100){
				frappe.validated = true;
			}
			else{
				frappe.validated = false;
				frappe.throw("Strip Output Dosage should be 100")
			}
		}

		

		
	}
})


frappe.ui.form.on('PB Cutting Raw Material', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"		
        $.each(frm.doc.lamination_output,function(i,j){
			if(j.type == "Output"){
				if(j.item_code == child.item_code){
					child.stock_qty = j.stock_qty
				}	
			}
		})
		frm.refresh_field('cutting_raw_material')
	},
	quantity_per_unit(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
                        if(child.unit == "Kg"){
                            if(j.uom == child.uom){
                                child.conversion_factor = j.conversion_factor
                                child.stock_qty = child.quantity_per_unit / j.conversion_factor
                            }
                        }
						if(child.unit == "Meter"){
                            $.each(frm.doc.lamination_output,function(i,j){
                                if(j.type == "Output"){
                                    if(j.item_code == child.item_code){
                                        child.stock_qty = j.stock_qty
                                    }	
                                }
                            })
                        }
					})
				}
			}
		});	
		
		frm.refresh_field('cutting_raw_material')
	}
})
frappe.ui.form.on('PB Weft Raw Material', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		frm.refresh_field('weft_raw_material')
	},
	final_dosage(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
        child.final_qty = (child.final_dosage/100) * frm.doc.total_quantity_weft
        child.final_amount = child.final_qty * child.rate
		child.quantity_per_unit = child.final_qty / frm.doc.order_quantity
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
        frm.refresh_field('weft_raw_material')
	},
	rate(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
        child.final_amount = child.final_qty * child.rate
		child.quantity_per_unit = child.final_qty / frm.doc.order_quantity
        frm.refresh_field('weft_raw_material')
	},
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('weft_raw_material')
	}
})
frappe.ui.form.on('PB Warp Raw Material', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		frm.refresh_field('warp_raw_material')
	},
	final_dosage(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
		child.uom = "Gram"	
        child.final_qty = (child.final_dosage/100) * frm.doc.total_quantity_warp
        child.final_amount = child.final_qty * child.rate
		child.quantity_per_unit = child.final_qty / frm.doc.order_quantity
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
        frm.refresh_field('warp_raw_material')
	},
	rate(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
        child.final_amount = child.final_qty * child.rate
		child.quantity_per_unit = child.final_qty / frm.doc.order_quantity
        frm.refresh_field('warp_raw_material')
	},
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('warp_raw_material')
	}
})
frappe.ui.form.on('PB Strip Raw Material', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		frm.refresh_field('strip_raw_material')
	},
	final_dosage(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
        child.final_qty = (child.final_dosage/100) * frm.doc.total_quantity_strip
        child.final_amount = child.final_qty * child.rate
		child.quantity_per_unit = child.final_qty / frm.doc.order_quantity
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
        frm.refresh_field('strip_raw_material')
	},
	rate(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
        child.final_amount = child.final_qty * child.rate
		child.quantity_per_unit = child.final_qty / frm.doc.order_quantity
        frm.refresh_field('strip_raw_material')
	},
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('strip_raw_material')
	}
})
frappe.ui.form.on('PB Lamination Raw Material', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		frm.refresh_field('lamination_raw_material')
	},
	// final_dosage(frm,cdt,cdn) {
	//     var child = locals[cdt][cdn]
	// 	child.uom = "Gram"
    //     child.final_qty = (child.final_dosage/100) * frm.doc.total_quantity_lamination
	// 	child.quantity_per_unit = child.final_qty / frm.doc.order_quantity
    //     child.final_amount = child.final_qty * child.rate
	// 	frappe.call({
	// 		method: "qpic.custom.get_item_conv_factor",
	// 		args: {
	// 			item_code: child.item_code
	// 		},
	// 		callback: function(r) {
	// 			if(r){
	// 				$.each(r.message,function(i,j){
	// 					if(j.uom == child.uom){
	// 						child.conversion_factor = j.conversion_factor
	// 						child.stock_qty = child.quantity_per_unit / j.conversion_factor
	// 					}
	// 				})
	// 			}
	// 		}
	// 	});
    //     frm.refresh_field('lamination_raw_material')
	// },
	// rate(frm,cdt,cdn) {
	//     var child = locals[cdt][cdn]
    //     child.final_amount = child.final_qty * child.rate
	// 	child.quantity_per_unit = child.final_qty / frm.doc.order_quantity
    //     frm.refresh_field('lamination_raw_material')
	// },
	// uom(frm,cdt,cdn){
	// 	var child = locals[cdt][cdn]
	// 	frappe.call({
	// 		method: "qpic.custom.get_item_conv_factor",
	// 		args: {
	// 			item_code: child.item_code
	// 		},
	// 		callback: function(r) {
	// 			if(r){
	// 				$.each(r.message,function(i,j){
	// 					if(j.uom == child.uom){
	// 						console.log(j.conversion_factor)
	// 						child.conversion_factor = j.conversion_factor
	// 						child.stock_qty = child.quantity_per_unit / j.conversion_factor
	// 					}
	// 				})
	// 			}
	// 		}
	// 	});
	// 	frm.refresh_field('lamination_raw_material')
	// }
})
frappe.ui.form.on('PB Liner Raw Material', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		frm.refresh_field('liner_raw_material')
	},
	final_dosage(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
		child.uom = "Gram"	
        child.final_qty = (child.final_dosage/100) * frm.doc.total_quantity_liner
        child.final_amount = child.final_qty * child.rate
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
        frm.refresh_field('liner_raw_material')
	},
	rate(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
        child.final_amount = child.final_qty * child.rate
        frm.refresh_field('liner_raw_material')
	},
    conversion_factor(frm,cdt,cdn){
		var child = locals[cdt][cdn]
        child.stock_qty = child.quantity_per_unit / child.conversion_factor
		frm.refresh_field('liner_raw_material')
    },
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / child.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('liner_raw_material')
	}
})
frappe.ui.form.on('PB Loom Raw Material', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('loom_raw_material')
	},
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('loom_raw_material')
	}
})


frappe.ui.form.on('PB Liner Output', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		frm.refresh_field('liner_output')
	},	
	dosage(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
		child.uom = "Gram"
        child.quantity_per_unit = (child.dosage/100) * frm.doc.liner_wt_per_unit
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
                        if(child.unit == "Kg"){
                            if(j.uom == child.uom){
                                console.log(j.conversion_factor)
                                child.conversion_factor = j.conversion_factor
                                child.stock_qty = child.quantity_per_unit / j.conversion_factor
                            }
                        }
						if(child.unit == "Meter"){
                            child.conversion_factor = 0.001
                            child.stock_qty = child.quantity_per_unit *1000
                        }
					})
				}
			}
		});
        frm.refresh_field('liner_output')
	},
})

frappe.ui.form.on('PB Loom Output', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		if(child.type == "Output"){
			frappe.call({
				method: "qpic.custom.get_tech_sheet_name",
				args: {
					'sales_order': frm.doc.sales_order
				},
				callback: function(r) {
					if(r){
						$.each(r,function(i,j){
							frappe.db.get_value('Quotation',j.prevdoc_docname,'technical_sheet_sb')
							.then(r => {
								var tech = r.message.technical_sheet_sb
								frappe.db.get_value('Technical Sheet SB',tech,'fabric_gms')
								.then(r => {
									var tec = r.message.fabric_gms
									child.stock_qty = tec
								})
							})
						})
					}
				}
			});
		}
		if(child.type == "Scrap"){
			// $.each(frm.doc.loom_raw_material,function(i,s){
			// 	child.qty = s.quantity_per_unit-(60.31/1000)
			// 	// console.log(child.qty)
			// })
			$.each(frm.doc.loom_output,function(i,j){
				if(j.type == "Output"){
					$.each(frm.doc.loom_raw_material,function(i,k){
						var ab = k.quantity_per_unit - (j.stock_qty/1000) 
						console.log(ab)
						child.quantity_per_unit = ab
					})
				}
			})
		}

		
		child.uom = "Gram"	
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});

		frm.refresh_field('loom_output')
	},
	// dosage(frm,cdt,cdn) {
	//     var child = locals[cdt][cdn]
    //     child.qty = (child.dosage/100) * frm.doc.total_quantity_loom
	// 	child.quantity_per_unit = child.qty / frm.doc.order_quantity	
    //     frm.refresh_field('loom_output')
	// frappe.call({
	// 	method: "qpic.custom.get_item_conv_factor",
	// 	args: {
	// 		item_code: child.item_code
	// 	},
	// 	callback: function(r) {
	// 		if(r){
	// 			$.each(r.message,function(i,j){
	// 				if(j.uom == child.uom){
	// 					console.log(j.conversion_factor)
	// 					child.conversion_factor = j.conversion_factor
	// 					child.stock_qty = child.quantity_per_unit / j.conversion_factor
	// 				}
	// 			})
	// 		}
	// 	}
	// });
	// },
	quantity_per_unit(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		$.each(frm.doc.lamination_raw_material,function(i,s){
			if(child.item_code == s.item_code){
				s.quantity_per_unit = child.quantity_per_unit
				s.stock_qty = child.stock_qty
			}
		})
		frm.refresh_field("lamination_raw_material")
	},
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('loom_output')
	}
})
frappe.ui.form.on('PB Cutting Output', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
        var total = 0 
        $.each(frm.doc.cutting_raw_material,function(i,j){
            total += j.stock_qty
        })
        child.stock_qty = total
		frm.refresh_field('cutting_output')
	},
	quantity_per_unit(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							// child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('cutting_output')
	},
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('cutting_output')
	}
})
frappe.ui.form.on('PB Stitching Output', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		var tot = 0 
        $.each(frm.doc.stitching_raw_material,function(i,d){
            tot += d.stock_qty
        })
        child.stock_qty = tot
		frm.refresh_field('stitching_output')
	},
})
frappe.ui.form.on('PB Lamination Output', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"
		if(child.type == "Scrap"){
			child.quantity_per_unit=frm.doc.lam_total
			frappe.call({
				method: "qpic.custom.get_item_conv_factor",
				args: {
					item_code: child.item_code
				},
				callback: function(r) {
					if(r){
						$.each(r.message,function(i,j){
							if(j.uom == child.uom){
								console.log(j.conversion_factor)
								child.conversion_factor = j.conversion_factor
								child.stock_qty = child.quantity_per_unit / j.conversion_factor
							}
						})
					}
				}
			});
		}
		
		frm.refresh_field('lamination_output')
	},
	quantity_per_unit(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		if(child.type == "Output"){
			child.stock_qty = frm.doc.lam_wt_per_unit*1000
		}
		frm.refresh_field('lamination_output')
	},
	
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('lamination_output')
	}
})
frappe.ui.form.on('PB Strip Output', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		frm.refresh_field('strip_output')
	},
	dosage(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
        child.qty = (child.dosage/100) * frm.doc.total_quantity_strip
		child.quantity_per_unit = child.qty / frm.doc.order_quantity
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
        frm.refresh_field('strip_output')
	},
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('strip_output')
	}
})
frappe.ui.form.on('PB Warp Output', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		frm.refresh_field('warp_output')
	},
	dosage(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
        child.qty = (child.dosage/100) * frm.doc.total_quantity_warp
		child.quantity_per_unit = child.qty / frm.doc.order_quantity
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
        frm.refresh_field('warp_output')
	},
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('warp_output')
	}
})
frappe.ui.form.on('PB Weft Output', {
	item_code(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		child.uom = "Gram"	
		frm.refresh_field('weft_output')
	},
	dosage(frm,cdt,cdn) {
	    var child = locals[cdt][cdn]
        child.qty = (child.dosage/100) * frm.doc.total_quantity_weft
		child.quantity_per_unit = child.qty / frm.doc.order_quantity
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
        frm.refresh_field('weft_output')
	},
	uom(frm,cdt,cdn){
		var child = locals[cdt][cdn]
		frappe.call({
			method: "qpic.custom.get_item_conv_factor",
			args: {
				item_code: child.item_code
			},
			callback: function(r) {
				if(r){
					$.each(r.message,function(i,j){
						if(j.uom == child.uom){
							console.log(j.conversion_factor)
							child.conversion_factor = j.conversion_factor
							child.stock_qty = child.quantity_per_unit / j.conversion_factor
						}
					})
				}
			}
		});
		frm.refresh_field('weft_output')
	}
})