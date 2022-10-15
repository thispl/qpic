import frappe
from frappe.utils import cstr
from datetime import datetime
from datetime import date,timedelta
import calendar
from dateutil import relativedelta
import time
from frappe.utils import add_to_date, formatdate, get_link_to_form, getdate, nowdate
from frappe.utils import (
	add_days,
	add_months,
	cint,
	date_diff,
	flt,
	get_first_day,
	get_last_day,
	get_link_to_form,
	getdate,
	rounded,
	today,
)

        
@frappe.whitelist()    
def qid_expiry_date():
    employee = frappe.db.get_all('Employee',{'Status':'Active'},['*'])
    data = ''
    data += '<table class = table table - bordered><tr><td colspan = 5>Expired QIDs</td></tr>'
    for emp in employee:
        if emp.resident_id_expiry_date:
            str_date = datetime.strptime(str(today()),'%Y-%m-%d').date()
            expiry = add_days(today(),30) 
            expiry_date = datetime.strptime(str(expiry),'%Y-%m-%d').date()
            if emp.resident_id_expiry_date < str_date:
                data += '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'%(emp.employee,emp.employee_name,emp.resident_id_number,emp.resident_id_expiry_date)
    data += '</table>' 
    frappe.sendmail(
            recipients=['hrm1@qatarpac.net'],
            cc = ['hrm@qatarpac.net'],
            bcc= ['hr@groupteampro.com','abdulla.pi@groupteampro.com'],
            subject=('Employee QID Data'),
            header=('Employee QID Data'),
            message="""
                    Dear Sir,<br><br>
                    %s
                    """ % (data)
        ) 

@frappe.whitelist()    
def re_joining_emp():
    las = frappe.db.get_all('Leave Application',{'leave_type':'Annual Leave','rejoined':0},['*'])
    data = ''
    data += '<table class ="table table-bordered"><tr><td colspan = "5">Re - Joining Employees </td></tr>'
    data += '<tr><td>Employee ID</td><td>Name</td><td>Expected Rejoining date</td>'
    for la in las:
        if la.to_date:
            str_date = datetime.strptime(str(today()),'%Y-%m-%d').date()
            expiry = add_days(today(),30) 
            expiry_date = datetime.strptime(str(expiry),'%Y-%m-%d').date()
            if la.to_date <= expiry_date:
                data += '<tr><td>%s</td><td>%s</td><td>%s</td></tr>'%(la.employee,la.employee_name,la.to_date)
    data += '</table>' 
    frappe.sendmail(
            recipients=['hrm1@qatarpac.net'],
            cc = ['hrm@qatarpac.net'],
            bcc= ['hr@groupteampro.com','abdulla.pi@groupteampro.com'],
            subject=('Expected Leave Re-joining Alert'),
            header=('Re - Joining Employees '),
            message="""
                    Dear Sir/Mam,<br>
                    <p>Kindly find the attached list of Expected Employees Rejoining from Leave </p>
                    %s
                    """ % (data)
        ) 
@frappe.whitelist()    
def leave_application():
    lap = frappe.db.get_all('Leave Application',{'workflow_state':'Approved'},['*'])
    data = ''
    data += '<table class ="table table-bordered"><tr><td colspan ="5">Employees Leave Application </td></tr>'
    for emp in lap:
        if emp.from_date:
            str_date = datetime.strptime(str(today()),'%Y-%m-%d').date()
            expiry = add_days(today(),30) 
            expiry_date = datetime.strptime(str(expiry),'%Y-%m-%d').date()
            if emp.from_date < str_date:
                data += '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'%(emp.employee,emp.employee_name,emp.from_date,emp.to_date)
    data += '</table>'
    frappe.sendmail(
            recipients=['mohamedyousuf.e@groupteampro.com'],
            subject=('Leave Applications'),
            header=('Leave Applications '),
            message="""
                    Dear Sir,<br><br>
                    %s
                    """ % (data)
        ) 

@frappe.whitelist()    
def missed_punch_alert():
    send_misspunch_office_staff()
    send_misspunch_labour()

def send_misspunch_office_staff():
    #office-staff
    misspunch_office_staff = frappe.db.sql("""
	select
		att.employee,
		att.employee_name,
		att.attendance_date,
		att.in_time,
		att.out_time
	from
		`tabAttendance` att
        join `tabEmployee` emp on emp.name = att.employee
		where emp.grade = 'Office Staff'
        and att.attendance_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
        and emp.status = 'Active'
		and (in_time and out_time) is null
	""", as_dict=1)
    office_staff = ''
    office_staff += '<table class = table table - bordered><tr><td colspan = 5>Missed Punch</td></tr>'
    office_staff += '<tr><td>Employee ID</td><td>Name</td><td>Attendance date</td><td>In Time</td><td>Out Time</td>'
    for mp in misspunch_office_staff:
        office_staff += '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'%(mp.employee,mp.employee_name,formatdate(mp.attendance_date),mp.in_time or '',mp.out_time or '') 
    office_staff += '</table>' 
    frappe.sendmail(
            recipients=['hrm1@qatarpac.net'],
            cc = ['hrm1@qatarpac.net'],
            bcc= ['hr@groupteampro.com','abdulla.pi@groupteampro.com'],
            subject=('Office Staff Missed Punch Alert'),
            message="""
                    Dear Sir/Mam,<br>
                    <p>Kindly find the attached Missed Punch List for Yesterday for Office Staff </p>
                    %s
                    """ % (office_staff)
        ) 
    return True
    
def send_misspunch_labour():
    #Labour
    misspunch_labour = frappe.db.sql("""
	select
		att.employee,
		att.employee_name,
		att.attendance_date,
		att.in_time,
		att.out_time
	from
		`tabAttendance` att
        join `tabEmployee` emp on emp.name = att.employee
		where emp.grade in ('Labour','Factory Staff')
        and att.attendance_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
		and emp.status = 'Active'
		and (in_time and out_time) is null
	""", as_dict=1)
    labour = ''
    labour += '<table class = table table - bordered><tr><td colspan = 5>Missed Punch</td></tr>'
    labour += '<tr><td>Employee ID</td><td>Name</td><td>Attendance date</td><td>In Time</td><td>Out Time</td>'
    for mp in misspunch_labour:
        labour += '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'%(mp.employee,mp.employee_name,formatdate(mp.attendance_date),mp.in_time or '',mp.out_time or '') 
    labour += '</table>' 
    frappe.sendmail(
            recipients=['production1@qatarpac.net','production2@qatarpac.net','thiruppathy@qatarpac.net','jeyakumar@qatarpac.net'],
            cc = ['hrm1@qatarpac.net'],
            bcc= ['hr@groupteampro.com','abdulla.pi@groupteampro.com'],
            subject=('Labour and Factory Staff Missed Punch Alert'),
            message="""
                    Dear Sir/Mam,<br>
                    <p>Kindly find the attached Missed Punch List for Yesterday for Labour and Factory Staff </p>
                    %s
                    """ % (labour)
        ) 
    return True

@frappe.whitelist()
def send_birthday_alert():
    query = """SELECT employee,employee_name,date_of_birth
    FROM  `tabEmployee` 
    WHERE  DATE_ADD(date_of_birth, 
                    INTERVAL YEAR(CURDATE())-YEAR(date_of_birth)
                            + IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(date_of_birth),1,0)
                    YEAR)  
                BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) order by date(date_of_birth)""" 
    birthdays = frappe.db.sql(query,as_dict=1)
    bd_alert = ''
    bd_alert += '<table class = table table - bordered><tr><td colspan = 5>Upcoming Birthdays</td></tr>'
    bd_alert += '<tr><td>Employee ID</td><td>Name</td><td>Birthday</td>'
    for bd in birthdays:
        birth_date = bd.date_of_birth.strftime('%d-%m')
        bd_alert += '<tr><td>%s</td><td>%s</td><td>%s</td></tr>'%(bd.employee,bd.employee_name,str(birth_date)) 
    bd_alert += '</table>' 
    frappe.sendmail(
            # recipients=['hrm1@qatarpac.net'],
            # cc = ['hrm@qatarpac.net'],
            recipients= ['dineshbabu.k@groupteampro.com','abdulla.pi@groupteampro.com'],
            subject=('Birthday Alert'),
            message="""
                    Dear Sir/Mam,<br>
                    <p>Kindly find the attached Birthday List for the Upcoming Month</p>
                    %s
                    """ % (bd_alert)
        ) 



@frappe.whitelist()    
def probation_expiry():
    employee = frappe.db.get_all('Employee',{'Status':'Active'},['employee','employee_name','probation_end_date'])
    data = ''
    data += '<table class = table table - bordered><tr><td colspan = 5>Probation End Date</td></tr>'
    for emp in employee:
        if emp.probation_end_date:
            str_date = datetime.strptime(str(today()),'%Y-%m-%d').date()
            expiry = add_days(today(),30) 
            expiry_date = datetime.strptime(str(expiry),'%Y-%m-%d').date()
            if emp.probation_end_date < expiry_date:
                data += '<tr><td>%s</td><td>%s</td><td>%s</td></tr>'%(emp.employee,emp.employee_name,emp.probation_end_date)
    data += '</table>' 
    frappe.sendmail(
            recipients=['hrm1@qatarpac.net'],
            cc = ['hrm@qatarpac.net'],
            bcc= ['hr@groupteampro.com','abdulla.pi@groupteampro.com'],
            subject=('Probation End Date'),
            header=('Probation End Date'),
            message="""
                    Dear Sir,<br><br>
                    Kindly find the below employees list  having probation end date within a month
                    %s
                    """ % (data)
        ) 

    