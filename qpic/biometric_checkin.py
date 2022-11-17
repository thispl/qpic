import json
import frappe

@frappe.whitelist(allow_guest=True)
def mark_checkin(**args):
    if not frappe.db.exists('Employee Checkin',{'employee':args['employee'],'time':args['time']}):
        if frappe.db.exists('Employee',{'name':args['employee'],'status':'Active'}):
            try:
                ec = frappe.new_doc('Employee Checkin')
                ec.employee = args['employee'].upper()
                ec.time = args['time']
                ec.device_id = args['device_id']
                ec.save(ignore_permissions=True)
                frappe.db.commit()
                return "Checkin Marked"
            except:
                frappe.log_error(title="checkin error",message=frappe.get_traceback())
    else:
        return "Checkin Marked"

@frappe.whitelist(allow_guest=True)
def enqueue_mark_checkin(attlog):
    from frappe.utils.background_jobs import enqueue
    enqueue(bulk_mark_checkin,queue="default", timeout=6000, event='bulk_mark_checkin',attlog=attlog)

@frappe.whitelist(allow_guest=True)
def bulk_mark_checkin(attlog):
    import datetime
    from datetime import timedelta
    cjattlog = eval(attlog)
    for att in cjattlog:
        formated_time = timedelta(hours = 5,minutes = 30)
        calc_time=(att['punch_time']+formated_time).replace(tzinfo=None)
        if not frappe.db.exists('Employee Checkin',{'employee':att['emp_code'],'time':calc_time}):
            if frappe.db.exists('Employee',{'name':att['emp_code']}):
                try:
                    ec = frappe.new_doc('Employee Checkin')
                    ec.employee = att['emp_code'].upper()
                    ec.time = calc_time
                    ec.device_id = att['terminal_alias']
                    ec.save(ignore_permissions=True)
                    frappe.db.commit()
                except:
                    frappe.log_error(title="checkin error",message=frappe.get_traceback())
