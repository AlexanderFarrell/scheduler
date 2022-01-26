import {IApp} from "./App";
import * as express from 'express';
import {Router} from "express";

export class Index implements IApp {
    GetName(): string {
        return "Index";
    }

    GetRouter(): express.Router {
        let router = Router();

        router.get('/', (req, res) => {
            if (req.session['username'] != undefined) {
                res.redirect('/home/');
            } else {
                res.redirect('/auth/');
            }
        })

        return router;
    }

    GetWebUrl(): string {
        return "/";
    }

}