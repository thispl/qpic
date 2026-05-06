frappe.ui.form.on('Opportunity', {
    // Event
    refresh(frm) {
        if (frm.doc.docstatus == 1) {
            let distinct_values = [...new Set(
                (frm.doc.items || []).map(row => row.custom_costing_for)
            )];

            let pe_types = ["PE Bag", "PE Roll"];
            let fibc_types = ["FIBC", "Fabric", "Small Bag"];

            if (distinct_values.some(v => fibc_types.includes(v))) {
                frm.add_custom_button(__('Technical Sheet'), function() {
                    frappe.set_route('List', 'Technical Sheet', {
                        opportunity: frm.doc.name
                    });
                }).addClass('btn-primary');
            }
            if (distinct_values.some(v => pe_types.includes(v))) {
                frm.add_custom_button(__('Technical Sheet PE'), function() {
                    frappe.set_route('List', 'Technical Sheet PE', {
                        opportunity: frm.doc.name
                    });
                }).addClass('btn-primary');
            }
        }
    }

    // Fields

    // Calculations
});