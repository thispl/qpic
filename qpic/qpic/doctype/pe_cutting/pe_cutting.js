// Copyright (c) 2026, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on("PE Cutting", {
	refresh(frm) {

	},

    // Fields
    pcs__minute(frm) {
        const value = (frm.doc.pcs__minute || 0) * 60;
        frm.set_value("no_of_bags__hour", value);
    }
});
