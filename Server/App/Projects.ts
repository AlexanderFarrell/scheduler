import * as express from 'express';
import {IApp} from "./App";
import {Router} from "express";
import {IsLoggedIn, RenderTemplate} from "../Modules/ServerHelper";

export class Projects implements IApp {
    GetName(): string {
        return "Projects";
    }

    GetRouter(): express.Router {
        let router = Router();
        router.use(IsLoggedIn);

        router.get("/", (req, res) => {
            RenderTemplate(res, 'Projects', 'projects.ejs', {})
        })

        return router;

    }

    GetWebUrl(): string {
        return "/projects";
    }

}