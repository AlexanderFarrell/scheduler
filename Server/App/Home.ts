import {IApp} from "./App";
import * as express from 'express';
import {Router} from "express";
import {IsLoggedIn, RenderTemplate} from "../Modules/ServerHelper";

export class Home implements IApp {
    GetName(): string {
        return "Home";
    }

    GetRouter(): express.Router {
        let router = Router();

        router.get('/', (req, res) => {
            RenderTemplate(res, 'Home', "index.ejs");
        }) ;

        return router;
    }

    GetWebUrl(): string {
        return "/";
    }

}