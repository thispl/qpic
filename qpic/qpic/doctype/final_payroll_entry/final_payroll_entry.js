// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Final Payroll Entry', {
	onload(frm){
		var grade_list = ["Labour","Office Staff","Factory Staff"]
		if(!frm.doc.__islocal){
			
			frappe.call({
				method: "qpic.qpic.doctype.final_payroll_entry.final_payroll_entry.final_html_view",
				args:{
					'from_date':frm.doc.from_date,
					'to_date':frm.doc.to_date,
					'grade':grade_list[1]
				},
				freeze:true,
				freeze_message: __("Generating Summary"),
				callback: function(r) {
					if(r.message) {
					
	                  	var	basic_lr = r.message[0]
						var	earned_basic_lr = r.message[2]
						var overtime_lr = r.message[3]
						var wot_lr = r.message[4]
						var hot_lr = r.message[5]
						var tot_lr = r.message[6]
						var hra_lr = r.message[7]
						var ca_lr = r.message[8]
						var mobile_allowance_lr = r.message[9]
						var monthly_allowance_lr = r.message[10]
						var food_allowance_lr = r.message[11]
						var production_incentive_lr = r.message[12]
						var arrear_lr = r.message[13]
						var vacation_lr = r.message[21]
						var air_fair_allowance_lr = r.message[23]
						var gross_pay_lr = r.message[15]
						var loan_lr = r.message[16]
						var advance_lr = r.message[17]
						var other_deduction_lr = r.message[18]
						var total_deduction_lr = r.message[19]
						var net_pay_lr = r.message[20]
						var medical_allowance_lr =  r.message[22]
			frappe.call({
				method: "qpic.qpic.doctype.final_payroll_entry.final_payroll_entry.final_html_view",
				args:{
					'from_date':frm.doc.from_date,
					'to_date':frm.doc.to_date,
					'grade':grade_list[0]
				},
				freeze:true,
				freeze_message: __("Generating Summary"),
				callback: function(d) {
					if(d.message) {
						// console.log(d.message)

						var	basic_os = d.message[0]
						var earned_basic_os = d.message[2]
						var overtime_os = d.message[3]
						var wot_os = d.message[4]
						var hot_os = d.message[5]
						var tot_os =  Math.round(d.message[6])
						var hra_os = d.message[7]
						var ca_os = d.message[8]
						var mobile_allowance_os = d.message[9]
						var monthly_allowance_os = d.message[10]
						var food_allowance_os = d.message[11]
						var production_incentive_os = d.message[12]
						var arrear_os = d.message[13]
						var vacation_os = d.message[21]
						var air_fair_allowance_os = d.message[23]
						var gross_pay_os = d.message[15]
						var loan_os = d.message[16]
						var advance_os = d.message[17]
						var other_deduction_os = d.message[18]
						var total_deduction_os = d.message[19]
						var net_pay_os = d.message[20] 
						var medical_allowance_os =  d.message[22]

			frappe.call({
				method: "qpic.qpic.doctype.final_payroll_entry.final_payroll_entry.final_html_view",
				args:{
					'from_date':frm.doc.from_date,
					'to_date':frm.doc.to_date,
					'grade':grade_list[2]
				},
				freeze:true,
				freeze_message: __("Generating Summary"),
				callback: function(f) {
					if(f.message) {
					
	
					
						var	basic_fs = f.message[0]
						var earned_basic_fs = f.message[2]
						var overtime_fs = f.message[3]
						var wot_fs = f.message[4]
						var hot_fs = f.message[5]
						var tot_fs = f.message[6]
						var hra_fs = f.message[7]
						var ca_fs = f.message[8]
						var mobile_allowance_fs = f.message[9]
						var monthly_allowance_fs = f.message[10]
						var food_allowance_fs = f.message[11]
						var production_incentive_fs = f.message[12]
						var arrear_fs = f.message[13]
						var vacation_fs = f.message[21]
						var air_fair_allowance_fs = f.message[23]
						var gross_pay_fs = f.message[15]
						var loan_fs = f.message[16]
						var advance_fs = f.message[17]
						var other_deduction_fs = f.message[18]
						var total_deduction_fs = f.message[19]
						var net_pay_fs = f.message[20] 
						var medical_allowance_fs =  f.message[22]

			frappe.call({
				method: "qpic.qpic.doctype.final_payroll_entry.final_payroll_entry.final_html_view",
				args:{
					'from_date':"2022-09-01",
					'to_date':"2022-09-31",
					'grade':grade_list[1]
				},
				callback: function(g) {
					if(g.message) {
						console.log(g.message)

						var	basic_lr_pm = g.message[0]
						var	earned_basic_lr_pm = g.message[2]
						var overtime_lr_pm = g.message[3]
						var wot_lr_pm = g.message[4]
						var hot_lr_pm = g.message[5]
						var tot_lr_pm = g.message[6]
						var hra_lr_pm = g.message[7]
						var ca_lr_pm = g.message[8]
						var mobile_allowance_lr_pm = g.message[9]
						var monthly_allowance_lr_pm = g.message[10]
						var food_allowance_lr_pm = g.message[11]
						var production_incentive_lr_pm = g.message[12]
						var arrear_lr_pm = g.message[13]
						var vacation_lr_pm = g.message[21]
						var air_fair_allowance_lr_pm = g.message[23]
						var gross_pay_lr_pm = g.message[15]
						var loan_lr_pm = g.message[16]
						var advance_lr_pm = g.message[17]
						var other_deduction_lr_pm = g.message[18]
						var total_deduction_lr_pm = g.message[19]
						var net_pay_lr_pm = g.message[20] 
						var medical_allowance_lr_pm =  g.message[22]

			frappe.call({
				method: "qpic.qpic.doctype.final_payroll_entry.final_payroll_entry.final_html_view",
				args:{
					'from_date':"2022-09-01",
					'to_date':"2022-09-31",
					'grade':grade_list[0]
				},
				freeze:true,
				freeze_message: __("Generating Summary"),
				callback: function(a) {
					if(g.message) {
						console.log(a.message)


						var	basic_os_pm = a.message[0]
						var earned_basic_os_pm = a.message[2]
						var overtime_os_pm = a.message[3]
						var wot_os_pm = a.message[4]
						var hot_os_pm = a.message[5]
						var tot_os_pm = a.message[6]
						var hra_os_pm = a.message[7]
						var ca_os_pm = a.message[8]
						var mobile_allowance_os_pm = a.message[9]
						var monthly_allowance_os_pm = a.message[10]
						var food_allowance_os_pm = a.message[11]
						var production_incentive_os_pm = a.message[12]
						var arrear_os_pm = a.message[13]
						var vacation_os_pm = a.message[21]
						var air_fair_allowance_os_pm = a.message[23]
						var gross_pay_os_pm = a.message[15]
						var loan_os_pm = a.message[16]
						var advance_os_pm = a.message[17]
						var other_deduction_os_pm = a.message[18]
						var total_deduction_os_pm = a.message[19]
						var net_pay_os_pm = a.message[20] 
						var medical_allowance_os_pm =  a.message[22]

						frappe.call({
							method: "qpic.qpic.doctype.final_payroll_entry.final_payroll_entry.final_html_view",
							args:{
								'from_date':"2022-09-01",
								'to_date':"2022-09-31",
								'grade':grade_list[2]
							},
							callback: function(c) {
								if(c.message) {
									// console.log(f.message)
					
	
					
						var	basic_fs_pm = c.message[0]
						var earned_basic_fs_pm = c.message[2]
						var overtime_fs_pm = c.message[3]
						var wot_fs_pm = c.message[4]
						var hot_fs_pm = c.message[5]
						var tot_fs_pm = c.message[6]
						var hra_fs_pm = c.message[7]
						var ca_fs_pm = c.message[8]
						var mobile_allowance_fs_pm = c.message[9]
						var monthly_allowance_fs_pm = c.message[10]
						var food_allowance_fs_pm = c.message[11]
						var production_incentive_fs_pm = c.message[12]
						var arrear_fs_pm = c.message[13]
						var vacation_fs_pm = c.message[21]
						var air_fair_allowance_fs_pm = c.message[23]
						var gross_pay_fs_pm = c.message[15]
						var loan_fs_pm = c.message[16]
						var advance_fs_pm = c.message[17]
						var other_deduction_fs_pm = c.message[18]
						var total_deduction_fs_pm = c.message[19]
						var net_pay_fs_pm = c.message[20] 
						var medical_allowance_fs_pm =  c.message[22]


		if(frm.doc.grade == "Office Staff"){
					frm.fields_dict.preview.$wrapper.append("<h4>Preview</h4><table class='table table-bordered' style = width:30%; border: 1px solid black>" +
					"<tr> <td rowspan = 2 style = width:25%;text-align:center;background-color:#3431e0;color:white>Components</td><td colspan = 3 style = width:25%;text-align:center;background-color:#3431e0;color:white>Current Month</td><td  colspan = 3 style = width:25%;text-align:center;background-color:#3431e0;color:white>Previous Month</td></tr>"+			
					"<td style = width:25%;text-align:center;background-color:#3431e0;color:white>Office Staff<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Labour<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Factory Staff<br>(QAR)</br></td> <td style = width:25%;text-align:center;background-color:#3431e0;color:white>Office Staff<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Labour<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Factory Staff<br>(QAR)</br></td>  </tr>"+
				"<tr><td>Basic</td><td style=text-align:right;background-color:#66ffff><b>"+ earned_basic_lr +"</b></b></td> <td style=text-align:right>"+ earned_basic_os +"</td> <td style=text-align:right>"+ earned_basic_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+ earned_basic_lr_pm +"</b></td> <td style=text-align:right>"+ earned_basic_os_pm +"</td> <td style=text-align:right>"+ earned_basic_fs_pm +"</td></tr>"+
		"<tr><td>Overtime</td><td style=text-align:right;background-color:#66ffff><b>"+overtime_lr +"</b></td> <td style=text-align:right>"+overtime_os +"</td> <td style=text-align:right>"+overtime_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+overtime_lr_pm +"</b></td> <td style=text-align:right>"+overtime_os_pm +"</td> <td style=text-align:right>"+overtime_fs_pm +"</td> </tr>"+
		"<tr><td>TOT</td><td style=text-align:right;background-color:#66ffff><b>"+tot_lr+"</td> <td style=text-align:right>"+tot_os+"</td> <td style=text-align:right>"+tot_fs+"</td> <td style=text-align:right;background-color:#66ffff><b>"+tot_lr_pm +"</b></td> <td style=text-align:right>"+tot_os_pm +"</td> <td style=text-align:right>"+tot_fs_pm+"</td></tr>"+
		"<tr><td>HRA</td><td style=text-align:right;background-color:#66ffff><b>"+hra_lr+"</td> <td style=text-align:right>"+hra_os+"</td> <td style=text-align:right>"+hra_fs+"</td> <td style=text-align:right;background-color:#66ffff><b>"+hra_lr_pm +"</b></td> <td style=text-align:right>"+hra_os_pm +"</td> <td style=text-align:right>"+hra_fs_pm+"</td></tr>"+
		"<tr><td>CA</td><td style=text-align:right;background-color:#66ffff><b>"+ca_lr +"</b></td> <td style=text-align:right>"+ca_os +"</td> <td style=text-align:right>"+ca_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+ca_lr_pm +"</b></td> <td style=text-align:right>"+ca_os_pm +"</td> <td style=text-align:right>"+ca_fs_pm +"</td></tr>"+
		"<tr><td>Mobile Allowance</td><td style=text-align:right;background-color:#66ffff><b>"+mobile_allowance_lr +"</b></td> <td style=text-align:right>"+mobile_allowance_os +"</td> <td style=text-align:right>"+mobile_allowance_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+mobile_allowance_lr_pm +"</b></td> <td style=text-align:right>"+mobile_allowance_os_pm +"</td> <td style=text-align:right>"+mobile_allowance_fs_pm +"</td> </tr>"+
		"<tr><td>Monthly Allowance</td><td style=text-align:right;background-color:#66ffff><b>"+monthly_allowance_lr +"</b></td> <td style=text-align:right>"+monthly_allowance_os +"</td> <td style=text-align:right>"+monthly_allowance_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+monthly_allowance_lr_pm +"</b></td> <td style=text-align:right>"+monthly_allowance_os_pm +"</td> <td style=text-align:right>"+monthly_allowance_fs_pm +"</td></tr>"+
		"<tr><td>Food Allowance</td><td style=text-align:right;background-color:#66ffff><b>"+food_allowance_lr +"</b></td> <td style=text-align:right>"+food_allowance_os +"</td> <td style=text-align:right>"+food_allowance_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+food_allowance_lr_pm +"</b></td> <td style=text-align:right>"+food_allowance_os_pm +"</td> <td style=text-align:right>"+food_allowance_fs_pm +"</td> </tr>"+
		"<tr><td>Production Incentive</td><td style=text-align:right;background-color:#66ffff><b>"+production_incentive_lr +"</b></td> <td style=text-align:right>"+production_incentive_os +"</td> <td style=text-align:right>"+production_incentive_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+production_incentive_lr_pm +"</b></td> <td style=text-align:right>"+production_incentive_os_pm +"</td> <td style=text-align:right>"+production_incentive_fs_pm +"</td></tr>"+
		"<tr><td>Arrear</td><td style=text-align:right;background-color:#66ffff><b>"+arrear_lr +"</b></td> <td style=text-align:right>"+arrear_os +"</td> <td style=text-align:right>"+arrear_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+arrear_lr_pm +"</b></td> <td style=text-align:right>"+arrear_os_pm +"</td> <td style=text-align:right>"+arrear_fs_pm +"</td></tr>"+
		"<tr><td>Air Ticket Allowance</td><td style=text-align:right;background-color:#66ffff><b>"+air_fair_allowance_lr +"</b></td> <td style=text-align:right>"+air_fair_allowance_os +"</td> <td style=text-align:right>"+air_fair_allowance_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+air_fair_allowance_lr_pm +"</b></td> <td style=text-align:right>"+air_fair_allowance_os_pm +"</td> <td style=text-align:right>"+air_fair_allowance_fs_pm +"</td></tr>"+
		"<tr><td>Medical Allowance</td><td style=text-align:right;background-color:#66ffff><b>"+medical_allowance_lr +"</b></td> <td style=text-align:right>"+medical_allowance_os +"</td> <td style=text-align:right>"+medical_allowance_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+medical_allowance_lr_pm +"</b></td> <td style=text-align:right>"+medical_allowance_os_pm +"</td> <td style=text-align:right>"+medical_allowance_fs_pm +"</td></tr>"+
		"<tr><td>Loan</td><td style=text-align:right;background-color:#66ffff><b>"+loan_lr+"</b></td> <td style=text-align:right>"+loan_os+"</td> <td style=text-align:right>"+loan_fs+"</td> <td style=text-align:right;background-color:#66ffff><b>"+loan_lr_pm +"</b></td> <td style=text-align:right>"+loan_os_pm+"</td> <td style=text-align:right>"+loan_fs_pm+"</td></tr>"+
		"<tr><td>Other Deduction</td><td style=text-align:right;background-color:#66ffff><b>"+other_deduction_lr +"</b></td> <td style=text-align:right>"+other_deduction_os +"</td> <td style=text-align:right>"+other_deduction_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+other_deduction_lr_pm+"</td> <td style=text-align:right>"+other_deduction_os_pm +"</td> <td style=text-align:right>"+other_deduction_fs_pm +"</td></tr>"+
		"<tr><td>Total Deduction</td><td style=text-align:right;background-color:#66ffff><b>"+total_deduction_lr +"</b></td> <td style=text-align:right>"+total_deduction_os +"</td> <td style=text-align:right>"+total_deduction_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+total_deduction_lr_pm +"</b></td> <td style=text-align:right>"+total_deduction_os_pm +"</td> <td style=text-align:right>"+total_deduction_fs_pm +"</td></tr>"+
		"<tr><td>Net Pay</td><td style=text-align:right;background-color:#66ffff><b>"+net_pay_lr +"</b></td> <td style=text-align:right>"+net_pay_os +"</td> <td style=text-align:right>"+net_pay_fs +"</td> <td style=text-align:right;background-color:#66ffff><b>"+net_pay_lr_pm +"</b></td> <td style=text-align:right>"+net_pay_os_pm +"</td> <td style=text-align:right>"+net_pay_fs_pm +"</td></tr>"+

		"</table>")
						}
		else if(frm.doc.grade == "Factory Staff"){
		frm.fields_dict.preview.$wrapper.append("<h4>Preview</h4><table class='table table-bordered' style = width:30%; border: 1px solid black>" +
		"<tr> <td rowspan = 2 style = width:25%;text-align:center;background-color:#3431e0;color:white>Components</td><td colspan = 3 style = width:25%;text-align:center;background-color:#3431e0;color:white>Current Month</td><td  colspan = 3 style = width:25%;text-align:center;background-color:#3431e0;color:white>Previous Month</td></tr>"+			
		"<td style = width:25%;text-align:center;background-color:#3431e0;color:white>Office Staff<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Labour<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Factory Staff<br>(QAR)</br></td> <td style = width:25%;text-align:center;background-color:#3431e0;color:white>Office Staff<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Labour<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Factory Staff<br>(QAR)</br></td>  </tr>"+
		"<tr><td>Basic</td><td style=text-align:right>"+ earned_basic_lr +"</td> <td style=text-align:right>"+ earned_basic_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+ earned_basic_fs +"</b></td> <td style=text-align:right>"+ earned_basic_lr_pm +"</td> <td style=text-align:right>"+ earned_basic_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+ earned_basic_fs_pm +"</b></td></tr>"+
		"<tr><td>Overtime</td><td style=text-align:right>"+overtime_lr +"</td> <td style=text-align:right>"+overtime_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+overtime_fs +"</b></td> <td style=text-align:right>"+overtime_lr_pm +"</td> <td style=text-align:right>"+overtime_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+overtime_fs_pm +"</b></td> </tr>"+
		"<tr><td>TOT</td><td style=text-align:right>"+tot_lr+"</td> <td style=text-align:right>"+tot_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+tot_fs +"</b></td> <td style=text-align:right>"+tot_lr_pm+"</td> <td style=text-align:right>"+tot_os_pm+"</td> <td style=text-align:right;background-color:#66ffff><b>"+tot_fs_pm +"</b></td></tr>"+
		"<tr><td>HRA</td><td style=text-align:right>"+hra_lr+"</td> <td style=text-align:right>"+hra_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+hra_fs +"</b></td> <td style=text-align:right>"+hra_lr_pm+"</td> <td style=text-align:right>"+hra_os_pm+"</td> <td style=text-align:right;background-color:#66ffff><b>"+hra_fs_pm +"</b></td></tr>"+
		"<tr><td>Mobile Allowance</td><td style=text-align:right>"+mobile_allowance_lr +"</td> <td style=text-align:right>"+mobile_allowance_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+mobile_allowance_fs +"</b></td> <td style=text-align:right>"+mobile_allowance_lr_pm +"</td> <td style=text-align:right>"+mobile_allowance_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+mobile_allowance_fs_pm +"</b></td> </tr>"+
		"<tr><td>Monthly Allowance</td><td style=text-align:right>"+monthly_allowance_lr +"</td> <td style=text-align:right>"+monthly_allowance_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+monthly_allowance_fs +"</b></td> <td style=text-align:right>"+monthly_allowance_lr_pm +"</td> <td style=text-align:right>"+monthly_allowance_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+monthly_allowance_fs_pm +"</b></td></tr>"+
		"<tr><td>Food Allowance</td><td style=text-align:right>"+food_allowance_lr +"</td> <td style=text-align:right>"+food_allowance_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+food_allowance_fs +"</b></td> <td style=text-align:right>"+food_allowance_lr_pm +"</td> <td style=text-align:right>"+food_allowance_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+food_allowance_fs_pm +"</b></td> </tr>"+
		"<tr><td>Production Incentive</td><td style=text-align:right>"+production_incentive_lr +"</td> <td style=text-align:right>"+production_incentive_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+production_incentive_fs +"</b></td> <td style=text-align:right>"+production_incentive_lr_pm +"</td> <td style=text-align:right>"+production_incentive_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+production_incentive_fs_pm +"</b></td></tr>"+
		"<tr><td>Arrear</td><td style=text-align:right>"+arrear_lr +"</td> <td style=text-align:right>"+arrear_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+arrear_fs +"</b></td> <td style=text-align:right>"+arrear_lr_pm +"</td> <td style=text-align:right>"+arrear_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+arrear_fs_pm +"</b></td></tr>"+
		"<tr><td>Air Ticket Allowance</td><td style=text-align:right>"+air_fair_allowance_lr +"</td> <td style=text-align:right>"+air_fair_allowance_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+air_fair_allowance_fs +"</b></td> <td style=text-align:right>"+air_fair_allowance_lr_pm +"</td> <td style=text-align:right>"+air_fair_allowance_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+air_fair_allowance_fs_pm +"</b></td></tr>"+
		"<tr><td>Medical Allowance</td><td style=text-align:right>"+medical_allowance_lr +"</td> <td style=text-align:right>"+medical_allowance_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+medical_allowance_fs +"</b></td> <td style=text-align:right>"+medical_allowance_lr_pm +"</td> <td style=text-align:right>"+medical_allowance_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+medical_allowance_fs_pm +"</b></td></tr>"+
		"<tr><td>Loan</td><td style=text-align:right>"+loan_lr+"</td> <td style=text-align:right>"+loan_os+"</td> <td style=text-align:right;background-color:#66ffff><b>"+loan_fs +"</b></td> <td style=text-align:right>"+loan_lr_pm+"</td> <td style=text-align:right>"+loan_os_pm+"</td> <td style=text-align:right;background-color:#66ffff><b>"+loan_fs_pm+"</td></tr>"+
		"<tr><td>Other Deduction</td><td style=text-align:right>"+other_deduction_lr +"</td> <td style=text-align:right>"+other_deduction_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+other_deduction_fs +"</b></td> <td style=text-align:right>"+other_deduction_lr_pm+"</td> <td style=text-align:right>"+other_deduction_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+other_deduction_fs_pm +"</b></td></tr>"+
		"<tr><td>Total Deduction</td><td style=text-align:right>"+total_deduction_lr +"</td> <td style=text-align:right>"+total_deduction_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+total_deduction_fs +"</b></td> <td style=text-align:right>"+total_deduction_lr_pm +"</td> <td style=text-align:right>"+total_deduction_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+total_deduction_fs_pm +"</b></td></tr>"+
		"<tr><td>Net Pay</td><td style=text-align:right>"+net_pay_lr +"</td> <td style=text-align:right>"+net_pay_os +"</td> <td style=text-align:right;background-color:#66ffff><b>"+net_pay_fs +"</b></td> <td style=text-align:right>"+net_pay_lr_pm +"</td> <td style=text-align:right>"+net_pay_os_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+net_pay_fs_pm +"</b></td></tr>"+

		"</table>")
						}
		else{
			frm.fields_dict.preview.$wrapper.append("<h4>Preview</h4><table class='table table-bordered' style = width:30%; border: 1px solid black>" +
			"<tr> <td rowspan = 2 style = width:25%;text-align:center;background-color:#3431e0;color:white>Components</td><td colspan = 3 style = width:25%;text-align:center;background-color:#3431e0;color:white>Current Month</td><td  colspan = 3 style = width:25%;text-align:center;background-color:#3431e0;color:white>Previous Month</td></tr>"+			
			"<td style = width:25%;text-align:center;background-color:#3431e0;color:white>Office Staff<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Labour<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Factory Staff<br>(QAR)</br></td> <td style = width:25%;text-align:center;background-color:#3431e0;color:white>Office Staff<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Labour<br>(QAR)</br></td><td style = width:25%;text-align:center;background-color:#3431e0;color:white>Factory Staff<br>(QAR)</br></td>  </tr>"+
		"<tr><td>Basic</td><td style=text-align:right>" +earned_basic_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+ earned_basic_os +"</b></td> <td style=text-align:right>"+ earned_basic_fs +"</td> <td style=text-align:right>"+ earned_basic_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+ earned_basic_os_pm +"</b></td> <td style=text-align:right>"+ earned_basic_fs_pm +"</td></tr>"+
		"<tr><td>Overtime</td><td style=text-align:right>"+overtime_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+overtime_os +"</b></td> <td style=text-align:right>"+overtime_fs +"</td> <td style=text-align:right>"+overtime_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+overtime_os_pm +"</b></td> <td style=text-align:right>"+overtime_fs_pm +"</td> </tr>"+
		"<tr><td>TOT</td><td style=text-align:right>"+tot_lr+"</td> <td style=text-align:right;background-color:#66ffff><b>"+tot_os +"</b></td> <td style=text-align:right>"+tot_fs+"</td> <td style=text-align:right>"+tot_lr_pm+"</td> <td style=text-align:right;background-color:#66ffff><b>"+tot_os_pm +"</b></td> <td style=text-align:right>"+tot_fs_pm +"</td></tr>"+
		"<tr><td>HRA</td><td style=text-align:right>"+hra_lr+"</td> <td style=text-align:right;background-color:#66ffff><b>"+hra_os +"</b></td> <td style=text-align:right>"+hra_fs+"</td> <td style=text-align:right>"+hra_lr_pm+"</td> <td style=text-align:right;;background-color:#66ffff><b>"+hra_os_pm +"</b></td> <td style=text-align:right>"+hra_fs_pm +"</td></tr>"+
		"<tr><td>Mobile Allowance</td><td style=text-align:right>"+mobile_allowance_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+mobile_allowance_os +"</b></td> <td style=text-align:right>"+mobile_allowance_fs +"</td> <td style=text-align:right>"+mobile_allowance_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+mobile_allowance_os_pm +"</b></td> <td style=text-align:right>"+mobile_allowance_fs_pm +"</td> </tr>"+
		"<tr><td>Monthly Allowance</td><td style=text-align:right>"+monthly_allowance_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+monthly_allowance_os +"</b></td> <td style=text-align:right>"+monthly_allowance_fs +"</td> <td style=text-align:right>"+monthly_allowance_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+monthly_allowance_os_pm +"</b></td> <td style=text-align:right>"+monthly_allowance_fs_pm +"</td></tr>"+
		"<tr><td>Food Allowance</td><td style=text-align:right>"+food_allowance_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+food_allowance_os +"</b></td> <td style=text-align:right>"+food_allowance_fs +"</td> <td style=text-align:right>"+food_allowance_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+food_allowance_os_pm +"</b></td> <td style=text-align:right>"+food_allowance_fs_pm +"</td> </tr>"+
		"<tr><td>Production Incentive</td><td style=text-align:right>"+production_incentive_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+production_incentive_os +"</b></td> <td style=text-align:right>"+production_incentive_fs +"</td> <td style=text-align:right>"+production_incentive_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+production_incentive_os_pm +"</b></td> <td style=text-align:right>"+production_incentive_fs_pm +"</td></tr>"+
		"<tr><td>Arrear</td><td style=text-align:right>"+arrear_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+arrear_os +"</b></td> <td style=text-align:right>"+arrear_fs +"</td> <td style=text-align:right>"+arrear_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+arrear_os_pm +"</b></td> <td style=text-align:right>"+arrear_fs_pm +"</td></tr>"+
		"<tr><td>Air Ticket Allowance</td><td style=text-align:right>"+air_fair_allowance_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+air_fair_allowance_os +"</b></td> <td style=text-align:right>"+air_fair_allowance_fs +"</td> <td style=text-align:right>"+air_fair_allowance_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+air_fair_allowance_os_pm +"</b></td> <td style=text-align:right>"+air_fair_allowance_fs_pm +"</td></tr>"+
		"<tr><td>Medical Allowance</td><td style=text-align:right>"+medical_allowance_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+medical_allowance_os +"</b></td> <td style=text-align:right>"+medical_allowance_fs +"</td> <td style=text-align:right>"+medical_allowance_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+medical_allowance_os_pm +"</b></td> <td style=text-align:right>"+medical_allowance_fs_pm +"</td></tr>"+
		"<tr><td>Loan</td><td style=text-align:right>"+loan_lr+"</td> <td style=text-align:right;background-color:#66ffff><b>"+loan_os +"</b></td> <td style=text-align:right>"+loan_fs+"</td> <td style=text-align:right>"+loan_lr_pm+"</td> <td style=text-align:right;background-color:#66ffff><b>"+loan_os_pm +"</b></td> <td style=text-align:right>"+loan_fs_pm+"</td></tr>"+
		"<tr><td>Other Deduction</td><td style=text-align:right>"+other_deduction_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+other_deduction_os +"</b></td> <td style=text-align:right>"+other_deduction_fs +"</td> <td style=text-align:right>"+other_deduction_lr_pm+"</td> <td style=text-align:right;background-color:#66ffff><b>"+other_deduction_os_pm +"</b></td> <td style=text-align:right>"+other_deduction_fs_pm +"</td></tr>"+
		"<tr><td>Total Deduction</td><td style=text-align:right>"+total_deduction_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+total_deduction_os +"</b></td> <td style=text-align:right>"+total_deduction_fs +"</td> <td style=text-align:right>"+total_deduction_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+total_deduction_os_pm +"</b></td> <td style=text-align:right>"+total_deduction_fs_pm +"</td></tr>"+
		"<tr><td>Net Pay</td><td style=text-align:right>"+net_pay_lr +"</td> <td style=text-align:right;background-color:#66ffff><b>"+net_pay_os +"</b></td> <td style=text-align:right>"+net_pay_fs +"</td> <td style=text-align:right>"+net_pay_lr_pm +"</td> <td style=text-align:right;background-color:#66ffff><b>"+net_pay_os_pm +"</b></td> <td style=text-align:right>"+net_pay_fs_pm +"</td></tr>"+

		"</table>")
		}
	}
}
});
}
}
});
	}
}
});
	}
}
});
	}
}
});
					}
				}
			});
		}
		},
		
		
		
// )},

	download: function (frm) {
		
		if (frm.doc.from_date) {
			var path = "qpic.qpic.doctype.final_payroll_entry.salary_register.download"
			var args = 'from_date=%(from_date)s&to_date=%(to_date)s&grade=%(grade)s'
		}

		if (path) {
			window.location.href = repl(frappe.request.url +
				'?cmd=%(cmd)s&%(args)s', {
				cmd: path,
				args: args,
				date: frm.doc.date,
				from_date : frm.doc.from_date,
				to_date : frm.doc.to_date,	
				department : frm.doc.department,
				grade : frm.doc.grade
			});
		}
		
	},
	download_wps: function (frm) {
		if (frm.doc.from_date) {
			var path = "qpic.qpic.doctype.final_payroll_entry.wps_report.download"
			var args = 'from_date=%(from_date)s&to_date=%(to_date)s&company=%(company)s'
		}
		

		if (path) {
			window.location.href = repl(frappe.request.url +
				'?cmd=%(cmd)s&%(args)s', {
				cmd: path,
				args: args,
				date: frm.doc.date,
				from_date : frm.doc.from_date,
				to_date : frm.doc.to_date,	
				division : frm.doc.division,
				department : frm.doc.department,
				grade : frm.doc.grade,
				company:frm.doc.company
			});
		}
	},
	// onload(frm){
	// 	if(frm.doc.payroll_entry){
	// 		frm.set_value('date',new Date())
	// 		frm.refresh()
	// 	}
	// }

});
