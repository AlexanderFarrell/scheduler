import {Router} from "express";
import {RenderTemplate} from "../../../Modules/ServerHelper";
import {Stakeholder} from "./stakeholder_data";

export const stakeholder_router = Router()

stakeholder_router.get('/', async (req, res) => {
    let customers = await Stakeholder.GetCustomers(req.session['username']);
    RenderTemplate(req, res, 'Stakeholders', 'portfolio/stakeholder.ejs', {customers})
})

