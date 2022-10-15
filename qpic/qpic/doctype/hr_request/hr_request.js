// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('HR Request', {
	// refresh: function(frm) {

	// }
	setup(frm) {
		frm.set_query("employee", function() {
			return {
				filters: {	
					'status':'Active',
					
				}
			};
		});
			
		}
});
