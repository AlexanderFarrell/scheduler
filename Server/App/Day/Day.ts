import {IApp} from "../App";
import e = require("express");

class DayApp implements IApp {
    GetName(): string {
        return "Day App";
    }

    GetRouter(): e.Router {
        let router = e.Router();



        return router;
    }

    GetWebUrl(): string {
        return "/day";
    }

}