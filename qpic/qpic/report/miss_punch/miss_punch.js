// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt


frappe.query_reports["Miss Punch"] = {
	"filters": [
		
		{
			"fieldname":"from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"reqd": 1,
            "default": frappe.datetime.add_days(frappe.datetime.nowdate(),-1)
		},
        {
			"fieldname":"to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"reqd": 1,
            "default":frappe.datetime.nowdate()
		},
	
	]
}
