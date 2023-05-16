import {Router} from "express";
import {GetDaysInWeek, GetTomorrow, GetYesterday, monthNames, RenderTemplate} from "../../Modules/ServerHelper";
import {IsLoggedIn} from "../Auth/auth_middleware";
import {Planner} from "./planner_data";
import {Journal} from "./Journal/journal_data";
import {journal_api} from "./Journal/journal_api";

export const planner_api = Router();

planner_api.use(IsLoggedIn);
planner_api.use('/journal', journal_api)

planner_api.post('/update', async (req, res) => {
    console.log(req.body)
    await Planner.SetStatus(
        req.session['username'],
        req.body['goal_id'],
        req.body['status']
    )
})

planner_api.post('/update/max', async (req, res) => {
    console.log(req.body)
    await Planner.SetMax(
        req.session['username'],
        req.body['goal_id'],
        req.body['max']
    )
})

planner_api.post('/delete/:goal_id', async (req, res) => {
    let goal_id = parseInt(req.params['goal_id'])
    if (!isNaN(goal_id)) {
        await Planner.DeleteDailyGoal(
            req.session['username'],
            goal_id
        )
        res.redirect('/')
    } else {
        res.sendStatus(400)
    }
})

planner_api.get('/', (req, res) => {
    res.redirect('/planner/today')
})

planner_api.post('/', async (req, res) => {
    let date = new Date(req.body['date'])
    console.log(date)
    await Planner.AddDailyGoal(
        req.session['username'],
        req.body['title'],
        date,
        req.body['amount']
    )
    res.redirect(DateToRoute(date))
})

planner_api.get('/today', async (req, res) => {
    let date = new Date();
    res.redirect(DateToRoute(date))
})

planner_api.get('/y/:year', (req, res) => {
    let year = req.params['year']
    RenderTemplate(req, res, 'Planner', 'planner/index.ejs', {
        message: `${year} - Planner`,
        page: 'year.ejs',
        monthNames,
        year
    })
})

planner_api.get('/y/:year/m/:month', (req, res) => {
    let year = req.params['year']
    let month = req.params['month']
    let name = monthNames[parseInt(month)-1]
    RenderTemplate(req, res, 'Planner', 'planner/index.ejs', {
        message: `${name} ${year} - Planner`,
        page: 'month.ejs',
        year,
        month,
        // @ts-ignore
        monthName: name
    })
})

planner_api.get('/y/:year/w/:week', (req, res) => {
    let year = parseInt(req.params['year'])
    let week = parseInt(req.params['week'])
    if (!isNaN(year) && !isNaN(week)) {
        let previous = week-1
        let next = week+1
        RenderTemplate(req, res, 'Planner', 'planner/index.ejs', {
            message: `Week ${week} of ${year} - Planner`,
            page: 'week.ejs',
            year: year,
            previous: {name: `Week ${previous}`, link: `/planner/y/${year}/w/${previous}`},
            next: {name: `Week ${next}`, link: `/planner/y/${year}/w/${next}`},
            days: GetDaysInWeek(year, week)
        })
    } else {
        res.redirect('/planner')
    }
})

planner_api.get('/y/:year/m/:month/d/:day', async (req, res) => {
    let year = parseInt(req.params['year'])
    let month = parseInt(req.params['month'])
    let day = parseInt(req.params['day'])
    let today_date = new Date(year, month-1, day)
    let journal = await Journal.get_entry(req.session['username'], today_date);
    let yesterday= GetYesterday(today_date)
    let tomorrow= GetTomorrow(today_date)
    // @ts-ignore
    let week = today_date.getWeek()

    let daily_goals = await Planner.GetGoals(req.session['username'], today_date);
    let data = {
        daily_goals,
        message: `${day} ${monthNames[month-1]} ${year}`,
        previous: {name: `Yesterday`, link: DateToRoute(yesterday)},
        next: {name: `Tomorrow`, link: DateToRoute(tomorrow)},
        today_date,
        week,
        year,
        month: month+1,
        day,
        monthName: monthNames[month-1],
        page: 'day.ejs',
        journal
    }
    RenderTemplate(req, res, 'Planner', 'planner/index.ejs', data)
})

function DateToRoute(date: Date) {
    return `/planner/y/${date.getFullYear()}/m/${date.getMonth()+1}/d/${date.getDate()}`
}