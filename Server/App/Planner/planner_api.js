"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planner_api = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../../Modules/ServerHelper");
var auth_middleware_1 = require("../Auth/auth_middleware");
var planner_data_1 = require("./planner_data");
var journal_data_1 = require("./Journal/journal_data");
var journal_api_1 = require("./Journal/journal_api");
var tracker_api_1 = require("./Tracker/tracker_api");
var tracker_data_1 = require("./Tracker/tracker_data");
exports.planner_api = (0, express_1.Router)();
exports.planner_api.use(auth_middleware_1.IsLoggedIn);
exports.planner_api.use('/journal', journal_api_1.journal_api);
exports.planner_api.use('/tracker', tracker_api_1.tracker_api);
exports.planner_api.post('/update', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                return [4 /*yield*/, planner_data_1.Planner.SetStatus(req.session['username'], req.body['goal_id'], req.body['status'])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.planner_api.post('/update/max', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                return [4 /*yield*/, planner_data_1.Planner.SetMax(req.session['username'], req.body['goal_id'], req.body['max'])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.planner_api.post('/delete/:goal_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var goal_id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                goal_id = parseInt(req.params['goal_id']);
                if (!!isNaN(goal_id)) return [3 /*break*/, 2];
                return [4 /*yield*/, planner_data_1.Planner.DeleteDailyGoal(req.session['username'], goal_id)];
            case 1:
                _a.sent();
                res.redirect('/');
                return [3 /*break*/, 3];
            case 2:
                res.sendStatus(400);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.planner_api.get('/', function (req, res) {
    res.redirect('/planner/today');
});
exports.planner_api.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                date = new Date(req.body['date']);
                console.log(date);
                return [4 /*yield*/, planner_data_1.Planner.AddDailyGoal(req.session['username'], req.body['title'], date, req.body['amount'])];
            case 1:
                _a.sent();
                res.redirect(DateToRoute(date));
                return [2 /*return*/];
        }
    });
}); });
exports.planner_api.get('/today', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date;
    return __generator(this, function (_a) {
        date = new Date();
        res.redirect(DateToRoute(date));
        return [2 /*return*/];
    });
}); });
exports.planner_api.get('/y/:year', function (req, res) {
    var year = parseInt(req.params['year']);
    if (!isNaN(year) && year > -4711) {
        (0, ServerHelper_1.RenderTemplate)(req, res, 'Planner', 'planner/index.ejs', {
            message: "".concat(year, " - Planner"),
            previous: { name: "Last Year",
                link: "/planner/y/".concat(year - 1) },
            next: { name: "Last Year",
                link: "/planner/y/".concat(year + 1) },
            page: 'year.ejs',
            monthNames: ServerHelper_1.monthNames,
            year: year
        });
    }
    else {
        res.sendStatus(400);
    }
});
exports.planner_api.get('/y/:year/m/:month', function (req, res) {
    var year = parseInt(req.params['year']);
    var month = parseInt(req.params['month']);
    if (!isNaN(month) && !isNaN(year)) {
        var previous = month - 1;
        var next = month + 1;
        var previousMonthYear = year;
        var nextMonthYear = year;
        var name_1 = ServerHelper_1.monthNames[month - 1];
        var days = (0, ServerHelper_1.GetDaysInMonth)(month, year);
        if (previous <= 0) {
            previousMonthYear = year - 1;
            previous = 12;
        }
        if (next >= 13) {
            nextMonthYear = year + 1;
            next = 1;
        }
        (0, ServerHelper_1.RenderTemplate)(req, res, 'Planner', 'planner/index.ejs', {
            message: "Month of ".concat(ServerHelper_1.monthNames[month - 1], " ").concat(year),
            previous: { name: "Last Month",
                link: "/planner/y/".concat(previousMonthYear, "/m/").concat(previous) },
            next: { name: "Last Month",
                link: "/planner/y/".concat(nextMonthYear, "/m/").concat(next) },
            page: 'month.ejs',
            year: year,
            month: month,
            days: days,
            // @ts-ignore
            monthName: name_1
        });
    }
    else {
        res.sendStatus(400);
    }
});
exports.planner_api.get('/y/:year/w/:week', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var year, week, previous, next, previousWeekYear, nextWeekYear, dailyGoals;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                year = parseInt(req.params['year']);
                week = parseInt(req.params['week']);
                if (!(!isNaN(year) && !isNaN(week))) return [3 /*break*/, 2];
                previous = week - 1;
                next = week + 1;
                previousWeekYear = year;
                nextWeekYear = year;
                if (previous <= -1) {
                    previousWeekYear = year - 1;
                    previous = 52;
                }
                if (next >= 53) {
                    nextWeekYear = year + 1;
                    next = 0;
                }
                return [4 /*yield*/, planner_data_1.Planner.GetDailyGoalsForWeek(req.session['username'], year, week)];
            case 1:
                dailyGoals = _a.sent();
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Planner', 'planner/index.ejs', {
                    message: "Week ".concat(week, " of ").concat(year, " - Planner"),
                    page: 'week.ejs',
                    year: year,
                    week: week,
                    previous: { name: "Week ".concat(previous), link: "/planner/y/".concat(previousWeekYear, "/w/").concat(previous) },
                    next: { name: "Week ".concat(next), link: "/planner/y/".concat(nextWeekYear, "/w/").concat(next) },
                    days: (0, ServerHelper_1.GetDaysInWeek)(year, week),
                    daily_goals: dailyGoals,
                    // tracker_vals: await Tracker.Analytics.get_for_week(
                    //     req.session['username'],
                    //     week,
                    //     year
                    // ),
                    WeekDayNames: ServerHelper_1.WeekDayNames
                });
                return [3 /*break*/, 3];
            case 2:
                res.redirect('/planner');
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.planner_api.get('/y/:year/m/:month/d/:day', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var year, month, day, today_date, journal, tracker_data, yesterday, tomorrow, week, daily_goals, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                year = parseInt(req.params['year']);
                month = parseInt(req.params['month']);
                day = parseInt(req.params['day']);
                today_date = new Date(year, month - 1, day);
                return [4 /*yield*/, journal_data_1.Journal.get_entry(req.session['username'], today_date)];
            case 1:
                journal = _a.sent();
                return [4 /*yield*/, tracker_data_1.Tracker.get_for_day(req.session['username'], today_date)];
            case 2:
                tracker_data = _a.sent();
                yesterday = (0, ServerHelper_1.GetYesterday)(today_date);
                tomorrow = (0, ServerHelper_1.GetTomorrow)(today_date);
                week = today_date.getWeek();
                return [4 /*yield*/, planner_data_1.Planner.GetGoals(req.session['username'], today_date)];
            case 3:
                daily_goals = _a.sent();
                data = {
                    daily_goals: daily_goals,
                    message: "".concat(day, " ").concat(ServerHelper_1.monthNames[month - 1], " ").concat(year),
                    previous: { name: "Yesterday", link: DateToRoute(yesterday) },
                    next: { name: "Tomorrow", link: DateToRoute(tomorrow) },
                    today_date: today_date,
                    week: week,
                    year: year,
                    month: month + 1,
                    day: day,
                    monthName: ServerHelper_1.monthNames[month - 1],
                    page: 'day.ejs',
                    journal: journal,
                    tracker_data: tracker_data,
                    WeekDayNames: ServerHelper_1.WeekDayNames
                };
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Planner', 'planner/index.ejs', data);
                return [2 /*return*/];
        }
    });
}); });
function DateToRoute(date) {
    return "/planner/y/".concat(date.getFullYear(), "/m/").concat(date.getMonth() + 1, "/d/").concat(date.getDate());
}
//# sourceMappingURL=planner_api.js.map