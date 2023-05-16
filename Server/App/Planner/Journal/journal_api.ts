import {Router} from "express";
import {Journal} from "./journal_data";

export const journal_api = Router();

journal_api.post('/', async (req, res) => {
    let date = new Date(req.body['date'])
    await Journal.add(req.session['username'], date);
    let entry = await Journal.get_entry(req.session['username'], date);
    res.redirect('/wiki/page/' + entry['wiki_title'])
})