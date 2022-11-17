// Copyright (c) 2022, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Attendance Register LABOUR"] = {
	"filters": [
		{
			"fieldname": "from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"reqd": 1
		},
		{
			"fieldname": "to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"reqd": 1
		},
		{
			"fieldname": "employee",
			"label": __("Employee"),
			"fieldtype": "Link",
			"options": "Employee",
		},
		{
			"fieldname": "grade",
			"label": __("Grade"),
			"fieldtype": "Link",
			// 'default':frappe.defaults.get_user_default('Labour'),

			"options": "Employee Grade",
		},
		{
			"fieldname": "department",
			"label": __("Department"),
			"fieldtype": "Link",
			"options": "Department",
		},
	],
	onload: function (report) {
		var to_date = frappe.query_report.get_filter('to_date');
		// to_date.set_input(frappe.datetime.add_days(frappe.datetime.month_start(), ))
		to_date.set_input(frappe.datetime.nowdate())
		to_date.refresh();
		var from_date = frappe.query_report.get_filter('from_date');
		from_date.set_input(frappe.datetime.add_days(frappe.datetime.nowdate(),-1))
		from_date.refresh();
		// var d = frappe.datetime.add_months(frappe.datetime.month_start(), -1)
		// from_date.set_input(frappe.datetime.add_days(d, 20))
		// var grade = frappe.query_report.get_filter('grade');
		// grade.set_input(grade = 'Labour')
		// from_date.refresh();



	// },
	// formatter:function (row, cell, value, columnDef, default_formatter) {
    //     value = default_formatter(row,value,column,data)
	// 	if(frm.doc){
	// 		console.log('HI')
	// 		// value = "<span style = 'color:red' "

	// 	}
	
	}
};
