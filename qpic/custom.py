from __future__ import unicode_literals
import frappe
import erpnext
from frappe.utils import cint
import json
from frappe.utils import date_diff, add_months, today, add_days, add_years, nowdate, flt
from frappe.model.mapper import get_mapped_doc
from frappe.utils.file_manager import get_file
from frappe.utils.csvutils import UnicodeWriter, read_csv_content
import datetime
from datetime import datetime, timedelta, date
from frappe.utils import now_datetime, nowdate
from dateutil import relativedelta
import datetime
import calendar

@frappe.whitelist()
def get_ot_calculation_on_salary_slip(doc, method):
    if doc.employee:
        ot_calculation = frappe.db.exists(
            'OT Calculation', {'name': doc.employee}, ['name'])
        if ot_calculation:
            ot = frappe.get_value('OT Calculation', {'name': doc.employee}, [
                                  'name', 'overtime', 'weekend_ot', 'holiday_ot', 'lwp'])
            doc.overtime = ot[1]
            doc.weekend_ot = ot[2]
            doc.holiday_ot = ot[3]
#             doc.leave_without_pay = ot[4]
#             print(ot[4])

@frappe.whitelist()
def maternity_leave_calculation(employee):
    doj = frappe.get_value("Employee", employee, "date_of_joining")
    total_experience = date.today() - doj
    year = timedelta(days=365)
    status = "Not Allowed"
    if total_experience and total_experience >= year:
        status = "Allowed"
    return status

@frappe.whitelist()
def annual_leave_calculation(employee):
    doj = frappe.get_value("Employee", employee, ["date_of_joining", 'grade'])
    total_experience = date.today() - doj[0]
    year = timedelta(days=730)
    for_off = timedelta(days=365)
    status = "Not Allowed"
    if doj[1] == 'Labour':
        if total_experience and total_experience >= year:
            status = "Allowed"
    else:
        if total_experience and total_experience >= for_off:
            status = "Allowed"
    return status

@frappe.whitelist()
def pilgrimage_leave(employee):
    religion = frappe.get_value("Employee", employee, "religion")
    status = "Not Allowed"
    if religion == "Muslim":
        status = "Allowed"
    return status

@frappe.whitelist()
def salary_advance(doc, method):
    employee_advance = frappe.db.exists(
        'Employee Advance', {'employee': doc.employee})
    today = datetime.date.today()
    frappe.errprint(employee_advance)
    if employee_advance:
        aas = frappe.new_doc('Additional Salary')
        frappe.errprint(aas)
        aas.employee = doc.employee
        aas.salary_component = 'Advance'
        aas.payroll_date = today + relativedelta.relativedelta(months=1, day=1)
        aas.amount = doc.advance_amount
        aas.save()
        aas.submit()

@frappe.whitelist()
def update_employee(doc, method):
    employee_update = frappe.db.exists('Update Employee Personal Info', {'employee': doc.employee_number})
    frappe.errprint(employee_update)
    if employee_update:
        frappe.errprint(employee_update)
        emp = frappe.get_doc('Employee')
        emp.update({
            'employee_number': doc.employee_number,
            'first_name': doc.first_name,
            'middle_name': doc.middle_name,
            'last_name': doc.last_name,
            'sponsor_company': doc.sponsor_company,
            'passport_number': doc.passport_number,
            'date_of_issue': doc.date_of_issue,
            'valid_upto': doc.valid_upto,
            'place_of_issue': doc.place_of_issue,
            'marital_status': doc.marital_status,
            'blood_group': doc.blood_group,
            'date_of_birth': doc.date_of_birth,
            'religion': doc.religion,
            'family_background': doc.family_background,
            'health_details': doc.health_details,
            'bio': doc.bio,
            'person_to_be_contacted': doc.person_to_be_contacted,
            'relation': doc.relation,
            'emergency_phone_number': doc.emergency_phone_number,
            'cell_number': doc.cell_number,
            'prefered_email': doc.prefered_email,
            'personal_email': doc.personal_email,
            'permanent_address': doc.permanent_address,
            'prefered_contact_email': doc.prefered_contact_email,
            'company_email': doc.company_email,
            'current_address': doc.current_address
        })

@frappe.whitelist()
def probation_emp(employee):
    doj = frappe.get_value("Employee", employee, "date_of_joining")
    total_experience = date.today() - doj
    year = timedelta(days=365)
    status = "Not Allowed"
    if total_experience and total_experience >= year:
        status = "Allowed"
    return status

@frappe.whitelist()
def get_month_for_advance_calc(employee):
    status = 'Not Allowed'
    today = datetime.date.today()
    preve_month = frappe.db.sql("""select employee,posting_date from  `tabEmployee Advance` where  posting_date between %s and date_add(now(), interval 3 month) and employee = '%s' order by posting_date """ % (
        today, employee), as_dict=True)
    for pm in preve_month:
        frappe.errprint(pm)
        if pm:
            frappe.errprint(status)
            status = 'Allowed'
        return status

@frappe.whitelist()
def calc_loan():
    employee_loan = frappe.get_value(
        'Loan', {'status': 'Sanctioned'}, ['applicant'])

@frappe.whitelist()
def skip_workflow_state(doc, method):
    if doc.workflow_state == 'Pending for HOD':
        roles = frappe.get_roles(frappe.session.user)
        if "HR Manager" in roles:
            frappe.db.set_value("Leave Application", doc.name,
                                "workflow_state", "Pending for CEO")

@frappe.whitelist()
def skip_workflow_emp_add(doc, method):
    if doc.workflow_state == 'Pending for HOD':
        roles = frappe.get_roles(frappe.session.user)
        if "HR Manager" in roles:
            frappe.db.set_value("Employee Advance", doc.name,
                                "workflow_state", "Pending for CEO")

@frappe.whitelist()
def create_scheduled_job():
    job = frappe.db.exists('Scheduled Job Type', 'send_birthday_alert')
    if not job:
        sjt = frappe.new_doc("Scheduled Job Type")
        sjt.update({
            "method": 'qpic.email_alerts.send_birthday_alert',
            "frequency": 'Monthly',
            # "cron_format": '0 11 * * *'
        })
        sjt.save(ignore_permissions=True)

@frappe.whitelist()
def get_to_date(from_date, total_leave_days):
    from datetime import date, timedelta, datetime
    difference = timedelta(days=flt(total_leave_days) - 1)
    to_date = datetime.strptime(from_date, "%Y-%m-%d").date() + difference
    frappe.errprint('to_date')
    frappe.errprint(to_date)
    return to_date
# Copied for Utils

@frappe.whitelist()
def get_gratuity(employee):
    from datetime import datetime
    from dateutil import relativedelta
    date_2 = datetime.now()
    emp = frappe.get_doc('Employee', employee)
    # Get the interval between two dates
    diff = relativedelta.relativedelta(date_2, emp.date_of_joining)
    exp_years = diff.years
    exp_month = diff.months
    exp_days = diff.days
    basic_salary = frappe.db.get_value(
        'Employee', emp.employee_number, 'basic')
    per_day_basic = basic_salary / 30
    if emp.grade == 'Office Staff':
        gratuity_per_year = per_day_basic * 30
    else:
        gratuity_per_year = per_day_basic * 21
    gratuity_per_month = gratuity_per_year / 12
    gratuity_per_day = gratuity_per_month / 30
    earned_gpy = gratuity_per_year * exp_years
    earned_gpm = gratuity_per_month * exp_month
    earned_gpd = gratuity_per_day * exp_days
    total_gratuity = earned_gpy + earned_gpm + earned_gpd
    return total_gratuity

@frappe.whitelist()
def calculate_attendance(employee):
    name_reg = frappe.db.sql(
        """select name,hods_relieving_date,actual_relieving_date from `tabResignation Form` where employee = %s """ % (employee), as_dict=True)[0]
    current_date = name_reg.actual_relieving_date
    first_day_of_month = current_date.replace(day=1)
    hod_date = str(first_day_of_month)
    app_date = str(name_reg.actual_relieving_date)
    frappe.errprint(hod_date)
    frappe.errprint(app_date)
    frappe.errprint(type(app_date))
    if name_reg:
        att = frappe.db.sql("""select count(*) as count from `tabAttendance` where attendance_date between '%s' and '%s' and status = 'Present'  and employee = %s""" %
                            (hod_date, app_date, employee), as_dict=True)[0]
        cal = att
        return cal, name_reg

@frappe.whitelist()
def get_current_month(employee):
    ff = frappe.get_value('Leave Application', {'employee': employee}, [
                          'from_date'])
    frappe.errprint(ff)
    now = ff
    days = calendar.monthrange(now.year, now.month)[1]
    return(days)

@frappe.whitelist()
def get_current_month_date(employee):
    ff = frappe.get_value('Resignation Form', {'employee': employee}, [
                          'actual_relieving_date'])
    frappe.errprint(ff)
    now = ff
    days = calendar.monthrange(now.year, now.month)[1]
    return(days)

@frappe.whitelist()
def get_reg_form(employee):
    frappe.errprint(employee)
    name_reg = frappe.db.sql(
        """select name,hods_relieving_date,actual_relieving_date from `tabResignation Form` where employee = %s """ % (employee), as_dict=True)[0]
    current_date = name_reg.actual_relieving_date
    first_day_of_month = current_date.replace(day=1)
    return name_reg.name, first_day_of_month, name_reg.actual_relieving_date

# @frappe.whitelist()
# def get_leave_application(employee):
#     leave_application = frappe.get_all('Leave Application', {'employee': employee, 'docstatus': 1}, ['custom_from_date''custom_to_date','lop_days','leave_balance','custom_total_leave_days'],limit = 0)
#     return leave_application

@frappe.whitelist()
def get_leave_application(employee):
    # employee = frappe.db.sql("""select * from `tabEmployee` where status ='Active' """,as_dict =1)
    # for emp in employee:
    leave_application = frappe.get_all('Leave Application', {'employee': employee, 'docstatus': 1}, ['*'])
    if leave_application:
        for lap in leave_application:
            from_date = lap.custom_from_date
            first_of_month = from_date.replace(day=1)
            to_date = lap.from_date
            before_day = to_date - timedelta(days=1)
            attendance = frappe.db.sql("""select count(*) as count, sum(ot_hours) as ot ,sum(week_end_ot) as wot,sum(holiday_ot) as hot from `tabAttendance` where docstatus != 2 and employee = '%s' and  attendance_date between '%s' and '%s' """ % (employee, first_of_month, before_day), as_dict=1)[0]
            abs1 = frappe.db.sql("""select count(*) as count from `tabAttendance` where docstatus != 2 and employee = '%s' and  attendance_date between '%s' and '%s' and status = 'Absent' """ % (employee, first_of_month, before_day), as_dict=1)[0]
            abs2 = frappe.db.sql("""select count(*) as count from `tabAttendance` where docstatus != 2 and employee = '%s' and  attendance_date between '%s' and '%s' and status = 'On Leave' and leave_type = 'Leave Without Pay' """ % (employee, first_of_month, before_day), as_dict=1)[0]
            return first_of_month, before_day,lap.custom_from_date, lap.custom_to_date,attendance.count, attendance.ot or 0, attendance.wot or 0, attendance.hot or 0, lap.lop_days, lap.custom_total_leave_days, lap.leave_balance, lap.leave_type, abs1.count or 0, abs2.count or 0

@frappe.whitelist()
def update_employee_status(doc, method):
    reg = frappe.db.sql(
        """select * from `tabResignation Form` where docstatus = 1""", as_dict=1)
    if reg:
        for emp in reg:
            frappe.errprint(emp)
            if emp.actual_relieving_date == datetime.strptime((today()), '%Y-%m-%d').date():
                emp_n = frappe.get_doc('Employee', emp.employee)
                emp_n.status = "Left"
                emp_n.relieving_date = emp.actual_relieving_date
                emp_n.save(ignore_permissions=True)

@frappe.whitelist()
def validate_employment_type(employee):
    prob_eval = frappe.db.exists('Probation Evaluation Form', {
                                 'employee': employee, 'docstatus': 1})
    status = "No"
    if prob_eval:
        status = 'Yes'
    return status

@frappe.whitelist()
def create_leave_application(doc, method):
    # leave_application = frappe.db.sql(
    #     """select name,custom_from_date,custom_to_date,from_date,to_date,leave_type,lop_days from `tabLeave Application` where employee = '%s' """ % (doc.employee), as_dict=1)
    # frappe.errprint(leave_application)
    # for laap in leave_application:
        # if doc.leave_type == 'Annual Leave':
        #     if doc.lop_days:
        #         lpa = frappe.new_doc('Leave Application')
        #         lpa.employee = doc.employee
        #         lpa.leave_type = 'Leave Without Pay'
        #         from_date = doc.custom_to_date + timedelta(days=1)
        #         lpa.from_date = from_date
        #         lpa.to_date = doc.custom_to_date
        #         lpa.status = 'Approved'
        #         lpa.save(ignore_permissions=True)
        #         frappe.db.commit()
        if doc.lop_days:
            lpa = frappe.new_doc('Leave Application')
            lpa.employee = doc.employee
            lpa.leave_type = 'Leave Without Pay'
            # date = datetime.datetime.strptime(doc.custom_to_date, '%Y-%m-%d')
            from_date = doc.custom_to_date - timedelta(days=doc.lop_days - 1)
            # frappe.errprint(from_date)
            # lpa.from_date = from_date
            # lpa.to_date = doc.custom_to_date
            lpa.custom_from_date = from_date
            lpa.custom_to_date = doc.custom_to_date
            lpa.status = 'Approved'
            frappe.db.commit()
            lpa.save(ignore_permissions=True)

# @frappe.whitelist()
# def create_item(doc, method):
#     opportunity = frappe.get_all(
#         'Opportunity', {'name': doc.name, 'docstatus': 0}, ['*'])
#     for opp in opportunity:
#         if opp.with_items == 0:
#             for new in doc.items_table:
#                 items = frappe.get_all('Item', {'name': new.item_name}, ['*'])
#                 if not items:
#                     frappe.errprint("Hiiiiii")
#                     frappe.errprint(items)
#                     item = frappe.new_doc("Item")
#                     item.item_code = new.item_code
#                     item.item_name = new.item_name
#                     item.stock_uom = new.uom
#                     item.qty = new.qty
#                     item.item_name = new.item_name
#                     item.item_name = new.item_name
#                     item.item_name = new.item_name
#                     item.item_name = new.item_name
#                     item.item_group = "Finish Goods"
#                     item.save(ignore_permissions=True)

@frappe.whitelist()
def create_technical_costing(doc, method):
    for opp_item in doc.items:
        # tc_id = frappe.db.exists('Technical Costing',{'item_code': opp_item.name,'opportunity':doc.name}, ['*'])
        # if not tc_id:
        tc = frappe.new_doc("Technical Costing")
        tc.opportunity = doc.name
        tc.item_code = opp_item.item_code
        tc.item_name = opp_item.item_name
        tc.item_group = opp_item.item_group
        tc.uom = opp_item.uom
        tc.delivery_term = doc.delivery_term
        tc.qty = opp_item.qty
        tc.append("technical_costing_item",{
            "item_code": opp_item.item_code,
            "item_name": opp_item.item_name,
            "item_group": opp_item.item_group,
            "sub_group": opp_item.sub_group,
            "uom": opp_item.uom,
            "qty": opp_item.qty,
            "qty_as_per_stock_uom":opp_item.qty_as_per_stock_uom,
            "stock_uom":opp_item.stock_uom,
            "conversion_factor":opp_item.conversion_factor,
            "country":opp_item.country,
            "sales_person":opp_item.sales_person,
        })
        tc.save(ignore_permissions=True)

@frappe.whitelist()
def getleaveapplication(employee):
    leave_application = frappe.get_doc('Leave Application', {'employee': employee}, ['*'])
    return leave_application

@frappe.whitelist()
def get_quotation_name(doc,method):
    opp = frappe.get_doc('Opportunity',doc.opportunity)
    if not opp.quotation:
        opp.quotation =doc.name
        opp.save(ignore_permissions=True)
    opp = frappe.get_doc('Commercial Costing',{'opportunity':doc.opportunity})
    if not opp.quotation:
        opp.quotation =doc.name
        opp.save(ignore_permissions=True)
    opp = frappe.get_doc('Technical Costing',{'opportunity':doc.opportunity})
    if not opp.quotation:
        opp.quotation =doc.name
        opp.save(ignore_permissions=True)

# @frappe.whitelist()
# def cancel_att():
#     att = frappe.db.sql(""" update `tabAttendance` set docstatus = 0 where status = "Absent" and attendance_date between '2022-10-01' and '2022-10-11' """)
#     print(att)

# @frappe.whitelist()
# def canceltc():
#     att = frappe.db.sql(""" delete from `tabTechnical Costing`""")
#     print(att)

@frappe.whitelist()
def update_status(doc,method):
    lrjf = frappe.db.sql(
        """select * from `tabLeave Rejoining Form`""", as_dict=1)
    if lrjf:
        for emp in lrjf:
            frappe.errprint(emp.emp_no)
            if emp.re_join:
                employee = frappe.get_doc('Employee', emp.emp_no)
                employee.status = "Active"
                employee.save(ignore_permissions=True)
            
