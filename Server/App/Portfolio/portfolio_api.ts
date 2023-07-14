import {Router} from 'express';
import {RenderTemplate} from "../../Modules/ServerHelper";
import {IsLoggedIn} from "../Auth/auth_middleware";
import {Data} from "../../Modules/Database";
import {Deliverable} from "./Project/Deliverable";
import {analysis_router} from "./Analysis/analysis_api";
import {stakeholder_router} from "./Stakeholder/stakeholder_api";
import {project_router} from "./Project/project_api";
import {resources_router} from "./Resources/resource_api";
import {Project} from "./Project/project_data";

export const portfolio_api = Router();
portfolio_api.use(IsLoggedIn);

portfolio_api.use('/Stakeholder', stakeholder_router);
portfolio_api.use('/Resources', resources_router);
portfolio_api.use('/Project', project_router);
portfolio_api.use('/Analysis', analysis_router);

portfolio_api.get("/", async (req, res) => {
    let data = {};
    try {
        // data['projects'] = await Project.Get(req.session['username']);
        data['unsorted'] = await Project.get_without_category(req.session['username']);
        data['projects_root'] = await Project.get_in_progress(req.session['username'], false);
        data['projects'] = await Project.get_in_progress(req.session['username'], true);
        data['on_going'] = await Project.get_on_going(req.session['username']);
        data['categories'] = await Project.get_categories(req.session['username']);
    } catch (e) {
        data['error'] = "Unable to retrieve projects."
    }
    RenderTemplate(req, res, 'Portfolio', 'portfolio/index.ejs', data)
})

portfolio_api.get('/deliver', async (req, res) => {

    let deliverables = await Deliverable.GetDeliverables(req.session['username'], req.query);
    RenderTemplate(req, res, 'Portfolio Analysis', 'portfolio/deliver.ejs', {deliverables})
})



portfolio_api.post('/wiki', async (req, res) => {
    try {
        let project = await Project.get(req.body['project'], req.session['username']);
        if (project != null) {
            await Project.add_wiki_page(project, req.body['title'], req.session['username'], req.body['kind']);
        }
        res.redirect('/portfolio/project/' + req.body['project'])
    } catch (e) {
        console.error(e)
        res.redirect('/portfolio/project/' + req.body['project'])
    }
})

portfolio_api.post('/news', async (req, res) => {
    try {
        let project = await Project.get(req.body['project'], req.session['username']);
        if (project != null) {
            await Project.add_news_article(project, req.body['title'], req.body['content'], new Date(req.body['date']));
        }
        res.redirect('/portfolio/project/' + req.body['project'] + "/news")
    } catch (e) {
        console.error(e)
        res.redirect('/portfolio/project/' + req.body['project'] + "/news")
    }
})

portfolio_api.post("/deliverable", async (req, res) => {
    let project = await Project.get(req.body['project'], req.session['username']);
    if (project != null) {
        await Deliverable.AddDeliverable(project, req.body['title']);
    }
    res.redirect('/portfolio/project/' + project['title'] + "/deliverables" )
})

portfolio_api.post('/deliverable/track', async (req, res) => {
    console.log(req.body)
    if (req.body['completed'] == 'on') {
        await Data.Execute(`update deliverable set completed=now() where project_id=(select id from project where project.title=$1 and account_id=(select id from account where username=$2)) and title=$3;`, req.body['project'], req.session['username'], req.body['title'])
    } else {
        await Data.Execute(`update deliverable set completed=null where project_id=(select id from project where project.title=$1 and account_id=(select id from account where username=$2)) and title=$3;`, req.body['project'], req.session['username'], req.body['title'])
    }
    res.redirect("/portfolio/project/" + req.body['project'])
})

portfolio_api.get('/search', async (req, res) => {
    RenderTemplate(req, res, 'Stakeholders', 'portfolio/search.ejs')
})

portfolio_api.get('/track', async (req, res) => {
    RenderTemplate(req, res, 'Stakeholders', 'portfolio/track.ejs')
})