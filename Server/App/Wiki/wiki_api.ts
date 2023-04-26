import {Router} from "express";
import {ContainsBodyArgs, IsLoggedIn, RenderTemplate, SendAsDownload} from "../../Modules/ServerHelper";
import {Wiki} from "./wiki_data";

export const wiki_api = Router();

wiki_api.use(IsLoggedIn);
wiki_api.get('/', async (req, res) => {
    let page = await Wiki.get(`Home`, req.session['username']);
    if (page != null) {
        RenderTemplate(req, res,
            `Home - Wiki`,
            'wiki/page.ejs',
            {page: page['content']})
    } else {
        RenderTemplate(req, res, 'WikiApp', 'wiki/add.ejs', {title: 'Home'});
    }
});

wiki_api.get('/recent', async (req, res) => {
    try {
        RenderTemplate(req, res,
            'WikiApp',
            'wiki/index.ejs',
            {pages: await Wiki.get_recent(req.session['username'])});
    } catch (e) {
        RenderTemplate(req, res, 'Recent - Wiki', 'wiki/index.ejs', {error: 'Unable to retrieve recent wiki pages.'});
    }
})

wiki_api.get("/api/:name", async (req, res) => {
    let name: string = req.params["name"];
    try {
        let page = await Wiki.get(name, req.session['username']);
        res.json({title: page['title'], content: page['content'], created_on: page['created_on']});
    } catch (e) {
        console.error(e)
        res.sendStatus(500);
    }
})

wiki_api.get("/download/:name", async (req, res) => {
    let name: string = req.params["name"];
    try {
        let page = await Wiki.get(name, req.session['username']);
        SendAsDownload(res, page['title'] + ".html", page['content'] + "\n\n" + page['created_on']);
    } catch (e) {
        console.error(e)
        res.sendStatus(500);
    }
})

wiki_api.get("/add/title/:title", (req, res) => {
    RenderTemplate(req, res, 'WikiApp', 'wiki/add.ejs', {title: 'title'});
})

wiki_api.get("/add", (req, res) => {
    RenderTemplate(req, res, 'WikiApp', 'wiki/add.ejs', {title: ''});
})

wiki_api.get('/page/:name', async (req, res) => {
    try {
        let page = await Wiki.get(req.params['name'], req.session['username'])
        if (page != null) {
            RenderTemplate(req, res, page['title'], 'wiki/page.ejs', {page: page['content']});
        } else {
            RenderTemplate(req, res, 'Not Found - WikiApp', 'wiki/page.ejs', {error: `Could not find page ${req.params['name'].substring(0, 100)}`});
        }
    } catch (e) {
        console.error(e)
        RenderTemplate(req, res, 'Not Found - WikiApp', 'wiki/page.ejs', {error: 'Database error. Please try again later'});
    }
})

wiki_api.post('/', async (req, res) => {
    if (!ContainsBodyArgs(req, res, 'title', 'content')) {
        RenderTemplate(req, res, 'New WikiApp Page', 'wiki/add.ejs', {error: "Need title and content"});
        return;
    }

    // Add length

    try {
        let title = req.body['title'];
        let content = req.body['content'];
        let account = req.session['username'];
        await Wiki.add(title, content, account);
        res.redirect('/wiki/page/' + title);
    } catch (e) {
        console.error(e);
        RenderTemplate(req, res, 'New WikiApp Page', 'wiki/add.ejs', {error: "Database error. Could not add."});
    }
})

wiki_api.post('/update', async (req, res) => {
    await Wiki.update(req.body['title'],
        req.session['username'],
        req.body['content'],
        req.body['new_title']);
    let url = '/wiki/page/' + req.body['new_title']
    res.redirect(url)
})

wiki_api.get('/search', async (req, res) => {
    if (req.query['term'] != null) {
        let pages = await Wiki.search(req.query['term'] as string, req.session['username']);
        RenderTemplate(req, res, "Search Wiki", 'wiki/search.ejs', {results: pages});
    } else {
        RenderTemplate(req, res, "Search Wiki", 'wiki/search.ejs');
    }
})