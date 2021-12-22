import {IApp} from "./App";
import * as express from 'express';
import {Router} from "express";
import {ContainsBodyArgs, IsLoggedIn, RenderTemplate} from "../Modules/ServerHelper";
import {Data} from "../Modules/Database";

export class Idea implements IApp {
    GetName(): string {
        return "Idea";
    }

    GetRouter(): express.Router {
        let router = Router();

        router.use(IsLoggedIn);
        router.get('/', async (req, res) => {

            try {
                // @ts-ignore
                let username = req.session.username;
                let ideas = await this.GetIdeas(username);

                RenderTemplate(res, 'Ideas', 'idea.ejs', {ideas: ideas})

            } catch (e) {
                console.log(e);
                RenderTemplate(res, 'Ideas', 'idea.ejs', {error: "Error getting ideas from server."})
            }
        })

        router.post('/', async (req, res) => {
            if (!ContainsBodyArgs(req, res, 'idea')) {
                res.sendStatus(404);
            }

            // @ts-ignore
            let username = req.session.username;
            let idea = req.body.idea;

            try {
                await Data.Pool.query(`call add_idea($1, $2)`, [idea, username]);
                res.redirect('/idea');
            } catch (e) {

            }
        })

        return router;
    }

    GetWebUrl(): string {
        return "/idea";
    }

    async GetIdeas(username) {
        let d = await Data.Pool.query(`
        select name, public_id
        from idea
        inner join item i on i.id = idea.item_id
        where account_id=(select id from account where username=$1)`, [username]);
        let a = d.rows;
        return a;
    }
}