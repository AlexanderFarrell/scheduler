import {Router} from "express";
import {RenderTemplate} from "../../Modules/ServerHelper";

export const resources_router = Router()

resources_router.get('/', async (req, res) => {
    RenderTemplate(req, res, 'Stakeholders', 'portfolio/resources.ejs')
})

