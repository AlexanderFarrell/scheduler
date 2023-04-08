import {IApp} from "../App";
import {Router} from "express";
import * as express from 'express';
import {ContainsBodyArgs, RenderTemplate} from "../../Modules/ServerHelper";
import * as bcrypt from 'bcrypt';
import {Data} from "../../Modules/Database";

const saltRounds = 10;

export class AuthApp implements IApp {
    public UsernameMinimum = 1;
    public UsernameMaximum = 20;
    public PasswordMinimum = 8;
    public PasswordMaximum = 71; //Probably will be 72, but just to be safe.
    public AccountCreation = true;

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
            if (!this.AccountCreation) {
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
                await this.Create(username, password, first_name, last_name);
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
                let data = await this.Login(username, password);
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

    public async Create(username: string, password: string, first_name: string, last_name: string) {
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

        if (first_name.length == 0) {
            throw new Error(`Please enter your first name`);
        }

        if (last_name.length == 0) {
            throw new Error(`Please enter your last name`)
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
                `insert into account (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)`,
                [username, hash, first_name, last_name]
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
                select *
                from account
                where username=$1
                limit 1
        `, [username]);
            return data.rows.length > 0;
        } catch (e) {
            console.log(e);
            throw new Error("Error connecting to database");
        }
    }

    public async Login(username: string, password: string) {
        let data;
        try {
            data = await Data.Pool.query(`
                select password, first_name, last_name
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

        let hash = data.rows[0]['password'];

        if (await bcrypt.compare(password, hash)) {
            return data.rows[0];
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