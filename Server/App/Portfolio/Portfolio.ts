import * as express from 'express';
import {IApp} from "../App";
import {Router} from "express";
import {IsLoggedIn, IsNotNull, RenderTemplate} from "../../Modules/ServerHelper";
import {Data} from "../../Modules/Database";

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
                let username = req.session['username'];
                let projects = await Data.Query(`select * from project where account_id=
                            (select id from account where username=$1) order by priority desc limit 10`, username);
                data['projects'] = projects.rows;
            } catch (e) {
                data['error'] = "Unable to retrieve projects."
            }
            RenderTemplate(res, 'Portfolio', 'portfolio/index.ejs', data)
        })

        router.get("/create", (req, res) => {
            RenderTemplate(res, 'Portfolio', 'portfolio/create.ejs', {})
        })

        router.post('/create', async (req, res) => {
            let {title, priority, time, maintenance, description, benefits, risks, notes} = req.body;
            if (!IsNotNull(req, res, title, priority, time, maintenance, description, benefits, risks, notes)) {
                RenderTemplate(res, 'Portfolio', 'portfolio/create.ejs', {error: "Please enter all fields"})
            }

            try {
                let username = req.session['username'];
                if (maintenance == "None") {
                    maintenance = null;
                }
                let sql = `insert into project (title, description, benefits, risks, time, maintenance, priority, notes, account_id) values ($1, $2, $3, $4, $5, $6, $7, $8,                                                              (select id from account where username=$9))`;
                await Data.Execute(sql, title, description, benefits, risks, time, maintenance, priority, notes, username);
                res.redirect('/portfolio')
            } catch (e) {
                console.error(e);
                RenderTemplate(res, 'Portfolio', 'portfolio/create.ejs', {error: "Error saving new project."})
            }
        })

        return router;
    }

    GetWebUrl(): string {
        return "/portfolio";
    }
}