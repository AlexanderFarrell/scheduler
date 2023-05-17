"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekDayNames = exports.monthNames = exports.GetDaysInMonth = exports.GetDaysInWeek = exports.SetupSession = exports.RenderTemplate = exports.SendAsDownload = exports.GetTomorrow = exports.GetYesterday = exports.IsNotNull = exports.MarkdownToHTML = exports.ContainsBodyArgs = void 0;
var session = require("express-session");
var marked_1 = require("marked");
function ContainsBodyArgs(req, res) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    args.forEach(function (a) {
        if (req.body[a] == undefined) {
            return false;
        }
    });
    return true;
}
exports.ContainsBodyArgs = ContainsBodyArgs;
function MarkdownToHTML(html) {
    return marked_1.marked.parse(html);
}
exports.MarkdownToHTML = MarkdownToHTML;
function IsNotNull() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    args.forEach(function (a) {
        if (a == null) {
            return false;
        }
    });
    return true;
}
exports.IsNotNull = IsNotNull;
function GetYesterday(date) {
    var yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    return yesterday;
}
exports.GetYesterday = GetYesterday;
function GetTomorrow(date) {
    var yesterday = new Date(date);
    yesterday.setDate(date.getDate() + 1);
    return yesterday;
}
exports.GetTomorrow = GetTomorrow;
// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.com/how-to/javascript
// Returns the ISO week of the date.
// @ts-ignore
Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
};
// Returns the four-digit year corresponding to the ISO week of the date.
// @ts-ignore
Date.prototype.getWeekYear = function () {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
};
function SendAsDownload(res, filename, content) {
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-disposition', "attachment; filename=".concat(filename));
    res.send(content);
}
exports.SendAsDownload = SendAsDownload;
function RenderTemplate(req, res, title, content, data) {
    if (data === void 0) { data = {}; }
    data['title'] = title;
    data['content'] = content;
    data['first_name'] = req.session['first_name'];
    res.render('template.ejs', data);
}
exports.RenderTemplate = RenderTemplate;
function SetupSession(app) {
    app.use(session({
        secret: app.get('config')['session']['secret'],
        resave: false,
        saveUninitialized: true,
        //cookie: { secure: true }
    }));
}
exports.SetupSession = SetupSession;
function GetDaysInWeek(year, week) {
    var start_year_date = new Date(year, 0, 0);
    var days_back = start_year_date.getDay() - 1;
    var days = [];
    for (var i = 0; i < 7; i++) {
        var day = new Date(year);
        day.setDate((start_year_date.getDate() - days_back) + (week * 7) + i);
        day.setFullYear(year);
        days.push(day);
    }
    return days;
    // let start_date = new Date(year, 0, 1 + (week - 1) * 7);
    // let start_day_of_week = start_date.getDay() - 1;
    // start_date.setDate(start_date.getDate() - start_day_of_week);
    //
    // let days = []
    // for (let i = 0; i < 7; i++) {
    //     days.push(new Date(year, 0, start_date.getDate() + i))
    // }
    // return days;
}
exports.GetDaysInWeek = GetDaysInWeek;
function GetDaysInMonth(month, year) {
    var dates = [];
    var startDate = new Date(year, month - 1, 1);
    var endDate = new Date(year, month, 0);
    for (var date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date));
    }
    return dates;
}
exports.GetDaysInMonth = GetDaysInMonth;
exports.monthNames = [
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
];
exports.WeekDayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];
//# sourceMappingURL=ServerHelper.js.map