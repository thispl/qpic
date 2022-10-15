# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

# import frappe
from __future__ import unicode_literals
from time import gmtime
import frappe
from frappe.model import workflow
from frappe.utils import cstr, add_days, date_diff, getdate
from frappe import _
from frappe.utils.csvutils import UnicodeWriter, read_csv_content
from frappe.utils.file_manager import get_file
from frappe.model.document import Document
from frappe.utils.background_jobs import enqueue
import datetime as dt

class MissPunchCorrectionTool(Document):
	def on_update(self):
		filepath = get_file(self.attach)
		pps = read_csv_content(filepath[1])

		# data_list = ''
		for pp in pps:
			if pp[0] == 'ID':
				pass
			elif pp[0] is None:
				frappe.throw("Employee ID is mandatory")
			elif pp[2] is None:	
				frappe.throw("Date is mandatory")
			elif pp[3] is None:
				frappe.throw("In Time is mandatory")
			elif pp[4] is None:
				frappe.throw("Out Time is mandatory")	

			else:
	
				f_date = dt.datetime.strptime(str(pp[2]),'%Y-%m-%d')

				att=frappe.db.exists('Attendance',{'attendance_date':f_date,'employee':pp[0]},['name'])
				
				frappe.errprint(att)
				if att:
					att_id = frappe.get_doc('Attendance',att)
					f_in_time = dt.datetime.strptime(str(pp[3]),'%H:%M:%S')
					in_time = dt.datetime.combine(f_date, f_in_time.time())
					f_out_time = dt.datetime.strptime(str(pp[4]),'%H:%M:%S')
					out_time = dt.datetime.combine(f_date, f_out_time.time())
					att_id.in_time = in_time
					att_id.out_time = out_time
					att_id.status = "Present"
					att_id.shift = "M"
					att_id.miss_punch_application = self.name
					att_id.save(ignore_permissions = True)
					frappe.db.commit()
				# frappe.errprint(att.out_time)
				# att.save()

			


	@frappe.whitelist()
	def show_csv_data(self):
		filepath = get_file(self.attach)
		pps = read_csv_content(filepath[1])

		data_list = ''
		for pp in pps:
			if pp[0] == 'ID':
				data_list += "<tr><td style='background-color:#3431e0; border: 1px solid black;color:white'>%s</td><td style='background-color:#3431e0; border: 1px solid black;color:white'>%s</td><td style='background-color:#f0b27a; border: 1px solid black'>%s</td><td style='background-color:#f0b27a; border: 1px solid black'>%s</td><td style='background-color:#f0b27a; border: 1px solid black'>%s</td></tr>"%(pp[0],pp[1],pp[2],pp[3],pp[4])
			elif pp[0] is not None:
				data_list += "<tr><td style = 'border: 1px solid black'>%s</td><td style = 'border: 1px solid black'>%s</td><td style = 'border: 1px solid black'>%s</td><td style = 'border: 1px solid black'>%s</td><td style = 'border: 1px solid black'>%s</td></tr>"%(pp[0],pp[1],pp[2],pp[3],pp[4])
		return data_list




@frappe.whitelist()
def download_template():
	args = frappe.local.form_dict
	w = UnicodeWriter()
	w = add_header(w)
	w = add_data(w,args)
	# write out response as a type csv
	frappe.response['result'] = cstr(w.getvalue())
	frappe.response['type'] = 'csv'
	frappe.response['doctype'] = "Attendance"

@frappe.whitelist()
def add_header(w):
	w.writerow(["ID", "Name", "Date", "In Time", "Out Time"])
	return w

@frappe.whitelist()
def add_data(w, args):
	data = get_data(args)
	writedata(w, data)
	return w

@frappe.whitelist()
def get_data(args):
	misspunch = frappe.db.sql("""
	select
		employee,
		employee_name,
		attendance_date,
		in_time,
		out_time
	from
		`tabAttendance`
		where attendance_date = '%s'
		and 
		(in_time and out_time) is null
	""" % (args["attendance_date"]), as_dict=1)
	data = []
	for m in misspunch:
		if m['in_time']:
			in_time = m['in_time'].time()
		else:
			in_time = ''
		if m['out_time']:
			out_time = m['out_time'].time()
		else:
			out_time = ''

		row = [
			m['employee'], m['employee_name'],m['attendance_date'],in_time,out_time
		]
		data.append(row)
	return data


@frappe.whitelist()
def writedata(w, data):
	for row in data:
		w.writerow(row)

