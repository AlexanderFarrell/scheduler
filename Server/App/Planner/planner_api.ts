import {Router} from "express";
import {ContainsBodyArgs, RenderTemplate} from "../../Modules/ServerHelper";
import {IsLoggedIn} from "../Auth/auth_middleware";
import {Planner} from "./planner_data";

export const planner_api = Router();

planner_api.use(IsLoggedIn);

planner_api.get('/', (req, res) => {
    res.redirect('/planner/today')
    // RenderTemplate(req, res, 'Planner', 'planner/index.ejs')
})

planner_api.post('/', async (req, res) => {
    await Planner.AddDailyGoal(
        req.session['username'],
        req.body['title'],
        new Date(Date.now()),
        req.body['amount']
    )
    res.redirect('/planner')
})

planner_api.get('/today', async (req, res) => {
    let daily_goals = await Planner.GetGoalsToday(req.session['username']);
    let data = {daily_goals}
    RenderTemplate(req, res, 'Planner', 'planner/index.ejs', data)
})

planner_api.get('/y/:year', (req, res) => {
    let year = req.params['year']
    RenderTemplate(req, res, 'Planner', 'planner/index.ejs')
})

planner_api.get('/y/:year/m/:month', (req, res) => {
    let year = req.params['year']
    let month = req.params['month']
    RenderTemplate(req, res, 'Planner', 'planner/index.ejs')
})

planner_api.get('/y/:year/w/:week', (req, res) => {
    let year = req.params['year']
    let week = req.params['week']
    RenderTemplate(req, res, 'Planner', 'planner/index.ejs')
})

planner_api.get('/y/:year/m/:month/d/:day', (req, res) => {
    let year = req.params['year']
    let month = req.params['month']
    let day = req.params['day']
    RenderTemplate(req, res, 'Planner', 'planner/index.ejs')
})

