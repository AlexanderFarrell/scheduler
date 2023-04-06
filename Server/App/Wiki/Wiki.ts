import {IApp} from "../App";
import e = require("express");
import {Router} from "express";
import {Data} from "../../Modules/Database";
import {ContainsBodyArgs, IsLoggedIn, MarkdownToHTML, RenderTemplate, SendAsDownload} from "../../Modules/ServerHelper";

export class Wiki implements IApp{
    GetName(): string {
        return "Wiki";
    }

    GetRouter(): e.Router {
        let router = Router();

        router.use(IsLoggedIn);
        router.get('/', async (req, res) => {
            try {
                let rows = (await Data.Query(`
                    select title, created_on from wiki order by created_on desc limit 30`)).rows;
                    RenderTemplate(res, 'Wiki', 'wiki/index.ejs', {pages: rows});
            } catch (e) {
                RenderTemplate(res, 'Wiki', 'wiki/index.ejs', {error: 'Unable to retrieve recent wiki pages.'});
            }
        });

        router.get("/api/:name", async (req, res) => {
            let name: string = req.params["name"];
            try {
                let page = await this.GetPage(name, req.session['username']);
                res.json({title: page['title'], content: page['content'], created_on: page['created_on']});
            } catch (e) {
                console.error(e)
                res.sendStatus(500);
            }
        })

        router.get("/download/:name", async (req, res) => {
            let name: string = req.params["name"];
            try {
                let page = await this.GetPage(name, req.session['username']);
                SendAsDownload(res, page['title'] + ".md", page['content'] + "\n\n" + page['created_on']);
            } catch (e) {
                console.error(e)
                res.sendStatus(500);
            }
        })

        router.get("/add/title/:title", (req, res) => {
            let title = req.params['title'];
            RenderTemplate(res, 'Wiki', 'wiki/add.ejs', {title: 'title'});
        })

        router.get("/add", (req, res) => {
            RenderTemplate(res, 'Wiki', 'wiki/add.ejs', {title: ''});
        })

        router.get('/page/:name', async (req, res) => {
            let page: string = req.params["name"];
            try {
                let rows = (await Data.Query(`
                    select * from wiki where title=$1 limit 1`,
                    page)).rows;
                if (rows.length > 0) {
                    let data = rows[0];
                    let wiki_page = MarkdownToHTML(data['content']);
                    RenderTemplate(res, data['title'], 'wiki/page.ejs', {wiki_page: wiki_page, content_page: data['content']});
                } else {
                    RenderTemplate(res, 'Not Found - Wiki', 'wiki/page.ejs', {error: `Could not find page ${page.substring(0, 100)}`});
                }
            } catch (e) {
                console.error(e)
                RenderTemplate(res, 'Not Found - Wiki', 'wiki/page.ejs', {error: 'Database error. Please try again later'});
            }
        })

        router.post('/', async (req, res) => {
            if (!ContainsBodyArgs(req, res, 'title', 'content')) {
                RenderTemplate(res, 'New Wiki Page', 'wiki/add.ejs', {error: "Need title and content"});
                return;
            }

            // Add length

            try {
                let title = req.body['title'];
                let content = req.body['content'];
                let account = req.session['username'];

                // await Data.Execute(`insert into wiki (title, content, account_id)
                //                     values ($1, $2, (select id from account where username=$3));`, title, content, account);
                let url = await Wiki.CreatePage(title, content, account);
                res.redirect(url);
            } catch (e) {
                console.error(e);
                RenderTemplate(res, 'New Wiki Page', 'wiki/add.ejs', {error: "Database error. Could not add."});
            }
        })

        router.post('/update', async (req, res) => {
            let page = await this.GetPage(req.body['title'], req.session['username'])
            if (page != null) {
                await Data.Execute(`update wiki set content=$1 where id=$2`, req.body['content'], page['id']);
                res.redirect('/wiki/page/' + req.body['title'])
            } else {
                res.redirect('/wiki')
            }
        })

        return router;
    }

    GetWebUrl(): string {
        return "/wiki";
    }

    static async CreatePage(title: string, content: string, username: string) {
        await Data.Execute(`insert into wiki (title, content, account_id) 
                                    values ($1, $2, (select id from account where username=$3));`, title, content, username);
        return '/wiki/page/' + title;
    }

    async GetPage(name: string, username: string) {
        let rows = (await Data.Query(`
                    select * from wiki where title=$1 and account_id=(select id from account where username=$2) limit 1`,
            name, username)).rows;

        if (rows.length > 0) {
            let page = rows[0];
            return page;
        } else {
            return {title: "Not Found", content: "Not Found", created_on: new Date().toISOString()}
        }
    }
}