import {IApp} from "./App";
import * as express from 'express';
import {Router} from "express";
import {IsLoggedIn, RenderTemplate} from "../Modules/ServerHelper";

export const index_api = Router();

index_api.use(IsLoggedIn);

index_api.get('/', (req, res) => {
    if (req.session['username'] != undefined) {
        res.redirect('/home');
    } else {
        res.redirect('/auth');
    }
})

index_api.get('/home', (req, res) => {
    RenderTemplate(req, res, 'Home', "index.ejs");
}) ;

// export class Home implements IApp {
//     GetName(): string {
//         return "Home";
//     }
//
//     GetRouter(): express.Router {
//         let router = Router();
//
//         router.use(IsLoggedIn);
//         router.get('/', (req, res) => {
//             RenderTemplate(req, res, 'Home', "index.ejs");
//         }) ;
//
//         return router;
//     }
//
//     GetWebUrl(): string {
//         return "/home";
//     }
// }