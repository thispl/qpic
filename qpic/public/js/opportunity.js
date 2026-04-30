frappe.ui.form.on('Opportunity', {
    // Event
    refresh(frm) {
        if (frm.doc.docstatus == 1) {
            frm.add_custom_button(__('Technical Sheet'), function() {
                frappe.set_route('List', 'Technical Sheet', {
                    opportunity: frm.doc.name
                });
            }).addClass('btn-primary');
        }
    }

    // Fields

    // Calculations
});