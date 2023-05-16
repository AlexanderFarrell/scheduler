import {Router} from "express";
import {Resource} from "../resource_data";
import {monthNames, RenderTemplate} from "../../../../Modules/ServerHelper";
import {resources_router} from "../resource_api";

export const finance_router = Router()

finance_router.get('/', async (req, res) => {
    // let payments = await Resource.Finance.GetPayments(req.session['username']);
    let monthly = await Resource.Finance.GetRevenueByMonth(req.session['username']);
    let annual = await Resource.Finance.GetRevenueByYear(req.session['username']);
    let weekly = await Resource.Finance.GetRevenueByWeek(req.session['username']);
    let customer = await Resource.Finance.GetRevenueByCustomer(req.session['username']);
    let data = {monthly, annual, weekly, customer, tab: "finance.ejs"}

    RenderTemplate(req, res, 'Resources', 'portfolio/finance/finance.ejs', data)
})

finance_router.get('/add', async (req, res) => {
    let payments = await Resource.Finance.GetPayments(req.session['username']);
    // let monthly = await Resource.Finance.GetRevenueByMonth(req.session['username']);
    // let annual = await Resource.Finance.GetRevenueByYear(req.session['username']);
    // let weekly = await Resource.Finance.GetRevenueByWeek(req.session['username']);
    // let customer = await Resource.Finance.GetRevenueByCustomer(req.session['username']);
    let data = {payments, tab: "finance.ejs"}

    RenderTemplate(req, res, 'Resources', 'portfolio/finance/add.ejs', data)
})

finance_router.get('/projector', (req,res) => {
    RenderTemplate(req, res, 'Projector', "portfolio/resources/projector")
})

finance_router.get('/y/:year/w/:week', async (req, res) => {
    let year = parseInt(req.params['year'])
    let week = parseInt(req.params['week'])
    if (!isNaN(year) && !isNaN(week)) {
        let payments = await Resource.Finance.GetPaymentsForWeek(
            req.session['username'],
            week,
            year
        )
        // @ts-ignore
        let total = 0
        payments.forEach(payment => {
            total += parseFloat(payment['amount'])
        })
        let previous = `/portfolio/resources/finance/y/${year}/w/${week-1}`
        let next = `/portfolio/resources/finance/y/${year}/w/${week+1}`

        RenderTemplate(req, res, 'Finances', 'portfolio/finance/time_interval.ejs',
            {payments, message: `Payments for Week ${week} of ${year}`, total, previous, next})
    } else {
        res.sendStatus(400)
    }
})

finance_router.get('/y/:year/m/:month', async (req, res) => {
    let year = parseInt(req.params['year'])
    let month = parseInt(req.params['month'])
    if (!isNaN(year) && !isNaN(month)) {
        let payments = await Resource.Finance.GetPaymentsForMonth(
            req.session['username'],
            month,
            year
        )
        // @ts-ignore
        let total = 0
        payments.forEach(payment => {
            total += parseFloat(payment['amount'])
        })
        let previous = `/portfolio/resources/finance/y/${year}/m/${month-1}`
        let next = `/portfolio/resources/finance/y/${year}/m/${month+1}`

        RenderTemplate(req, res, 'Finances', 'portfolio/finance/time_interval.ejs',
            {payments, message: `Payments for ${monthNames[month-1]} ${year}`, total, previous, next})
    } else {
        res.sendStatus(400)
    }
})

finance_router.post('/', async (req, res) => {
    try {
        await Resource.Finance.AddPayment(
            parseInt(req.body['amount']),
            req.body['customer'],
            req.body['description'],
            new Date(req.body['date']),
            req.session['username']
        );
    } catch (e) {
        console.log(e)
    }
    res.redirect("/portfolio/resources/finance/add")
})