import {IApp} from "../App";
import {Router} from "express";
import * as express from 'express';
import {ContainsBodyArgs, RenderTemplate} from "../../Modules/ServerHelper";
import {Account} from "./Account";

export class AuthApp implements IApp {

    public GetName(): string {
        return "Auth";
    }

    public GetRouter(): express.Router {
        let router = Router();

        router.get("/", (req, res) => {
            RenderTemplate(req, res, "Scheduler", "auth/index.ejs", {hideHeader: true})
        })

        router.get('/create', (req, res) => {
            RenderTemplate(req, res, 'Create Account', 'auth/create.ejs', {m: "Enter a username and password.", hideHeader: true})
        });

        router.post('/create', async (req, res) => {
            if (!Account.CreationEnabled) {
                RenderTemplate(
                    req,
                    res,
                    'Create Account',
                    'auth/create.ejs',
                    {m: "Account creation is currently disabled for security reasons.", hideHeader: true}
                );
                return;
            }

            if (!ContainsBodyArgs(req, 'username', 'password')) {
                RenderTemplate(
                    req,
                    res,
                    'Create Account',
                    'auth/create.ejs',
                    {m: "Missing username or password.", hideHeader: true}
                );
                return;
            }

            let username = req.body.username;
            let password = req.body.password;
            let first_name = req.body['first_name'];
            let last_name = req.body['last_name'];

            try {
                await Account.Create(username, password, first_name, last_name);
                // @ts-ignore
                req.session.username = username;
                // @ts-ignore
                req.session.first_name = first_name;
                // @ts-ignore
                req.session.last_name = last_name;
                res.redirect('/');
            } catch (e) {
                console.log(e);
                RenderTemplate(
                    res,
                    'Create Account',
                    'auth/create.ejs',
                    {m: e.message, hideHeader: true}
                );
            }
        });

        router.get('/login', (req, res) => {
            RenderTemplate(req, res, 'Login', 'auth/login.ejs', {m: "Enter a username and password.", hideHeader: true})
        });

        router.post('/login', async (req, res) => {
            if (!ContainsBodyArgs(req, 'username', 'password')) {
                RenderTemplate(
                    req,
                    res,
                    'Login',
                    'auth/login.ejs',
                    {m: "Missing username or password.", hideHeader: true}
                );
            }

            let username = req.body.username;
            let password = req.body.password;

            try {
                let data = await Account.Login(username, password);
                // @ts-ignore
                req.session.username = username;
                // @ts-ignore
                req.session.first_name = data.first_name;
                // @ts-ignore
                req.session.last_name = data.last_name
                res.redirect('/');
            } catch (e) {
                console.log(e);
                RenderTemplate(
                    req,
                    res,
                    'Login',
                    'auth/login.ejs',
                    {m: e.message, hideHeader: true}
                );
            }
        })

        router.get('/logout', async (req, res) => {
            delete req.session['username']
            res.redirect('/auth')
        })

        return router;
    }

    GetWebUrl(): string {
        return "/auth";
    }
}