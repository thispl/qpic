// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Miss Punch Report"] = {
	"filters": [
		{
			"fieldname":"from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"reqd": 1,
		},
		{
			"fieldname":"to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"reqd": 1,
		},
		// {
		// 	"fieldname":"office",
		// 	"label": __("Office"),
		// 	"fieldtype": "Select",
		// 	"options":["SPIC Office","All Office"],
		// 	// "reqd": 1,
		// 	"default": "All Office"
		// },
		// {
		// 	"fieldname":"employee",
		// 	"label": __("Employee"),
		// 	"fieldtype": "Link",
		// 	"options": "Employee",
		// },

		// {
		// 	"fieldname":"department",
		// 	"label": __("Department"),
		// 	"fieldtype": "Link",
		// 	"options": "Department",
		// },
	]
};
