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
exports.Tracker = void 0;
var Database_1 = require("../../../Modules/Database");
exports.Tracker = {
    set: function (username, date, topic, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("insert into tracker_item (topic_id, date, value) \n                 VALUES ((select id from tracker_topic \n                                    where name=$1\n                                    and account_id=(select id from account\n                                                              where username=$4)),\n                         $2,\n                         $3)\n                 on conflict (date, topic_id) do update \n                        set value=$3\n                        where tracker_item.topic_id=(select id from tracker_topic\n                                        where name=$1\n                                          and account_id=(select id from account\n                                                          where username=$4))\n                        and tracker_item.date=$2", topic, date.toISOString(), value, username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    clear: function (username, date, topic) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("delete from tracker_item\n                where topic_id=(select id from tracker_topic\n                                where name=$1\n                                  and account_id=(select id from account\n                                                  where username=$3))\n                and date=$2", topic, date, username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    get_for_day: function (username, date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                from tracker_topic\n                left join tracker_item ti on tracker_topic.id = ti.topic_id\n                    and ti.date = $2\n                where account_id=(select id from account where username=$1)\n                order by tracker_topic.name", [username, date.toISOString()])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    Analytics: {
        get_for_month: function (username, month, year) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * from tracker\n                where account_id=(select id from account where username=$1)\n                and extract(month from date)=$2\n                and extract(year from date)=$3\n                order by date, topic", [username, month, year])];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        get_for_week: function (username, week, year) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * from tracker\n                where account_id=(select id from account where username=$1)\n                and extract(week from date)=$2\n                and extract(year from date)=$3\n                order by date, topic", [username, week, year])];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        get_averages_for_month: function (username, month, year) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select topic,\n                            avg(value)\n                from tracker\n                where account_id=(select id from account where username=$1)\n                and extract(month from date)=$2\n                and extract(year from date)=$3\n                group by topic", [username, month, year])];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        get_averages_for_week: function (username, week, year) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select topic,\n                        avg(value) \n                from tracker\n                where account_id=(select id from account where username=$1)\n                and extract(week from date)=$2\n                and extract(year from date)=$3\n                 group by topic", [username, week, year])];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }
    },
    Topics: {
        get: function (username) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * from tracker_topic\n                    where account_id=(select id from account where username=$1)", [username])];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        add: function (username, topic) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Database_1.Data.Execute("insert into tracker_topic (name, account_id) \n                     values ($1,\n                             (select id from account where username=$2))", topic, username)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        remove: function (username, topic) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Database_1.Data.Execute("delete from tracker_topic where account_id=(select id from account where username=$1)\n                    and name=$2", username, topic)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        rename: function (username, old_name, new_name) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Database_1.Data.Execute("update tracker_topic set name=$1 where account_id=(select id from account where username=$2)\n                                                    and name=$3", new_name, username, old_name)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
};
//# sourceMappingURL=tracker_data.js.map