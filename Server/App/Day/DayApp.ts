import {IApp} from "../App";
import e = require("express");
import {RenderTemplate} from "../../Modules/ServerHelper";

export class DayApp implements IApp {
    GetName(): string {
        return "Day";
    }

    GetRouter(): e.Router {
        let router = e.Router();

        router.get('/', (req, res) => {
            RenderTemplate(req, res, "Day", "day/index.ejs")
        })

        return router;
    }

    GetWebUrl(): string {
        return "/day";
    }
}