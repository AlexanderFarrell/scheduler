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
exports.Planner = void 0;
var Database_1 = require("../../Modules/Database");
exports.Planner = {
    AddDailyGoal: function (username, title, date, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // language=PostgreSQL
                    return [4 /*yield*/, Database_1.Data.Execute("call add_daily_goal($1, 0, $2, $3, $4)", title, amount, date.toISOString(), username)];
                    case 1:
                        // language=PostgreSQL
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    DeleteDailyGoal: function (username, goal_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("delete from goal\n                where account_id=(select id from account where username=$1)\n                and id=$2\n                ", username, goal_id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    GetGoalsToday: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * from daily_goals \n                where day=date(now())\n                and account_id=(select id from account where username=$1)\n                order by max desc;", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetGoals: function (username, date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(Database_1.Data.ToSQLDate(date));
                        return [4 /*yield*/, Database_1.Data.QueryRows("select * from daily_goals \n                where day=$2\n                and account_id=(select id from account where username=$1)\n                order by status-max,\n                    max desc;", [username, Database_1.Data.ToSQLDate(date)])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetDailyGoalsForWeek: function (username, year, week) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * from daily_goals \n                where extract(week from day)=$2\n                  and extract(year from day)=$3\n                and account_id=(select id from account where username=$1)\n                order by day;", [username, week, year])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    SetStatus: function (username, goal_id, status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("update goal \n                 set status=$1\n                 where goal.id =$2\n                 and account_id=(select id from account where username=$3)", status, goal_id, username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    SetMax: function (username, goal_id, max) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("update goal \n                 set max=$1\n                 where goal.id =$2\n                 and account_id=(select id from account where username=$3)", max, goal_id, username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//# sourceMappingURL=planner_data.js.map