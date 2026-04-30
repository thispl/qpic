// Copyright (c) 2026, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on("Overhead Details", {
    after_save(frm) {
        update_overhead_summary(frm);
    },
    month: function(frm) {
        const map_months = {
            "JAN": 1, "FEB": 2, "MAR": 3, "APR": 4,
            "MAY": 5, "JUN": 6, "JUL": 7, "AUG": 8,
            "SEP": 9, "OCT": 10, "NOV": 11, "DEC": 12
        };

        if (frm.doc.month) {
            let month_val = map_months[frm.doc.month];

            if (month_val) {
                let value = frm.doc.current_value / month_val;
                frm.set_value("month_value", Math.round(value));
            }
        }
    },
    current_value(frm){
        const map_months = {
            "JAN": 1, "FEB": 2, "MAR": 3, "APR": 4,
            "MAY": 5, "JUN": 6, "JUL": 7, "AUG": 8,
            "SEP": 9, "OCT": 10, "NOV": 11, "DEC": 12
        };

        if (frm.doc.month) {
            let month_val = map_months[frm.doc.month];

            if (month_val) {
                let value = frm.doc.current_value / month_val;
                frm.set_value("month_value", Math.round(value));
            }
        }
    },
    validate(frm){
        const map_months = {
            "JAN": 1, "FEB": 2, "MAR": 3, "APR": 4,
            "MAY": 5, "JUN": 6, "JUL": 7, "AUG": 8,
            "SEP": 9, "OCT": 10, "NOV": 11, "DEC": 12
        };

        if (frm.doc.month) {
            let month_val = map_months[frm.doc.month];

            if (month_val) {
                let value = frm.doc.current_value / month_val;
                // frm.set_value("month_value", Math.round(value));
            }
        }
        update_overhead_summary(frm);
    }
});
function get_total_by_group(group_name) {
    return new Promise((resolve) => {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Overhead Details",
                filters: { group: group_name },
                fields: ["month_value"],
                limit_page_length: 1000
            },
            callback: function(res) {
                let total = 0;

                (res.message || []).forEach(row => {
                    total += row.month_value || 0;
                });

                resolve(total);
            }
        });
    });
}

async function update_overhead_summary(frm) {

    const data = [
        ["Tape", 26.00],
        ["FIBC fabric", 7.00],
        ["SB Fabric", 19.00],
        ["Belt", 2.00],
        ["Printing", 1.00],
        ["Small bag", 13.00],
        ["FIBC Cutting", 6.00],
        ["FIBC Stitching", 7.00],
        ["FIBC Bailing", 0.50],
        ["Small bag bailing", 0.50],
        ["Lamination", 2.00],
        ["Liner small bag", 1.00],
        ["Liner FIBC", 3.00],
        ["Thread", 1.08],
        ["Baler twine", 0.92],
        ["PE", 10.00]
    ];

    let [
        total_foh,
        total_gae,
        total_s_and_d,
        total_aoh,
        total_bic
    ] = await Promise.all([
        get_total_by_group("Factory Overheads"),
        get_total_by_group("General Admin. Exps"),
        get_total_by_group("Selling & Distribution"),
        get_total_by_group("Administrative Overhead"),
        get_total_by_group("Bank Interest & Charges")
    ]);

    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Overhead Summary",
            name: "Overhead Summary"
        },
        callback: function(res) {
            if (res.message) {
                let doc = res.message;
                doc.month_data = doc.month_data || [];

                data.forEach(item => {
                    let group_name = item[0];
                    let percentage = item[1];

                    let existing_row = doc.month_data.find(
                        row => row.group === group_name
                    );

                    // if (existing_row) {
                    //     existing_row.percentage = percentage;
                    //     existing_row.foh = (total_foh * percentage) / 100;
                    //     existing_row.gae = (total_gae * percentage) / 100;
                    //     existing_row.s_and_d = (total_s_and_d * percentage) / 100;
                    //     existing_row.aoh = (total_aoh * percentage) / 100;
                    //     existing_row.bi_and_c = (total_bic * percentage) / 100;
                    // } else {
                    //     doc.month_data.push({
                    //         doctype: "Overhead Summary Details",
                    //         group: group_name,
                    //         percentage: percentage,
                    //         foh: (total_foh * percentage) / 100,
                    //         gae: (total_gae * percentage) / 100,
                    //         s_and_d: (total_s_and_d * percentage) / 100,
                    //         aoh: (total_aoh * percentage) / 100,
                    //         bi_and_c: (total_bic * percentage) / 100
                    //     });
                    // }
                    if (existing_row) {


                        existing_row.foh = (total_foh * existing_row.percentage) / 100;
                        existing_row.gae = (total_gae * existing_row.percentage) / 100;
                        existing_row.s_and_d = (total_s_and_d * existing_row.percentage) / 100;
                        existing_row.aoh = (total_aoh * existing_row.percentage) / 100;
                        existing_row.bi_and_c = (total_bic * existing_row.percentage) / 100;

                        existing_row.total =
                            (existing_row.foh || 0) +
                            (existing_row.gae || 0) +
                            (existing_row.s_and_d || 0) +
                            (existing_row.aoh || 0) +
                            (existing_row.bi_and_c || 0);

                    } else {

                        let foh = (total_foh * percentage) / 100;
                        let gae = (total_gae * percentage) / 100;
                        let s_and_d = (total_s_and_d * percentage) / 100;
                        let aoh = (total_aoh * percentage) / 100;
                        let bic = (total_bic * percentage) / 100;

                        doc.month_data.push({
                            doctype: "Overhead Summary Details",
                            group: group_name,
                            percentage: percentage,
                            foh: foh,
                            gae: gae,
                            s_and_d: s_and_d,
                            aoh: aoh,
                            bi_and_c: bic,
                            total: foh + gae + s_and_d + aoh + bic
                        });
                    }
                                    });
                    doc.hour_data = doc.hour_data || [];

                    data.forEach(item => {
                        let group_name = item[0];
                        let percentage = item[1];

                        let existing_row = doc.hour_data.find(
                            row => row.group === group_name
                        );

                        if (existing_row) {

                            let pct = existing_row.percentage || 0;

                            existing_row.foh = ((total_foh * pct) / 100) / 28 / 22;
                            existing_row.gae = ((total_gae * pct) / 100) / 28 / 22;
                            existing_row.s_and_d = ((total_s_and_d * pct) / 100) / 28 / 22;
                            existing_row.aoh = ((total_aoh * pct) / 100) / 28 / 22;
                            existing_row.bi_and_c = ((total_bic * pct) / 100) / 28 / 22;

                            existing_row.total =
                                (existing_row.foh || 0) +
                                (existing_row.gae || 0) +
                                (existing_row.s_and_d || 0) +
                                (existing_row.aoh || 0) +
                                (existing_row.bi_and_c || 0);

                        } else {

                            let foh = ((total_foh * percentage) / 100) / 28 / 22;
                            let gae = ((total_gae * percentage) / 100) / 28 / 22;
                            let s_and_d = ((total_s_and_d * percentage) / 100) / 28 / 22;
                            let aoh = ((total_aoh * percentage) / 100) / 28 / 22;
                            let bic = ((total_bic * percentage) / 100) / 28 / 22;

                            doc.hour_data.push({
                                doctype: "Overhead Summary Details",
                                group: group_name,
                                percentage: percentage,
                                foh: foh,
                                gae: gae,
                                s_and_d: s_and_d,
                                aoh: aoh,
                                bi_and_c: bic,
                                total: foh + gae + s_and_d + aoh + bic
                            });
                        }
                    });

                frappe.call({
                    method: "frappe.client.save",
                    args: { doc: doc },
                    callback: function() {
                        // frappe.msgprint("Overhead Summary Updated Successfully");
                    }
                });
            }
        }
    });
}