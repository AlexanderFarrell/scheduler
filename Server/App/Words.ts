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
            const words = (await Data.Query("select * from words order by date desc limit 500")).rows;
            const message = "Words (Recent 10)"
            RenderTemplate(res, "Words", "words", {words: words, message: message});
        })

        router.get("/search/:search_text", async (req, res) => {
            const words = (await Data.Query("select * from words where content like concat('%', $1::text, '%') limit 500",
                req.params.search_text)).rows;
            const message = "Words with " + req.params.search_text;
            RenderTemplate(res, "Words", "words", {words: words, message: message});
        })

        router.post("/search", async (req, res) => {
            if (ContainsBodyArgs(req, res, "term")) {
                res.redirect('/words/search/' + req.body.term)
            } else {
                res.redirect('/words')
            }
        })

        router.get('/browse', async (req, res) => {
            const categories = (await Data.Query(
                `select title, date from words order by date desc`)).rows;
            RenderTemplate(res, "Words", "words_browse", {words: categories})
        })

        router.post("/", async (req, res) => {
            if (ContainsBodyArgs(req, res, "title", "content", "date", "number")) {
                let num = parseInt(req.body['number']);
                const date = req.body['date'];
                const title = req.body['title'];
                const content = req.body['content'];
                if (isNaN(num)) {
                    num = -1;
                }
                if (title.length > 30) {
                    RenderTemplate(res, "Words", "words", {words: [], message: "Error: Title too long, must be 30 characters or less."});
                    return;
                }
                try {
                    await Data.Execute("insert into words (number, date, title, content) values ($1, $2, $3, $4)",
                        num,
                        req.body['date'],
                        req.body['title'],
                        req.body['content']);
                    res.redirect("/words")
                } catch (e) {
                    console.log(e)
                    RenderTemplate(res, "Words", "words", {words: [], message: `Error adding item to database: ${title}. Did not add.`});
                }
            }
        })

        return router;
    }

    GetWebUrl(): string {
        return "/words";
    }


}