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
def get_current_month(employee):
    ff = frappe.get_value('Leave Application', {'employee': employee}, [
                          'from_date'])
    frappe.errprint(ff)
    now = ff
    days = calendar.monthrange(now.year, now.month)[1]
    return(days)



# @frappe.whitelist()
# def get_leave_application(employee):
#     leave_application = frappe.get_all('Leave Application', {'employee': employee, 'docstatus': 1}, ['custom_from_date''custom_to_date','lop_days','leave_balance','custom_total_leave_days'],limit = 0)
#     return leave_application


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
        if opp_item.item_group == "Small Bag":
            # tc_id = frappe.db.exists('Technical Sheet SB',{'item_code': opp_item.name,'opportunity':doc.name}, ['*'])
            # if not tc_id:
            tc = frappe.new_doc("Technical Sheet SB")
            tc.opportunity = doc.name
            tc.company = doc.company
            tc.payment_terms_template = doc.payment_terms_template
            tc.delivery_schedule = doc.delivery_term
            tc.port = doc.port
            tc.port_type = doc.port_type
            tc.inco_terms = doc.inco_terms
            tc.country = doc.country_port
            tc.city = doc.city_port
            if doc.opportunity_from == "Lead":
                tc.lead = doc.party_name
            else:
                tc.customer = doc.party_name
            tc.opportunity_owner = doc.opportunity_owner
            tc.item_code = opp_item.item_code
            tc.item_name = opp_item.item_name
            tc.item_group = opp_item.item_group
            tc.uom = opp_item.uom
            tc.delivery_term = doc.delivery_term
            tc.qty = opp_item.qty
            tc.notes = doc.note
            for ps in doc.payment_schedule:
                tc.append("payment_schedule",{
                    "payment_term":ps.payment_term,
                    "description":ps.description,
                    "due_date":ps.due_date,
                    "invoice_portion":ps.invoice_portion,
                    "mode_of_payment":ps.mode_of_payment,
                    "discount":ps.discount,
                    "discount_type":ps.discount_type,
                    "payment_amount":ps.payment_amount,
                    "base_payment_amount":ps.base_payment_amount,
                })
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
        if opp_item.item_group == "Fabric":
            tc = frappe.new_doc("Technical Sheet Fabric")
            tc.opportunity = doc.name
            tc.company = doc.company
            tc.payment_terms_template = doc.payment_terms_template
            tc.delivery_schedule = doc.delivery_term
            tc.port = doc.port
            tc.port_type = doc.port_type
            tc.inco_terms = doc.inco_terms
            tc.country = doc.country_port
            tc.city = doc.city_port
            if doc.opportunity_from == "Lead":
                tc.lead = doc.party_name
            else:
                tc.customer = doc.party_name
            tc.opportunity_owner = doc.opportunity_owner
            tc.item_code = opp_item.item_code
            tc.item_name = opp_item.item_name
            tc.item_group = opp_item.item_group
            tc.uom = opp_item.uom
            tc.delivery_term = doc.delivery_term
            tc.qty = opp_item.qty
            tc.notes = doc.note
            for ps in doc.payment_schedule:
                tc.append("payment_schedule",{
                    "payment_term":ps.payment_term,
                    "description":ps.description,
                    "due_date":ps.due_date,
                    "invoice_portion":ps.invoice_portion,
                    "mode_of_payment":ps.mode_of_payment,
                    "discount":ps.discount,
                    "discount_type":ps.discount_type,
                    "payment_amount":ps.payment_amount,
                    "base_payment_amount":ps.base_payment_amount,
                })
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
        if opp_item.item_group == "FIBC":
            tc = frappe.new_doc("Technical Sheet FIBC")
            tc.opportunity = doc.name
            tc.company = doc.company
            if doc.opportunity_from == "Lead":
                tc.lead = doc.party_name
            else:
                tc.customer = doc.party_name
            tc.opportunity_owner = doc.opportunity_owner
            tc.item_code = opp_item.item_code
            tc.item_name = opp_item.item_name
            tc.item_group = opp_item.item_group
            tc.notes = doc.note
            tc.uom = opp_item.uom
            tc.delivery_term = doc.delivery_term
            tc.payment_terms_template = doc.payment_terms_template
            tc.delivery_schedule = doc.delivery_term
            tc.port = doc.port
            tc.port_type = doc.port_type
            tc.inco_terms = doc.inco_terms
            tc.country = doc.country_port
            tc.city = doc.city_port
            for ps in doc.payment_schedule:
                tc.append("payment_schedule",{
                    "payment_term":ps.payment_term,
                    "description":ps.description,
                    "due_date":ps.due_date,
                    "invoice_portion":ps.invoice_portion,
                    "mode_of_payment":ps.mode_of_payment,
                    "discount":ps.discount,
                    "discount_type":ps.discount_type,
                    "payment_amount":ps.payment_amount,
                    "base_payment_amount":ps.base_payment_amount,
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
    if doc.commercial_costing:
        opp = frappe.get_doc('Commercial Costing',{'opportunity':doc.opportunity})
        if not opp.quotation:
            opp.quotation =doc.name
            opp.save(ignore_permissions=True)
    if doc.technical_sheet_sb:
        opp = frappe.get_doc('Technical Sheet SB',{'opportunity':doc.opportunity})
        if not opp.quotation:
            opp.quotation =doc.name
            opp.save(ignore_permissions=True)

# @frappe.whitelist()
# def cancel_att():
#     att = frappe.db.sql(""" update `tabAttendance` set docstatus = 0 where status = "Absent" and attendance_date between '2022-10-01' and '2022-10-11' """)
#     print(att)

# @frappe.whitelist()
# def cancel_tech_sheet():
#     att = frappe.db.sql(""" update `tabTechnical Sheet FIBC` set docstatus = 0 where name = "TS-FIBC-0004" """)
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
            

@frappe.whitelist()
def create_tech_sheet(opportunity,item_code,type_of_ts,loop,top,body,bottom):
    dts = frappe.db.exists('Detailed Technical Sheet',{'opportunity': opportunity,'type_of_ts':type_of_ts,'loop_ts':loop,'top_ts':top,'bottom_ts':bottom,'body_ts':body})
    if dts:
        frappe.throw(
            ("Already Exists")
        )
    if not dts:
        tc = frappe.new_doc("Detailed Technical Sheet")
        opp = frappe.get_doc("Opportunity",opportunity)
        for op in opp.items:
            frappe.errprint(type_of_ts)
            tc.type_of_ts = type_of_ts
            tc.opportunity = opportunity
            tc.item_code = item_code
            tc.item_name = op.item_name
            tc.item_group = op.item_group
            tc.qty = op.qty
            tc.loop_ts = loop
            tc.top_ts = top
            tc.body_ts = body
            tc.bottom_ts = bottom
            tc.append("technical_costing_item",{
                    "item_code": op.item_code,
                    "item_name": op.item_name,
                    "item_group": op.item_group,
                    "sub_group": op.sub_group,
                    "uom": op.uom,
                    "qty": op.qty,
                    "qty_as_per_stock_uom":op.qty_as_per_stock_uom,
                    "stock_uom":op.stock_uom,
                    "conversion_factor":op.conversion_factor,
                    "country":op.country,
                    "sales_person":opp.sales_person,
                })
        tc.save(ignore_permissions=True)





# def get_duplicate(tape):
#     tape = json.loads(tape)
#     l1 = []
#     l2 = []
#     for i in tape:
#         if  i['item_code']:
#             if i['item_code'] not in l1:
#                 l1.append(i["item_code"] or "")
#             else:
#                 l2.append(i["item_code"] or "")
#     return l1

# @frappe.whitelist()
# def checkin_delete():
#     # checkin = frappe.db.sql(""" update `tabEmployee Checkin` set skip_auto_attendance = 0 where date(time)  between '2022-12-01' and '2022-12-31'  """)
#     # print(checkin)
#     # checkin = frappe.db.sql(""" update `tabEmployee Checkin` set attendance = 0 where date(time)  between '2022-12-01' and '2022-12-31' """)
#     # print(checkin)
#     checkin = frappe.db.sql(""" delete from `tabAttendance` where attendance_date between '2022-12-01' and '2022-12-31' """)
#     print(checkin)




@frappe.whitelist()
def create_product_budget(doc,method):
    for item in doc.items:
        if item.commercial_costing_sb:
            cc = frappe.get_doc("Commercial Costing",item.commercial_costing_sb)
            pb = frappe.new_doc("Production Budget")
            pb.loom_fabric_width = cc.loom_fabric_width
            pb.loom_mesh = cc.loom_mesh
            pb.loom_fabric_weight_pcs = cc.loom_fabric_weight_pcs
            pb.loom_gsm = cc.loom_gsm
            pb.loom_linear_meter_wt = cc.loom_linear_meter_wt
            pb.loom_wastage_provision_finishing = cc.loom_wastage_provision_finishing
            pb.loom_order_requirement = cc.loom_order_requirement
            pb.loom_picks_per_min = cc.loom_picks_per_min
            pb.loom_machine_hour = cc.loom_machine_hours
            pb.loom_efficiency = cc.loom_efficiency
            pb.cutting_width = cc.cutting_width
            pb.cutting_length = cc.cutting_length
            pb.cutting_cut_length = cc.cutting_cut_length
            pb.cutting_fabric_thread_wt = cc.cutting_fabric_thread_wt
            pb.cutting_liner_weight_gm = cc.cutting_liner_weight_gm
            pb.cutting_bag_weight_gm = cc.cutting_bag_weight_gm
            pb.cutting_top = cc.cutting_top
            pb.cutting_bottom = cc.cutting_bottom
            pb.cutting_thread_wtbag_gm = cc.cutting_thread_wtbag_gm
            pb.cutting_order_requirement = cc.cutting_order_requirement
            pb.cutting_machine_speed_bagsmin = cc.cutting_machine_speed_bagsmin
            pb.cutting_efficiency = cc.cutting_efficiency
            pb.cutting_machine_hour = cc.cutting_machine_hours
            pb.stitching_order_requirement = cc.stitching_order_requirement
            pb.stitching_bags_manhour = cc.stitching_bags_manhour
            pb.stitching_manhour = cc.stitching_manhour
            pb.customer = cc.customer
            pb.warp = cc.warp
            pb.sales_order = doc.name
            pb.order_quantity = cc.order_quantity
            pb.weft = cc.weft
            pb.width = cc.width
            pb.length = cc.length
            pb.top = cc.top
            pb.bottom = cc.bottom
            pb.print = cc.print
            pb.unit_weight = cc.unit_weight
            pb.one = cc.one
            pb.production_size_cut_leng_x = cc.production_size_cut_leng_x
            pb.production_size_cut_leng_y = cc.production_size_cut_leng_y
            pb.extra = cc.extra
            pb.thread_and_others = cc.thread_and_others
            pb.top_length = cc.top_length
            pb.bottom_length = cc.bottom_length
            pb.top_thread = cc.top_thread
            pb.lamination_optional = cc.lamination_optional
            pb.liner_optional = cc.liner_optional
            pb.bottom_thread = cc.bottom_thread
            pb.coating_side = cc.coating_side
            pb.coating_gsm = cc.coating_gsm
            pb.fabric_gms = cc.fabric_gms
            pb.lamination_gms = cc.lamination_gms
            pb.liner_gms = cc.liner_gms
            pb.other_gms = cc.other_gms
            pb.total = cc.total
            pb.no_of_units = cc.no_of_units
            pb.costing_currency = cc.costing_currency
            pb.lamination_wt_per_pcs_gms = cc.lamination_wt_per_pcs_gms
            pb.liner_weight_gms = cc.liner_weight_gms
            pb.opportunity_owner = cc.opportunity_owner

            pb.total_raw_material_cost = cc.total_raw_material_cost
            pb.cost_pu_raw = cc.cost_pu_raw
            pb.cost_pmt_raw = cc.cost_pmt_raw

            pb.total_quantity_weft = cc.total_quantity_weft
            pb.total_dosage_weft = cc.total_dosage_weft
            pb.weft_raw_material_ = cc.weft_raw_material_
            pb.weft_cost_pu = cc.weft_cost_pu
            pb.weft_cost_pmt = cc.weft_cost_pmt

            pb.total_quantity_warp = cc.total_quantity_warp
            pb.total_dosage_warp = cc.total_dosage_warp
            pb.warp_raw_material_ = cc.warp_raw_material_
            pb.warp_cost_pu = cc.warp_cost_pu
            pb.warp_cost_pmt = cc.warp_cost_pmt

            pb.total_quantity_strip = cc.total_quantity_strip
            pb.total_dosage_strip = cc.total_dosage_strip
            pb.strip_raw_material_ = cc.strip_raw_material_
            pb.strip_cost_pu = cc.strip_cost_pu
            pb.strip_cost_pmt = cc.strip_cost_pmt

            pb.total_quantity_lamination = cc.total_quantity_lamination
            pb.total_dosage_lamination = cc.total_dosage_lamination
            pb.lamination_raw_material_ = cc.lamination_raw_material_
            pb.lam_cost_pu = cc.lam_cost_pu
            pb.lam_cost_pmt = cc.lam_cost_pmt

            pb.total_quantity_liner = cc.total_quantity_liner
            pb.total_dosage_liner = cc.total_dosage_liner
            pb.liner_raw_material_ = cc.liner_raw_material_
            pb.liner_cost_pu = cc.liner_cost_pu
            pb.liner_cost_pmt = cc.liner_cost_pmt

            pb.loom_machine_hours = cc.loom_machine_hours
            pb.loom_manhrmachhr = cc.loom_manhrmachhr
            pb.loom_total_man_hrs = cc.loom_total_man_hrs
            pb.loom_manhr_rate = cc.loom_manhr_rate
            pb.loom_cost = cc.loom_cost

            pb.tape_machine_hours = cc.tape_machine_hours
            pb.tape_manhrmachhr = cc.tape_manhrmachhr
            pb.tape_total_man_hrs = cc.tape_total_man_hrs
            pb.tape_manhr_rate = cc.tape_manhr_rate
            pb.tape_cost = cc.tape_cost

            pb.lamination_machine_hours = cc.lamination_machine_hours
            pb.lamination_manhrmachhr = cc.lamination_manhrmachhr
            pb.lamination_total_man_hrs = cc.lamination_total_man_hrs
            pb.lamination_manhr_rate = cc.lamination_manhr_rate
            pb.lamination_cost = cc.lamination_cost

            pb.blown_film_machine_hours = cc.blown_film_machine_hours
            pb.blown_film_manhr_machhr = cc.blown_film_manhr_machhr
            pb.total_man_hrs = cc.total_man_hrs
            pb.manhr_rate = cc.manhr_rate
            pb.cost = cc.cost

            pb.liner_cutting_machine_hours = cc.liner_cutting_machine_hours
            pb.liner_cutting_manhr_machhr = cc.liner_cutting_manhr_machhr
            pb.liner_cutting_total_man_hrs = cc.liner_cutting_total_man_hrs
            pb.liner_cutting_manhr_rate = cc.liner_cutting_manhr_rate
            pb.liner_cutting_cost = cc.liner_cutting_cost

            pb.printing_machine_hours = cc.printing_machine_hours
            pb.printing_manhrmachhr = cc.printing_manhrmachhr
            pb.printing_total_man_hrs = cc.printing_total_man_hrs
            pb.printing_manhr_rate = cc.printing_manhr_rate
            pb.printing_cost = cc.printing_cost

            pb.cutting_machine_hours = cc.cutting_machine_hours
            pb.cutting_manhr_machhr = cc.cutting_manhr_machhr
            pb.cutting_total_man_hrs = cc.cutting_total_man_hrs
            pb.cutting_manhr_rate = cc.cutting_manhr_rate
            pb.cutting_cost = cc.cutting_cost

            pb.stitching_machine_hours = cc.stitching_machine_hours
            pb.stitching_manhr_machhr = cc.stitching_manhr_machhr
            pb.stitching_total_man_hrs = cc.stitching_total_man_hrs
            pb.stitching_manhr_rate = cc.stitching_manhr_rate
            pb.stitching_cost = cc.stitching_cost


            pb.bailing_machine_hours = cc.bailing_machine_hours
            pb.bailing_manhr_machhr = cc.bailing_manhr_machhr
            pb.bailing_total_man_hrs = cc.bailing_total_man_hrs
            pb.bailing_manhr_rate = cc.bailing_manhr_rate
            pb.bailing_cost = cc.bailing_cost

            pb.total_manpower = cc.total_manpower
            pb.cost_pu_man = cc.cost_pu_man
            pb.cost_pmt_man = cc.cost_pmt_man

            pb.loommachine_hours = cc.loommachine_hours
            pb.loomrate = cc.loomrate
            pb.loomcost = cc.loomcost
            pb.cuttingmachine_hours = cc.cuttingmachine_hours
            pb.cuttingrate = cc.cuttingrate
            pb.cuttingcost = cc.cuttingcost
            pb.blownfilm_machine_hours = cc.blownfilm_machine_hours
            pb.blownfilm__rate = cc.blownfilm__rate
            pb.blownfilm_cost = cc.blownfilm_cost
            pb.total_overhead = cc.total_overhead
            pb.cost_pu_over = cc.cost_pu_over
            pb.cost_pmt_over = cc.cost_pmt_over
            pb.freight_machine_hours = cc.freight_machine_hours
            pb.freight_amount = cc.freight_amount

            pb.freight_rate = cc.freight_rate
            pb.cost_pu_freight = cc.cost_pu_freight
            pb.freight_currency = cc.freight_currency
            pb.cost_pmt_freight = cc.cost_pmt_freight
            pb.quantity_per_cntrtruck = cc.quantity_per_cntrtruck
            pb.incoterms = cc.incoterms
            pb.raw_material_cost = cc.raw_material_cost
            pb.raw_material_cost_pu = cc.raw_material_cost_pu
            pb.raw_material_cost_pmt = cc.raw_material_cost_pmt
            pb.manpower_cost = cc.manpower_cost
            pb.manpower_cost_pu = cc.manpower_cost_pu
            pb.manpower_cost_pmt = cc.manpower_cost_pmt
            pb.overhead_cost = cc.overhead_cost
            pb.overhead_cost_pu = cc.overhead_cost_pu
            pb.overhead_cost_pmt = cc.overhead_cost_pmt
            pb.freight_cost = cc.freight_cost
            pb.freight_cost_pu = cc.freight_cost_pu
            pb.freight_cost_pmt = cc.freight_cost_pmt
            pb.cost_per_order = cc.cost_per_order
            pb.discount_tolerance = cc.discount_tolerance
            pb.cost_per_metric_ton = cc.cost_per_metric_ton
            pb.cost_per_unit = cc.cost_per_unit
            pb.cost_per_metric_ton_usd = cc.cost_per_metric_ton_usd
            pb.cost_per_unit_usd = cc.cost_per_unit_usd
            pb.dis_comp_cost_pmt = cc.dis_comp_cost_pmt
            pb.dis_comp_cost_pu = cc.dis_comp_cost_pu

            pb.dis_cost_pmt = cc.dis_cost_pmt
            pb.dis_cost_pu = cc.dis_cost_pu
            pb.notes = cc.notes
            pb.payment_terms_template = cc.payment_terms_template
            pb.delivery_schedule = cc.delivery_schedule
            pb.port_type = cc.port_type
            pb.port = cc.port
            pb.country = cc.country
            pb.city = cc.city
            pb.inco_terms = cc.inco_terms

            arr = ["Weft","Warp","Strip","Loom","Lamination","Cutting","Liner","Stitching"]
            for route in arr:
                pb.append("routing_sequence",{
                    "operation": route
                })

            for weft in cc.weft_raw_material:
                pb.append('weft_raw_material',{
                    "item_code": weft.item_code,
                    "item_description": weft.item_description,
                    "dosage": weft.dosage,
                    "qty": weft.qty,
                    "rate": weft.rate,
                    "unit": weft.unit,
                    "final_amount": weft.amount,
                    "final_dosage": weft.dosage,
                    "final_qty": weft.qty,
                    "amount": weft.amount,
                    "currency": weft.currency,
                })  
            for warp in cc.warp_raw_material:
                pb.append('warp_raw_material',{
                    "item_code": warp.item_code,
                    "item_description": warp.item_description,
                    "dosage": warp.dosage,
                    "qty": warp.qty,
                    "rate": warp.rate,
                    "unit": warp.unit,
                    "final_amount": warp.amount,
                    "final_dosage": warp.dosage,
                    "final_qty": warp.qty,
                    "amount": warp.amount,
                    "currency": warp.currency,
                })  
            for strip in cc.strip_raw_material:
                pb.append('strip_raw_material',{
                    "item_code": strip.item_code,
                    "item_description": strip.item_description,
                    "dosage": strip.dosage,
                    "qty": strip.qty,
                    "rate": strip.rate,
                    "final_amount": strip.amount,
                    "final_dosage": strip.dosage,
                    "final_qty": strip.qty,
                    "unit": strip.unit,
                    "amount": strip.amount,
                    "currency": strip.currency,
                })  
            for lamination in cc.lamination_raw_material:
                pb.append('lamination_raw_material',{
                    "item_code": lamination.item_code,
                    "item_description": lamination.item_description,
                    "dosage": lamination.dosage,
                    "qty": lamination.qty,
                    "rate": lamination.rate,
                    "unit": lamination.unit,
                    "final_amount": lamination.amount,
                    "final_dosage": lamination.dosage,
                    "final_qty": lamination.qty,
                    "amount": lamination.amount,
                    "currency": lamination.currency,
                })  
            for liner in cc.liner_raw_material:
                pb.append('liner_raw_material',{
                    "item_code": liner.item_code,
                    "item_description": liner.item_description,
                    "dosage": liner.dosage,
                    "qty": liner.qty,
                    "final_amount": liner.amount,
                    "final_dosage": liner.dosage,
                    "final_qty": liner.qty,
                    "rate": liner.rate,
                    "unit": liner.unit,
                    "amount": liner.amount,
                    "currency": liner.currency,
                })  
            for comm in cc.commercial_costing_item:
                pb.append("commercial_costing_item",{
						"item_code": comm.item_code,
						"item_name": comm.item_name,
						"item_group": comm.item_group,
						"sub_group": comm.sub_group,
						"uom": comm.uom,
						"qty": comm.qty,
						"qty_as_per_stock_uom":comm.qty_as_per_stock_uom,
						"stock_uom":comm.stock_uom,
						"conversion_factor":comm.conversion_factor,
						"country":comm.country,
						"sales_person":comm.sales_person,
					})   
            for ps in doc.payment_schedule:
                pb.append("payment_schedule",{
                    "payment_term":ps.payment_term,
                    "description":ps.description,
                    "due_date":ps.due_date,
                    "invoice_portion":ps.invoice_portion,
                    "mode_of_payment":ps.mode_of_payment,
                    "discount":ps.discount,
                    "discount_type":ps.discount_type,
                    "payment_amount":ps.payment_amount,
                    "base_payment_amount":ps.base_payment_amount,
                })
            pb.save(ignore_permissions=True)




# @frappe.whitelist()
# def get_order_route(item_details_list,name):
#     item_details = json.loads(item_details_list)
#     # frappe.errprint(item_details)
#     # seq = frappe.new_doc("Routing")
#     # seq.routing_name = name + "Route"
#     idx = 1
#     for i in item_details:
#         if int(i["order"]) == idx:
#             frappe.errprint(i["name"])
#             # mnth = seq.append("operations")
#             # mnth.operation = i["name"]
#             # mnth.sequence_id = idx
#             # mnth.workstation = i["work"]
        
#     # seq.save(ignore_permissions=True)



@frappe.whitelist()
def get_parent_workstation(bom_no):
    operation = frappe.get_doc("BOM Operation",{'parent':bom_no})
    return operation
        
        