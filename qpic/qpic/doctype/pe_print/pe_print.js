// Copyright (c) 2026, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on("PE Print", {
    // Events
	refresh(frm) {

	},

    // Fields
    roller(frm) {
        frm.trigger('calculate_target');
        frm.trigger('calculate_bags_per_hour');
    },
    speed(frm) {
        frm.trigger('calculate_target');
        frm.trigger('calculate_bags_per_hour');
        frm.trigger('calculate_mp_per_bag');
    },
    mp_per_mc(frm) {
        frm.trigger('calculate_mp_per_bag');
    },

    // Calculations
    calculate_target(frm) {
        if (frm.doc.roller && frm.doc.speed) {
            const target = Math.round((frm.doc.speed * 60 * 11 / (frm.doc.roller / 100) * 0.9),-2);
            frm.set_value("target", target);
        }
    },
    calculate_bags_per_hour(frm) {
        if (frm.doc.roller && frm.doc.speed) {
            const bags_per_hr = Math.round((frm.doc.speed *60 / (frm.doc.roller / 100) * 0.9),-2);
            frm.set_value("bags_per_hr", bags_per_hr);
        }
        else {
            const bags_per_hr = Math.round((frm.doc.target || 0) / 60, -2);
            frm.set_value("bags_per_hr", bags_per_hr);
        }
    },
});
