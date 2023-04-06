import * as express from 'express';
import {Router} from 'express';
import {IApp} from "../App";
import {IsLoggedIn, IsNotNull, RenderTemplate} from "../../Modules/ServerHelper";
import {Data} from "../../Modules/Database";
import {Wiki} from "../Wiki/Wiki";
import {Project} from "./Project";

export class Portfolio implements IApp {
    GetName(): string {
        return "Portfolio";
    }

    GetRouter(): express.Router {
        let router = Router();
        router.use(IsLoggedIn);

        router.get("/", async (req, res) => {
            let data = {};
            try {
                data['projects'] = await Project.GetByUser(req.session['username']);
            } catch (e) {
                data['error'] = "Unable to retrieve projects."
            }
            RenderTemplate(res, 'Portfolio', 'portfolio/index.ejs', data)
        })

        router.get('/project/:name', async (req, res) => {
            let title = "error";
            let data = {};
            try {
                let project = await Project.Get(req.params['name'], req.session['username']);
                if (project != null) {
                    title = project['title'];
                    data['project'] = project;
                } else {
                    data['error'] = "Project Not Found";
                }
            } catch (e) {
                console.error(e);
                data['error'] = "Error loading project";
            }

            RenderTemplate(res, `${title} - Projects`, 'portfolio/project.ejs', data);
        })

        router.get("/create", (req, res) => {
            RenderTemplate(res, 'Portfolio', 'portfolio/create.ejs', {})
        })

        router.post('/create', async (req, res) => {
            let {title} = req.body;
            if (!IsNotNull(req, res, title)) {
                RenderTemplate(res, 'Portfolio', 'portfolio/create.ejs', {error: "Please enter all fields"})
            }

            try {
                await Project.Add(title, req.session['username']);
                res.redirect('/portfolio')
            } catch (e) {
                console.error(e);
                RenderTemplate(res, 'Portfolio', 'portfolio/create.ejs', {error: "Error saving new project."})
            }
        })

        router.post('/wiki', async (req, res) => {
            let project = await Project.Get(req.body['project'], req.session['username']);
            if (project != null) {
                await Project.AddWikiPage(project, req.body['title'], req.session['username'], req.body['kind']);
            }
            res.redirect('/portfolio/project/' + req.body['project'])
        })


        router.post("/deliverable", async (req, res) => {
            let project = await Project.Get(req.body['project'], req.session['username']);
            if (project != null) {
                await Project.AddDeliverable(project, req.body['title']);
            }
            res.redirect('/portfolio/project/' + project['title'])
        })

        router.post('/deliverable/track', async (req, res) => {
            console.log(req.body)
            if (req.body['completed'] == 'on') {
                await Data.Execute(`update deliverable set completed=now() where project_id=(select id from project where project.title=$1 and account_id=(select id from account where username=$2)) and title=$3;`, req.body['project'], req.session['username'], req.body['title'])
            } else {
                await Data.Execute(`update deliverable set completed=null where project_id=(select id from project where project.title=$1 and account_id=(select id from account where username=$2)) and title=$3;`, req.body['project'], req.session['username'], req.body['title'])
            }
            res.redirect("/portfolio/project/" + req.body['project'])
        })

        router.get("/objectives", async (req, res) => {
            let data = {};
            try {
                let username = req.session['username'];
                let projects = await Data.Query(`select * from objective where account_id=
                            (select id from account where username=$1) order by created_on desc limit 100`, username);
                data['projects'] = projects.rows;
            } catch (e) {
                data['error'] = "Unable to retrieve projects."
            }
            RenderTemplate(res, 'Portfolio', 'portfolio/index.ejs', data)
        })

        return router;
    }



    GetWebUrl(): string {
        return "/portfolio";
    }

    public DocTemplates = {
        "Main": "",
        "RS": ""
    }
}