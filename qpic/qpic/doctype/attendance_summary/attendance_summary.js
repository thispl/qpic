// Copyright (c) 2022, TEAMPRO and contributors
// For license information, please see license.txt

frappe.ui.form.on('Attendance Summary', {
    refresh(frm){
        frm.disable_save()
        frappe.db.get_value("Employee",{'user_id':frappe.session.user},['employee','employee_name'], (r) => {
            if (r){
                frm.set_value('employee',r.employee)
                frm.set_value('employee_name',r.employee_name)
            }
        })
        frm.set_value('from_date',frappe.datetime.add_days(frappe.datetime.month_start()))
        frm.set_value('to_date',frappe.datetime.add_days(frappe.datetime.month_end()))
    },
    employee(frm){
        frm.trigger('get_data_system')
    },
    get_data_system(frm){
        frappe.db.get_value('Employee', { "name": frm.doc.employee }, 'employee', (r) => {
            if(r.employee){
                frappe.call({
                    method:"qpic.qpic.doctype.attendance_summary.attendance_summary.get_data_system",
                    args:{
                        emp:frm.doc.employee,
                        from_date:frm.doc.from_date,
                        to_date:frm.doc.to_date
                    },
                    callback(r){
                        frm.fields_dict.html.$wrapper.empty().append(r.message)

                        
                    }
                })
            }
        })
    }	
});
