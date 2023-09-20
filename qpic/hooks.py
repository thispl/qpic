from . import __version__ as app_version

app_name = "qpic"
app_title = "QPIC"
app_publisher = "TEAMPRO"
app_description = "Customization for QPIC"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "qpic.erp@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/qpic/css/qpic.css"
# app_include_js = "/assets/qpic/js/qpic.js"

# include js, css files in header of web template
# web_include_css = "/assets/qpic/css/qpic.css"
# web_include_js = "/assets/qpic/js/qpic.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "qpic/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "qpic.install.before_install"
# after_install = "qpic.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "qpic.uninstall.before_uninstall"
# after_uninstall = "qpic.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "qpic.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	'Salary Slip':{
		'before_insert':'qpic.custom.get_ot_calculation_on_salary_slip'
	},
	'Employee Advance':{
		'on_submit':'qpic.custom.salary_advance',
		'on_update':'qpic.custom.skip_workflow_emp_add'
		
	},
	'Update Employee Personal Info':{
		'on_submit':'qpic.custom.update_employee'
	},
	# ,'Resignation Form':{
	# 	'on_submit':'qpic.utils.update_employee_status'
	# }
	'Salary Increment':{
		'on_submit':'qpic.qpic.doctype.salary_increment.salary_increment.update_mis_basic'
	},

	'Leave Application':{
		# 'on_update':'qpic.custom.skip_workflow_state',
		'on_submit':'qpic.custom.create_leave_application',
	},
	'Opportunity':{
		'on_submit':'qpic.custom.create_technical_costing'
	},
	'Quotation':{
		'on_update':'qpic.custom.get_quotation_name',
		# 'on_cancel':'qpic.custom.simple'
	},
	'Sales Order':{
		'on_submit':'qpic.custom.create_product_budget'
	},
	
	

	# 'Payroll Entry':{
	# 	'on_submit':'qpic.utils.generate_custom_payroll',
	# },
	# 'Final Payroll Entry':{
	# 	'on_update':'qpic.utils.submit_payroll',
	# },
	# 'Leave Rejoining Form':{
	# 	'on_update':'qpic.utils.validate_leave_allocation',
		
	# },


	
	# "*": {
	# 	"on_update": "method",
	# 	"on_cancel": "method",
	# 	"on_trash": "method"
	# }
}

# Scheduled Tasks
# ---------------

scheduler_events = {
# 	"all": [
# 		"qpic.tasks.all"
# 	],
	"daily": [
		"qpic.utils.mark_empl_suspend",
		"qpic.utils.mark_empl_active",
		"qpic.mark_attendance.mark_att",
		'qpic.custom.update_employee_status'
	
	],
# 	"hourly": [
# 		"qpic.tasks.hourly"
# 	],
# 	"weekly": [
# 		"qpic.tasks.weekly"
# 	]
# 	"monthly": [
# 		"qpic.tasks.monthly"
# 	]
}

# Testing
# -------

# before_tests = "qpic.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "qpic.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "qpic.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

user_data_fields = [
	{
		"doctype": "{doctype_1}",
		"filter_by": "{filter_by}",
		"redact_fields": ["{field_1}", "{field_2}"],
		"partial": 1,
	},
	{
		"doctype": "{doctype_2}",
		"filter_by": "{filter_by}",
		"partial": 1,
	},
	{
		"doctype": "{doctype_3}",
		"strict": False,
	},
	{
		"doctype": "{doctype_4}"
	}
]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"qpic.auth.validate"
# ]

# Translation
# --------------------------------

# Make link fields search translated document names for these DocTypes
# Recommended only for DocTypes which have limited documents with untranslated names
# For example: Role, Gender, etc.
# translated_search_doctypes = []
fixtures = ['Custom Field','Client Script','Print Format']