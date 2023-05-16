import * as session from 'express-session';
import {marked} from 'marked';

export function ContainsBodyArgs(req, res, ...args: string[]): boolean {
    args.forEach(a => {
        if (req.body[a] == undefined) {
            return false;
        }
    });

    return true;
}

export function MarkdownToHTML(html: string): string {
    return marked.parse(html);
}

export function IsNotNull(...args) {
    args.forEach(a => {
        if (a == null) {
            return false;
        }
    });

    return true;
}

export function GetYesterday(date: Date) {
    let yesterday = new Date(date)
    yesterday.setDate(date.getDate() - 1)
    return yesterday
}

export function GetTomorrow(date: Date) {
    let yesterday = new Date(date)
    yesterday.setDate(date.getDate() + 1)
    return yesterday
}

// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.com/how-to/javascript

// Returns the ISO week of the date.
// @ts-ignore
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
// @ts-ignore
Date.prototype.getWeekYear = function() {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}

export function SendAsDownload(res, filename: string, content: string) {
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.send(content);
}

export function RenderTemplate(req, res, title, content, data={}) {
    data['title'] = title;
    data['content'] = content;
    data['first_name'] = req.session['first_name']
    res.render('template.ejs', data);
}

export function SetupSession(app) {
    app.use(session({
        secret: app.get('config')['session']['secret'],
        resave: false,
        saveUninitialized: true,
        //cookie: { secure: true }
    }))
}

export function GetDaysInWeek(year: number, week: number) {
    let start_date = new Date(year, 0, 1 + (week - 1) * 7);
    let start_day_of_week = start_date.getDay() - 1;
    start_date.setDate(start_date.getDate() - start_day_of_week);

    let days = []
    for (let i = 0; i < 7; i++) {
        days.push(new Date(year, 0, start_date.getDate() + i))
    }
    return days;
}

export const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]