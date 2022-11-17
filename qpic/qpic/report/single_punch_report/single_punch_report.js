// Copyright (c) 2022, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Single Punch Report"] = {
	"filters": [
		{
			"fieldname":"from_date",
			"label": __("From"),
			"fieldtype": "Date",
			"default": frappe.datetime.add_months(frappe.datetime.get_today()),
			"reqd": 1,
			"width": "100px"
		},
		{
			"fieldname":"to_date",
			"label": __("To"),
			"fieldtype": "Date",
			"default": frappe.datetime.get_today(),
			"reqd": 1,
			"width": "100px"
		},
		{
			"fieldname":"employee",
			"label": __("Employee"),
			"fieldtype": "Link",
			"options": "Employee",
			"width": "100px"
		},
	]
};
