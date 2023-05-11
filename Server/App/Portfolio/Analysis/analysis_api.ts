import {Router} from "express";
import {RenderTemplate} from "../../../Modules/ServerHelper";
import {Project} from "../Project/project_data";

export const analysis_router = Router()

analysis_router.get('/', async (req, res) => {
    req.query['min_priority'] = req.query['min_priority'] || "0"
    let projects = await Project.get_analysis(req.session['username'], req.query);
    let category_data = await Project.get_categories(req.session['username']);
    let categories = category_data.map(c => c['title']);
    categories.push('All');
    RenderTemplate(req, res, 'Portfolio Analysis', 'portfolio/Analysis.ejs', {projects, priority: req.query['min_priority'] || 0, sort: req.query['sort'] || 'Only Priority', categories, category: req.query['category'] || "All"})
})