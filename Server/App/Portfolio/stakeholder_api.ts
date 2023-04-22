import {Router} from "express";
import {RenderTemplate} from "../../Modules/ServerHelper";

export const stakeholder_router = Router()

stakeholder_router.get('/', async (req, res) => {
    RenderTemplate(req, res, 'Stakeholders', 'portfolio/stakeholder.ejs')
})

