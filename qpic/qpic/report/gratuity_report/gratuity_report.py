# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.utils import date_diff,today,cstr
from dateutil.relativedelta import relativedelta
import datetime
from datetime import date



def execute(filters=None):
	columns, data = [], []
	columns = get_columns(filters)
	data = calculate_gratuity(filters)
	return columns, data

def get_columns(filters):
	columns = []
	columns += [_("Employee ID") + ":Link/Employee:120", _("Employee Name") + ":Data/:250",_("DoJ") + ":Date/:120",_("Year of Service") + ":Data/:300",_("Gratuity") + ":Currency/:120"]
	return columns

def calculate_gratuity(filters):
	
	row = []
	data = []
	employees = frappe.get_all('Employee',{'status':'Active'},['employee_number','employee_name','date_of_joining'])
	for emp in employees:
		from datetime import datetime
		from dateutil import relativedelta
		date_2 = datetime.now()
		# Get the interval between two dates
		diff = relativedelta.relativedelta(date_2, emp.date_of_joining)
		frappe.errprint([diff.years , ' years, ', diff.months, ' months and ', diff.days, ' days'])
		yos = cstr(diff.years) + ' years, ' + cstr(diff.months) +' months and ' + cstr(diff.days) + ' days'
		
		
		exp_years = diff.years
		exp_month = diff.months
		exp_days = diff.days

		basic_salary = frappe.db.get_value('Employee',emp.employee_number,'basic')

		per_day_basic = basic_salary / 30
		
		gratuity_per_year = per_day_basic * 21

		gratuity_per_month = gratuity_per_year / 12

		gratuity_per_day = gratuity_per_month / 30

		earned_gpy = gratuity_per_year * exp_years

		earned_gpm = gratuity_per_month  * exp_month

		earned_gpd = gratuity_per_day * exp_days
		
		total_gratuity = earned_gpy + earned_gpm + earned_gpd
		
		row = [emp.employee_number,emp.employee_name,emp.date_of_joining,yos,total_gratuity]
		if diff.years > 1:
			data.append(row)
	return data
	
