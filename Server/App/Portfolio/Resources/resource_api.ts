import {Router} from "express";
import {RenderTemplate} from "../../../Modules/ServerHelper";
import {Resource} from "./resource_data";
import {finance_router} from "./finance/finance_api";

export const resources_router = Router()

resources_router.get('/', async (req, res) => {
    let monthly = await Resource.Finance.GetRevenueByMonth(req.session['username']);
    let annual = await Resource.Finance.GetRevenueByYear(req.session['username']);
    let data = {monthly, annual, tab: "summary.ejs"}

    RenderTemplate(req, res, 'Resources', 'portfolio/Resources.ejs', data)
})

resources_router.use('/finance', finance_router)

