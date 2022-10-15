// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Upload Sick Leave', {
	download_template: function (frm) {
		console.log(frappe.request.url)
		window.location.href = repl(frappe.request.url +
			'?cmd=%(cmd)s&attendance_date=%(attendance_date)s' ,{
			cmd: "qpic.qpic.doctype.upload_sick_leave.upload_sick_leave.download_template",
			attendance_date: frm.doc.attendance_date,
		});
	},
	attach(frm) {
		if (frm.doc.attach) {
			frm.fields_dict.csv_preview.$wrapper.empty();
			frm.call('show_csv_data').then(r => {
				if (r.message) {
					frm.fields_dict.csv_preview.$wrapper.append("<h2>Upload Preview</h2><table class='table table-bordered'>" + r.message + "</table>")
				}
			})
		}
	},
});
