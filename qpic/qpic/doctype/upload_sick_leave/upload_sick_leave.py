# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

from re import A
import frappe
from frappe.model.document import Document
from frappe.model import workflow
from frappe.utils import cstr, add_days, date_diff, getdate
from frappe import _
from frappe.utils.csvutils import UnicodeWriter, read_csv_content
from frappe.utils.file_manager import get_file
from frappe.utils.background_jobs import enqueue
import datetime as dt

class UploadSickLeave(Document):
	
	def on_submit(self):
			filepath = get_file(self.attach)
			pps = read_csv_content(filepath[1])
			for pp in pps:
				if pp[0] == 'Employee':
					pass
				elif pp[0] is None:
					frappe.throw("Employee is mandatory")
				elif pp[1] is None:	
					frappe.throw("From Date is mandatory")
				elif pp[2] is None:
					frappe.throw("To Date is mandatory")
				elif pp[3] is None:
					frappe.throw("Remarks is mandatory")	

				else:
					lpa=frappe.db.exists('Leave Application',{'from_date':pp[1],'employee':pp[0]},['name'])
					if not lpa:
						frappe.errprint(lpa)
						laap = frappe.new_doc('Leave Application')
						laap.employee = pp[0]
						laap.custom_from_date = pp[1]
						laap.custom_to_date = pp[2]
						laap.leave_type = "Sick Leave"
						laap.remarks = pp[3]
						laap.status = 'Approved'
						laap.submit()
						laap.save(ignore_permissions = True)
						frappe.db.commit()
					
	@frappe.whitelist()
	def show_csv_data(self):
		filepath = get_file(self.attach)
		pps = read_csv_content(filepath[1])

		data_list = ''
		for pp in pps:
			if pp[0] == 'Employee':
				data_list += "<tr><td style='background-color:#3431e0; border: 1px solid black;color:white'>%s</td><td style='background-color:#3431e0; border: 1px solid black;color:white'>%s</td><td style='background-color:#3431e0; border: 1px solid black;color:white'>%s</td><td style='background-color:#3431e0; border: 1px solid black;color:white'>%s</td></tr>"%(pp[0],pp[1],pp[2],pp[3])
			elif pp[0] is not None:
				data_list += "<tr><td style = 'border: 1px solid black'>%s</td><td style = 'border: 1px solid black'>%s</td><td style = 'border: 1px solid black'>%s</td><td style = 'border: 1px solid black'>%s</td></tr>"%(pp[0],pp[1],pp[2],pp[3])
		return data_list

			

@frappe.whitelist()
def download_template():
	args = frappe.local.form_dict
	w = UnicodeWriter()
	w = add_header(w)
	frappe.response['result'] = cstr(w.getvalue())
	frappe.response['type'] = 'csv'
	frappe.response['doctype'] = "Upload Sick Leave"

@frappe.whitelist()
def add_header(w):
	w.writerow(["Employee", "From Date","To Date","Remark"])
	return w

@frappe.whitelist()
def writedata(w, data):
	for row in data:
		w.writerow(row)