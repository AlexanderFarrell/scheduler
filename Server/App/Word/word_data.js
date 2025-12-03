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
exports.Word = void 0;
var Database_1 = require("../../Modules/Database");
exports.Word = {
    display_count_recent: 10,
    display_count_recently_entered: 10,
    get: function (id, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryFirst("select *\n                 from words\n                 where id = $1\n                   and account_id =\n                       (select id from account where username = $2)\n                 limit 1", [id, username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    add: function (date, title, content, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("insert into words (number, date, title, content, account_id) \n                values ($1, $2, $3, $4, (select id from account where username=$5))", -1, date, title, content, username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    update: function (id, word, content, date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("update words\n                set title=$1,\n                    content=$2,\n                    date=$3\n                where id=$4", word, content, date.toISOString(), id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    get_years: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select extract('year' from date) as year\n                 from words\n                 where account_id=(select id from account where username=$1)\n                 group by extract('year' from date)\n                 order by extract('year' from date);", [username])];
                    case 1: return [2 /*return*/, (_a.sent())
                            .map(function (row) { return row['year']; })];
                }
            });
        });
    },
    get_range: function (start, end, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                 from words \n                 where date between date($1) \n                     and date($2) \n                     and account_id=\n                         (select id from account where username=$3)\n                 order by date desc", [start.toISOString(), end.toISOString(), username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_recent: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                from words\n                where account_id=(select id from account where username=$1)\n                order by date desc limit 10", [username])];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    },
    search: function (term, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                 from words \n                 where content like concat('%', $1::text, '%') \n                   and account_id=\n                       (select id from account where username=$2)\n                 limit 500", [term, username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_recently_added: function (username, limit) {
        if (limit === void 0) { limit = exports.Word.display_count_recently_entered; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                 from words\n                 where account_id=(select id from account where username=$1)\n                 order by added_on desc limit 10", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    // TODO: Refactor this query
    get_word_counts: function (sorting, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(sorting == "alpha")) return [3 /*break*/, 2];
                        return [4 /*yield*/, Database_1.Data.Query("select title, count(*) as count\n                                from words\n                                where account_id=\n                                      (select id from account where username=$1)\n                                group by title\n                                order by title;", username)];
                    case 1: return [2 /*return*/, (_a.sent()).rows];
                    case 2: return [4 /*yield*/, Database_1.Data.Query("select title, count(*) as count\n                                from words\n                                where account_id=\n                                      (select id from account where username=$1)\n                                group by title\n                                order by count(*) desc , title;", username)];
                    case 3: return [2 /*return*/, (_a.sent()).rows];
                }
            });
        });
    },
    get_by_topic: function (topic, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                 from words \n                 where title=$1 \n                  and account_id=\n                      (select id from account where username=$2)\n                 order by date desc", [topic, username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_most_recent: function (username, limit) {
        if (limit === void 0) { limit = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                  from words\n                  where account_id=(select id from account where username=$1)\n                  order by date desc \n                  limit $2", [username, limit])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_categories: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Database_1.Data.QueryRows("select title, date \n               from words \n               where account_id=(select id from account where username=$1)\n               order by date desc", [username])];
            });
        });
    }
};
//# sourceMappingURL=word_data.js.map