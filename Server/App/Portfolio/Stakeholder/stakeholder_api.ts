import {Router} from "express";
import {RenderTemplate} from "../../../Modules/ServerHelper";
import {Stakeholder} from "./stakeholder_data";
import {Finance} from "../Resources/finance/finance_data";

export const stakeholder_router = Router()

stakeholder_router.get('/', async (req, res) => {
    let customers = await Stakeholder.GetCustomers(req.session['username']);
    RenderTemplate(req, res, 'Stakeholders', 'portfolio/Stakeholder.ejs', {customers})
})

stakeholder_router.get('/add', async (req, res) => {
    // let customers = await Stakeholder.GetCustomers(req.session['username']);
    RenderTemplate(req, res, 'Stakeholders', 'portfolio/stakeholder/stakeholder_add.ejs')
})

stakeholder_router.get('/n/:name', async (req, res) => {
    let name = req.params['name'];
    let stakeholder = await Stakeholder.GetStakeholder(req.session['username'], name);
    let payments = await Finance.GetRevenueFrom(req.session['username'], name);
    RenderTemplate(req, res, name + " - Stakeholder", "portfolio/stakeholder/profile.ejs", {stakeholder, payments});
})