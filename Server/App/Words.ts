import {IApp} from "./App";
import * as express from "express";
import {Router} from "express";
import {ContainsBodyArgs, IsLoggedIn, RenderTemplate} from "../Modules/ServerHelper";
import {Data} from "../Modules/Database";

export class Words implements IApp {
    GetName(): string {
        return "Words";
    }

    GetRouter(): express.Router {
        const router = Router();

        router.use(IsLoggedIn);
        router.get("/", async (req, res) => {
            const words = (await Data.Query("select * from words limit 500")).rows;
            const message = "Words (Recent 10)"
            RenderTemplate(res, "Words", "words", {words: words, message: message});
        })

        router.post("/", async (req, res) => {
            if (ContainsBodyArgs(req, res, "title", "content", "date", "number")) {
                let num = parseInt(req.body['number']);
                if (isNaN(num)) {
                    num = -1;
                }
                await Data.Execute("insert into words (number, date, title, content) values ($1, $2, $3, $4)",
                    num,
                    req.body['date'],
                    req.body['title'],
                    req.body['content']);
            }
            res.redirect("/words")
        })

        return router;
    }

    GetWebUrl(): string {
        return "/words";
    }


}