// Copyright (c) 2025, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Thread', {
	denier: function (frm) {
		console.log(frm.doc.denier);
		frm.trigger('calculate_wtmg');
	},
	calculate_wtmg: function (frm) {
		if (frm.doc.denier >= 0) {
			const wtmg = frm.doc.denier / 9000;
			frm.set_value("wtmg", wtmg);
		}
	}
});
