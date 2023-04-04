import {IApp} from "../App";
import e = require("express");
import {Router} from "express";
import {Data} from "../../Modules/Database";
import {ContainsBodyArgs, RenderTemplate} from "../../Modules/ServerHelper";

export class Wiki implements IApp{
    GetName(): string {
        return "Wiki";
    }

    GetRouter(): e.Router {
        let router = Router();

        router.get('/', async (req, res) => {
            try {
                let rows = (await Data.Query(`
                    select title from wiki order by created_on limit 30`)).rows;
                    RenderTemplate(res, 'Wiki', 'wiki/index.ejs', {pages: rows});
            } catch (e) {
                RenderTemplate(res, 'Wiki', 'wiki/index.ejs', {error: 'Unable to retrieve recent wiki pages.'});
            }

        });

        router.get('/page/:name', async (req, res) => {
            let page: string = req.params["name"];
            try {
                let rows = (await Data.Query(`
                    select * from wiki where title=$1 limit 1`,
                    page)).rows;
                if (rows.length > 0) {
                    let data = rows[0];
                    RenderTemplate(res, data['title'], 'wiki/page.ejs', {wiki_page: data['content']});
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

                await Data.Execute(`insert into wiki (title, content, account_id) 
                                    values ($1, $2, (select id from account where username=$3));`, title, content, account);
                res.redirect('/wiki/page/' + title);
            } catch (e) {
                console.error(e);
                RenderTemplate(res, 'New Wiki Page', 'wiki/add.ejs', {error: "Database error. Could not add."});
            }
        })

        return router;
    }

    GetWebUrl(): string {
        return "/wiki";
    }
}