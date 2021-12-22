import {IApp} from "./App";
import {Router} from "express";
import * as express from 'express';
import {ContainsBodyArgs, RenderTemplate} from "../Modules/ServerHelper";
import * as bcrypt from 'bcrypt';
import {Data} from "../Modules/Database";

const saltRounds = 10;

export class Auth implements IApp {
    public UsernameMinimum = 1;
    public UsernameMaximum = 20;
    public PasswordMinimum = 8;
    public PasswordMaximum = 71; //Probably will be 72, but just to be safe.

    public GetName(): string {
        return "Auth";
    }

    public GetRouter(): express.Router {
        let router = Router();

        router.get('/create', (req, res) => {
            RenderTemplate(res, 'Create Account', 'create.ejs', {m: "Enter a username and password."})
        });

        router.post('/create', async (req, res) => {
            if (!ContainsBodyArgs(req, 'username', 'password')) {
                RenderTemplate(
                    res,
                    'Create Account',
                    'create.ejs',
                    {m: "Missing username or password."}
                );
                //res.render("login", {m: "Missing username or password."})
            }

            let username = req.body.username;
            let password = req.body.password;

            try {
                await this.Create(username, password);
                // @ts-ignore
                req.session.username = username;
                res.redirect('/');
            } catch (e) {
                console.log(e);
                RenderTemplate(
                    res,
                    'Create Account',
                    'create.ejs',
                    {m: e.message}
                );
            }
        });

        router.get('/login', (req, res) => {
            RenderTemplate(res, 'Login', 'login.ejs', {m: "Enter a username and password."})
        });

        router.post('/login', async (req, res) => {
            if (!ContainsBodyArgs(req, 'username', 'password')) {
                RenderTemplate(
                    res,
                    'Login',
                    'login.ejs',
                    {m: "Missing username or password."}
                );
            }

            let username = req.body.username;
            let password = req.body.password;

            try {
                await this.Login(username, password);
                // @ts-ignore
                req.session.username = username;
                res.redirect('/');
            } catch (e) {
                console.log(e);
                RenderTemplate(
                    res,
                    'Login',
                    'login.ejs',
                    {m: e.message}
                );
            }
        })

        return router;
    }

    public async Create(username: string, password: string) {
        if (username.length < this.UsernameMinimum) {
            throw new Error(`Username must be at least ${this.UsernameMinimum} characters long.`);
        }

        if (username.length > this.UsernameMaximum) {
            throw new Error(`Username cannot be longer than ${this.UsernameMaximum} characters long.`)
        }

        if (password.length < this.PasswordMinimum) {
            throw new Error(`Password must be at least ${this.PasswordMinimum} characters long.`)
        }

        if (password.length > this.PasswordMaximum) {
            throw new Error(`Password cannot be longer than ${this.PasswordMaximum} characters long.`)
        }

        if (await this.UsernameExists(username)) {
            throw new Error('Username already exists. Please choose a different username.')
        }

        let hash;
        try {
            hash = await bcrypt.hash(password, saltRounds);
        } catch (e) {
            throw new Error("Error accepting password. Please supply a different password.")
        }

        try {
            await Data.Pool.query(
                `insert into account (username, hash) VALUES ($1, $2)`,
                [username, hash]
            )
            return true;
        } catch (e) {
            console.log(e);
            throw new Error("Error creating account. Please try again in a few minutes.")
        }
    }

    public async UsernameExists(username: string) {
        try {
            let data = await Data.Pool.query(`
                select count(*)
                from account
                where username=$1
        `, [username]);
            return data.rows[0] == 1;
        } catch (e) {
            console.log(e);
            throw new Error("Error connecting to database");
        }
    }

    public async Login(username: string, password: string) {
        let data;
        try {
            data = await Data.Pool.query(`
                select hash
                from account
                where username=$1
        `, [username]);
        } catch (e) {
            console.log(e);
            throw new Error("Error connecting to database");
        }

        if (data.rowCount == 0) {
            throw new Error("Incorrect username or password.");
        }

        let hash = data.rows[0]['hash'];

        if (await bcrypt.compare(password, hash)) {
            return true;
        } else {
            throw new Error("Incorrect username or password.");
        }
    }

    public async Delete(username: string, password: string) {

    }

    GetWebUrl(): string {
        return "/auth";
    }
}