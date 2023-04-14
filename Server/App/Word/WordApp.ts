import {IApp} from "../App";
import * as express from "express";
import {Router} from "express";
import {ContainsBodyArgs, IsLoggedIn, RenderTemplate} from "../../Modules/ServerHelper";
import {Data} from "../../Modules/Database";
import {Word} from "./Word";

export class WordApp implements IApp {
    GetName(): string {
        return "Words";
    }

    GetRouter(): express.Router {
        const router = Router();

        router.use(IsLoggedIn);
        router.get("/", async (req, res) => {
            const words = (await Data.Query(`select * 
                                                    from words
                                                    where account_id=
                                                        (select id from account where username=$1)
                                                    order by date desc limit 3`, req.session['username'])).rows;
            const message = "Words (Recent 10)"
            RenderTemplate(req, res, "Words", "words/index", {words: words, message: message});
        })

        router.get("/add", async (req, res) => {
            const words = await Word.GetRecentAdded(req.session['username']);
            const message = "Words (Recent 10)"
            RenderTemplate(req, res, "Words", "words/add", {words: words, message: message});
        })

        router.get("/topic", async (req, res) => {
            // const words = (await Data.Query("select * from words order by date desc limit 10")).rows;
            const topics = await Word.GetWordCounts(req.query['sorting'] || "none",
                req.session['username']);
            const message = "Words (Recent 10)"
            RenderTemplate(req, res, "Words", "words/topics", {topics: topics, message: message});
        })

        router.get("/topic/:topic", async (req, res) => {
            // const words = (await Data.Query("select * from words order by date desc limit 10")).rows;
            const words = await Word.GetByTopic(req.params['topic'], req.session['username']);
            const message = "Words (Recent 10)"
            RenderTemplate(req, res, "Words", "words/list", {words: words, message: message});
        })

        router.get('/id/:id', async (req, res) => {
            const word = await Word.Get(parseInt(req.params['id']), req.session['username']);
            RenderTemplate(req, res, "Words", "words/word", {word: word})
        })

        router.post('/edit', async (req, res) => {
            if (ContainsBodyArgs(req, res, 'id', 'word', 'content', 'date')) {
                await Word.Update(
                    parseInt(req.body['id']),
                    req.body['title'] as string,
                    req.body['content'] as string,
                    new Date(req.body['date'])
                );
            }
            res.redirect('/words/id/' + req.body['id'])
        })

        router.get('/range', async (req, res) => {
            const years = await Word.GetYears(req.session['username']);
            if (req.query['start'] != null && req.query['end'] != null) {
                let start = new Date(req.query['start'] as string);
                let end = new Date(req.query['end'] as string);
                const words = await Word.GetRange(start, end, req.session['username']);
                let message = `Words between ${start.toLocaleDateString()} and ${end.toLocaleDateString()}`
                RenderTemplate(req, res, "Words", "words/range", {words: words, message: message, years: years})
            } else {
                RenderTemplate(req, res, "Words", "words/range", {years: years})
            }
        })

        router.get('/search', async (req, res) => {
            if (req.query['term'] != null) {
                const term = (req.query['term'] as string).toLowerCase();
                const words = await Word.Search(term, req.session['username']);
                let message = `Words with ${req.query['term']}`;
                RenderTemplate(req, res, "Words", "words/search",
                    {words: words, message: message})
            } else {
                RenderTemplate(req, res, "Words", "words/search")
            }
        })

        router.get('/browse', async (req, res) => {
            const categories = (await Data.Query(
                `select title, date from words order by date desc`)).rows;
            RenderTemplate(req, res, "Words", "words_browse", {words: categories})
        })

        router.post("/", async (req, res) => {
            if (ContainsBodyArgs(req, res, "title", "content", "date", "number")) {
                if (req.body['title'].length > 30) {
                    RenderTemplate(req, res, "Words", "words/words", {words: [], message: "Error: Title too long, must be 30 characters or less."});
                    return;
                }

                try {
                    await Word.Add(
                        req.body['date'],
                        req.body['title'],
                        req.body['content'],
                        req.session['username']);
                    res.redirect("/words/add")
                } catch (e) {
                    console.log(e)
                    RenderTemplate(req, res, "Words", "words/words", {words: [], message: `Error adding item to database: ${req.body['title']}. Did not add.`});
                }
            }
        })

        return router;
    }

    GetWebUrl(): string {
        return "/words";
    }
}