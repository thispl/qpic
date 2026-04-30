frappe.ui.form.on("Item", {
    // Event
    onload_post_render(frm) {
        frm.set_query("item_group", () => {
            return {
                filters: {
                    name: ["!=", "All Item Groups"]
                }
            };
        });
    }
});