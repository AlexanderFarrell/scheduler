import {Router} from "express";
import {ContainsBodyArgs, IsNotNull, RenderTemplate} from "../../Modules/ServerHelper";
import {Project} from "./project_data";

export const project_router = Router()

project_router.get("/create", (req, res) => {
    let data = (req.query['parent'] ? {parent: req.query['parent']} : {})
    RenderTemplate(req, res, 'Portfolio', 'portfolio/create.ejs', data)
})

project_router.post('/create', async (req, res) => {
    let {title} = req.body;
    if (!IsNotNull(req, res, title)) {
        RenderTemplate(req, res, 'Portfolio', 'portfolio/create.ejs', {error: "Please enter all fields"})
    }

    try {
        await Project.add(title, req.session['username']);

        if (req.body['parent'] != null) {
            let child = await Project.get(title, req.session['username']);
            await Project.set_parent(child, req.session['username'], req.body['parent'] as string);
            res.redirect('/portfolio/project/' + req.body['parent'])
        } else {
            res.redirect('/portfolio')
        }

    } catch (e) {
        console.error(e);
        RenderTemplate(req, res, 'Portfolio', 'portfolio/create.ejs', {error: "Error saving new project."})
    }
})

project_router.post('/update', async (req, res) => {
    try {
        console.log(req.body)
        if (ContainsBodyArgs(req, res, 'status', 'time', 'maintenance', 'priority', 'category', 'title')) {
            let project = await Project.get(req.body['project'], req.session['username'])
            await Project.update(project, req.body['title'], req.body['status'], req.body['time'], req.body['maintenance'], req.body['priority'])
            await Project.set_category(project, req.body['category'], req.session['username'])
            res.redirect('/portfolio/project/' + req.body['title'])
        }
    } catch (e) {
        console.error(e)
        res.redirect('/portfolio/project/' + req.body['project'])
    }
})

project_router.post('/delete', async (req, res) => {
    await Project.delete(req.body['project'], req.session['username'])
    res.redirect('/portfolio')
})

project_router.post('/parent', async (req, res) => {
    let project = await Project.get(req.body['project'], req.session['username']);
    try {
        await Project.set_parent(project, req.session['username'], req.body['parent']);
        res.redirect('/portfolio/project/' + project['title'])
    } catch (e) {
        console.log(e)
        res.redirect('/portfolio')
    }
})

project_router.post('/parent/delete', async (req, res) => {
    let project = Project.get(req.body['project'], req.session['username']);
    try {
        await Project.remove_parent(project);
        res.redirect('/portfolio/project/' + project['title'])
    } catch (e) {
        console.log(e)
        res.redirect('/portfolio')
    }
})

project_router.get('/category/:category', async (req, res) => {
    let projects = await Project.get_by_category(req.params['category'], req.session['username']);
    RenderTemplate(req, res, req.params['category'] + " Projects", 'portfolio/results.ejs', {
        projects, message: req.params['category'] + " Projects"
    })
})

project_router.post('/category', async (req, res) => {
    let project = await Project.get(req.body['project'], req.session['username']);
    if (project != null) {
        await Project.set_category(project, req.body['category'], req.session['username']);
    }
    res.redirect('/portfolio/project/' + req.body['project'])
})

project_router.get('/:name', async (req, res) => {
    let title = "error";
    let data = {};
    try {
        let project = await Project.get(req.params['name'], req.session['username']);
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

    RenderTemplate(req, res, `${title} - Projects`, 'portfolio/project.ejs', data);
})