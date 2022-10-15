// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Download Report', {
	// refresh: function(frm) {

	// }
	download: function (frm) {
		if (frm.doc.report == 'WPS Report') {
			var path = "qpic.qpic.doctype.download_report.wps_report.download"
			var args = 'from_date=%(from_date)s&to_date=%(to_date)s&division=%(division)s'
		}
		if (frm.doc.report == 'Salary Register') {
			var path = "qpic.qpic.doctype.download_report.salary_register.download"
			var args = 'from_date=%(from_date)s&to_date=%(to_date)s&division=%(division)s&grade=%(grade)s&department=%(department)s'
		}

		if (path) {
			window.location.href = repl(frappe.request.url +
				'?cmd=%(cmd)s&%(args)s', {
				cmd: path,
				args: args,
				date: frm.doc.date,
				from_date : frm.doc.from_date,
				to_date : frm.doc.to_date,	
				division : frm.doc.division,
				department : frm.doc.department,
				grade : frm.doc.grade
			});
		}
	},

});
