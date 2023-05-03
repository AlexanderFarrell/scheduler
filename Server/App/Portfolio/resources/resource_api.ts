import {Router} from "express";
import {RenderTemplate} from "../../../Modules/ServerHelper";
import {Resource} from "./resource_data";

export const resources_router = Router()

resources_router.get('/', async (req, res) => {
    let payments = await Resource.Finance.GetPayments(req.session['username']);
    let monthly = await Resource.Finance.GetRevenueByMonth(req.session['username']);
    let annual = await Resource.Finance.GetRevenueByYear(req.session['username']);
    let customer = await Resource.Finance.GetRevenueByCustomer(req.session['username']);
    let data = {payments, monthly, annual, customer}
    RenderTemplate(req, res, 'Resources', 'portfolio/resources.ejs', data)
})

resources_router.post('/payment', async (req, res) => {
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
    res.redirect("/portfolio/resources")
})