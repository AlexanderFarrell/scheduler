import {Router} from "express";
import {ContainsBodyArgs, IsLoggedIn, RenderTemplate} from "../../Modules/ServerHelper";
import {Word} from "./word_data";

export const word_api = Router();

word_api.use(IsLoggedIn);

word_api.get("/", async (req, res) => {
    const words = await Word.get_most_recent(req.session['username'], Word.display_count_recent);
    const message = `Words (Recent ${Word.display_count_recent})`;
    const data = {words: words, message: message};
    RenderTemplate(req, res, "Words", "words/index", data);
})

word_api.get('/id/:id', async (req, res) => {
    const word = await Word.get(parseInt(req.params['id']), req.session['username']);
    RenderTemplate(req, res, "Words", "words/word", {word: word})
})

word_api.get("/add", async (req, res) => {
    const words = await Word.get_recently_added(
        req.session['username'],
        Word.display_count_recently_entered
    );
    const message = `Words (Recently entered ${Word.display_count_recently_entered})`
    const data = {words: words, message: message};
    RenderTemplate(req, res, "Words", "words/add", data);
})

word_api.get("/topic", async (req, res) => {
    const topics = await Word.get_word_counts(
        req.query['sorting'] || "none",
        req.session['username']
    );
    const message = `Words by Topic`;
    RenderTemplate(req, res, "Words", "words/topics", {topics: topics, message: message});
})

word_api.get("/topic/:topic", async (req, res) => {
    const words = await Word.get_by_topic(req.params['topic'], req.session['username']);
    const message = `Words about ${req.params['topic']}`
    RenderTemplate(req, res, "Words", "words/list", {words: words, message: message});
})

word_api.post('/edit', async (req, res) => {
    if (ContainsBodyArgs(req, res, 'id', 'word', 'content', 'date')) {
        await Word.update(
            parseInt(req.body['id']),
            req.body['title'] as string,
            req.body['content'] as string,
            new Date(req.body['date'])
        );
    }
    res.redirect('/words/id/' + req.body['id'])
})

word_api.get('/range', async (req, res) => {
    const years = await Word.get_years(req.session['username']);
    if (req.query['start'] != null && req.query['end'] != null) {
        let start = new Date(req.query['start'] as string);
        let end = new Date(req.query['end'] as string);
        const words = await Word.get_range(start, end, req.session['username']);
        const message = `Words between ${start.toLocaleDateString()} and ${end.toLocaleDateString()}`
        const data = {words: words, message: message, years: years};
        RenderTemplate(req, res, "Words", "words/range", data);
    } else {
        RenderTemplate(req, res, "Words", "words/range", {years: years})
    }
})

word_api.get('/search', async (req, res) => {
    if (req.query['term'] != null) {
        const term = (req.query['term'] as string).toLowerCase();
        const words = await Word.search(term, req.session['username']);
        const message = `Words with ${req.query['term']}`;
        const data = {words: words, message: message};
        RenderTemplate(req, res, "Words", "words/search", data)
    } else {
        RenderTemplate(req, res, "Words", "words/search")
    }
})

word_api.get('/browse', async (req, res) => {
    const categories = await Word.get_categories(req.session['username']);
    RenderTemplate(req, res, "Words", "words_browse", {words: categories})
})

word_api.post("/", async (req, res) => {
    if (ContainsBodyArgs(req, res, "title", "content", "date", "number")) {
        if (req.body['title'].length > 30) {
            RenderTemplate(req, res, "Words", "words/words", {words: [], message: "Error: Title too long, must be 30 characters or less."});
            return;
        }

        try {
            await Word.add(
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
