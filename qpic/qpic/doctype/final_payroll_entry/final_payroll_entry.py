# Copyright (c) 2022, TEAMPRO and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import datetime
from datetime import date, timedelta

from frappe.model.document import Document


class FinalPayrollEntry(Document):
    pass


@frappe.whitelist()
def final_html_view(from_date,to_date,grade):
    salary_slips = frappe.get_all(
        "Salary Slip", {'start_date':from_date, 'end_date':to_date,'grade':grade,'docstatus':0}, ['*'])

    # last_day_of_prev_month = date.today().replace(day=1) - timedelta(days=1)
    # frappe.errprint(last_day_of_prev_month)
    # start_day_of_prev_month = date.today().replace(day=1) - timedelta(days=last_day_of_prev_month.day)
    # frappe.errprint(start_day_of_prev_month)
    # today = from_date
    # first = today.replace(day=1)
    # lastMonth = first - datetime.timedelta(days=1)
    # frappe.errprint(lastMonth.strftime("%Y%m"))





    i = 1
    basicss = 0
    paydays = 0
    earneddays = 0
    over_t = 0
    w_ot = 0
    h_ot = 0
    tot = 0
    h_r_a = 0
    c_a = 0
    m_a = 0
    m_a_a = 0
    f_a = 0
    p_i = 0
    a_r_r = 0
    o_a = 0
    grs_pay = 0
    l_o = 0
    a_d = 0
    o_t_h = 0
    tot_ded = 0
    n_pay = 0
    vac = 0
    m_a_a_1 = 0
    a_t_a = 0

    for ss in salary_slips:
        basic = frappe.get_value('Salary Detail', {
                                 'salary_component': 'Basic', 'parent': ss.name}, ['amount']) or 0
        emp = frappe.get_doc('Employee', {"employee": ss.employee}, ['*'])
        oa = frappe.get_value('Salary Detail', {
                              'salary_component': 'Other Allowance', 'parent': ss.name}, ['amount']) or 0
        va = frappe.get_value('Salary Detail', {
                              'salary_component': 'Vacation', 'parent': ss.name}, ['amount']) or 0
        o = frappe.get_value('Salary Detail', {
                             'salary_component': 'Others', 'parent': ss.name}, ['amount']) or 0
        ma = frappe.get_value('Salary Detail', {
                              'salary_component': 'Mobile Allowance', 'parent': ss.name}, ['amount']) or 0
        arr = frappe.get_value('Salary Detail', {
                               'salary_component': 'Arrear', 'parent': ss.name}, ['amount']) or 0
        fa = frappe.get_value('Salary Detail', {
                              'salary_component': 'Food Allowance', 'parent': ss.name}, ['amount']) or 0
        ot = frappe.get_value('Salary Detail', {
                              'salary_component': 'Overtime', 'parent': ss.name}, ['amount']) or 0
        maa = frappe.get_value('Salary Detail', {
                               'salary_component': 'Monthly Allowance', 'parent': ss.name}, ['amount']) or 0
        lo = frappe.get_value('Salary Detail', {
                              'salary_component': 'Loan', 'parent': ss.name}, ['amount']) or 0
        pi = frappe.get_value('Salary Detail', {
                              'salary_component': 'Production Incentive', 'parent': ss.name}, ['amount']) or 0
        ad = frappe.get_value('Salary Detail', {
                              'salary_component': 'Advance', 'parent': ss.name}, ['amount']) or 0
        oth = frappe.get_value('Salary Detail', {
                               'salary_component': 'Others', 'parent': ss.name}, ['amount']) or 0
        hra = frappe.get_value('Salary Detail', {
                               'salary_component': "House Rent Allowance", 'parent': ss.name}, ["amount"]) or 0
        ca = frappe.get_value('Salary Detail', {
                              'salary_component': "Conveyance Allowance", 'parent': ss.name}, ["amount"]) or 0
        wot = frappe.get_value('Salary Detail', {
                               'salary_component': "Weekend OT", 'parent': ss.name}, ["amount"]) or 0
        hot = frappe.get_value('Salary Detail', {
                               'salary_component': "Holiday OT", 'parent': ss.name}, ["amount"]) or 0
        maa_1 = frappe.get_value('Salary Detail',{
                                'salary_component':"Medical Allowance",'parent':ss.name},["amount"]) or 0
        ata = frappe.get_value('Salary Detail',{
                                'salary_component':'Air Ticket','parent':ss.name},['amount']) or 0

        total = round(ot+wot+hot)
        basicss += round(emp.basic)
        paydays += round(ss.payment_days)
        earneddays += round(basic, 0)
        over_t += round(ss.overtime)
        w_ot += round(ss.weekend_ot)
        h_ot += round(ss.holiday_ot)
        tot += round(total)
        h_r_a += round(hra)
        c_a += round(ca)
        m_a += round(ma)
        m_a_a += round(maa)
        f_a += round(fa, 0)
        p_i += round(pi)
        a_r_r += round(arr)
        o_a += round(oa)
        grs_pay += round(ss.gross_pay)
        l_o += round(lo)
        a_d += round(ad)
        o_t_h += round(oth)
        tot_ded += round(ss.total_deduction, 0)
        n_pay += round(ss.net_pay, 0)
        vac += round(va)
        m_a_a_1+= round(maa_1)
        a_t_a += round(ata)


    return basicss,paydays,earneddays,over_t,w_ot,h_ot,tot,h_r_a,c_a,m_a,m_a_a,f_a,p_i,a_r_r,o_a,grs_pay,l_o,a_d,o_t_h,tot_ded,n_pay,vac,m_a_a_1,a_t_a




