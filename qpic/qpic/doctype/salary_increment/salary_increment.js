// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Salary Increment', {
	
		setup(frm) {
			frm.set_query("employee_number", function() {
				return {
					filters: {				
						'status':'Active'
					}
				};
			});
				
			}
	

});
