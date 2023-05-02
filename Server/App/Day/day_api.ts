import e = require("express");
import {IsLoggedIn, RenderTemplate} from "../../Modules/ServerHelper";
import {Day} from "./day_data";
import {Journal} from "./Journal/journal_data";

export const day_api = e.Router();
day_api.use(IsLoggedIn);

day_api.get('/', async (req, res) => {
    let scores = await Day.get_scores_by_day(req.session['username']);
    let journal = await Journal.get_recent(req.session['username'])
    RenderTemplate(req, res, "Day", "day/index.ejs", {scores: scores, journal: journal})
})