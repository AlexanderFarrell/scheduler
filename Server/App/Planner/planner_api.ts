import {Router} from "express";
import {
    GetDaysInMonth,
    GetDaysInWeek,
    GetTomorrow,
    GetYesterday,
    monthNames,
    RenderTemplate, WeekDayNames
} from "../../Modules/ServerHelper";
import {IsLoggedIn} from "../Auth/auth_middleware";
import {Planner} from "./planner_data";
import {Journal} from "./Journal/journal_data";
import {journal_api} from "./Journal/journal_api";
import {tracker_api} from "./Tracker/tracker_api";
import {Tracker} from "./Tracker/tracker_data";

export const planner_api = Router();

planner_api.use(IsLoggedIn);
planner_api.use('/journal', journal_api)
planner_api.use('/tracker', tracker_api)

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
    let year = parseInt(req.params['year'])
    if (!isNaN(year) && year > -4711) {
        RenderTemplate(req, res, 'Planner', 'planner/index.ejs', {
            message: `${year} - Planner`,
            previous: {name: `Last Year`,
                link: `/planner/y/${year-1}`},
            next: {name: `Last Year`,
                link: `/planner/y/${year+1}`},
            page: 'year.ejs',
            monthNames,
            year
        })
    } else {
        res.sendStatus(400)
    }
})

planner_api.get('/y/:year/m/:month', (req, res) => {
    let year = parseInt(req.params['year'])
    let month = parseInt(req.params['month'])

    if (!isNaN(month) && !isNaN(year)) {
        let previous = month-1
        let next = month+1
        let previousMonthYear = year;
        let nextMonthYear = year;
        let name = monthNames[month-1]
        let days = GetDaysInMonth(month, year)

        if (previous <= 0) {
            previousMonthYear = year-1
            previous = 12
        }

        if (next >= 13) {
            nextMonthYear = year+1
            next = 1
        }
        RenderTemplate(req, res, 'Planner', 'planner/index.ejs', {
            message: `Month of ${monthNames[month-1]} ${year}`,
            previous: {name: `Last Month`,
                link: `/planner/y/${previousMonthYear}/m/${previous}`},
            next: {name: `Last Month`,
                link: `/planner/y/${nextMonthYear}/m/${next}`},
            page: 'month.ejs',
            year,
            month,
            days,
            // @ts-ignore
            monthName: name
        })
    } else {
        res.sendStatus(400)
    }

})

planner_api.get('/y/:year/w/:week', async (req, res) => {
    let year = parseInt(req.params['year'])
    let week = parseInt(req.params['week'])
    if (!isNaN(year) && !isNaN(week)) {
        let previous = week-1
        let next = week+1
        let previousWeekYear = year
        let nextWeekYear = year

        if (previous <= -1) {
            previousWeekYear = year-1
            previous = 52
        }

        if (next >= 53) {
            nextWeekYear = year+1
            next = 0
        }

        let dailyGoals = await Planner.GetDailyGoalsForWeek(req.session['username'], year, week)
        RenderTemplate(req, res, 'Planner', 'planner/index.ejs', {
            message: `Week ${week} of ${year} - Planner`,
            page: 'week.ejs',
            year: year,
            week: week,
            previous: {name: `Week ${previous}`, link: `/planner/y/${previousWeekYear}/w/${previous}`},
            next: {name: `Week ${next}`, link: `/planner/y/${nextWeekYear}/w/${next}`},
            days: GetDaysInWeek(year, week),
            daily_goals: dailyGoals,
            // tracker_vals: await Tracker.Analytics.get_for_week(
            //     req.session['username'],
            //     week,
            //     year
            // ),
            WeekDayNames
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
    let tracker_data = await Tracker.get_for_day(req.session['username'], today_date);
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
        journal,
        tracker_data,
        WeekDayNames
    }
    RenderTemplate(req, res, 'Planner', 'planner/index.ejs', data)
})

function DateToRoute(date: Date) {
    return `/planner/y/${date.getFullYear()}/m/${date.getMonth()+1}/d/${date.getDate()}`
}