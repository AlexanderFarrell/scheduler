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
exports.Finance = void 0;
var Database_1 = require("../../../../Modules/Database");
exports.Finance = {
    GetPayments: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select date(p.date_time) as date,\n                        amount,\n                        p.description as description,\n                        c.name as customer\n                from payment p\n                inner join stakeholder c on c.id = p.stakeholder_id\n                where p.account_id = (select id from account where username=$1)\n                order by p.date_time desc ", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    AddPayment: function (amount, customer, description, date, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("call add_payment($1, $2, $3, $4, $5)", amount, customer, date.toISOString(), description, username)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetRevenueByMonth: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                     from revenue_by_month\n                     where account_id=(select id from account where username=$1)\n                     order by year desc ,month desc ", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetRevenueByYear: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                     from revenue_by_year\n                     where account_id=(select id from account where username=$1)\n                     order by year desc ", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetRevenueByWeek: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                     from revenue_by_week\n                     where account_id=(select id from account where username=$1)\n                     order by year desc, week desc ", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetPaymentsForWeek: function (username, week, year) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select p.amount as amount,\n                    s.name as customer,\n                    p.date_time as date\n                    from payment p\n                      inner join stakeholder s on s.id = p.stakeholder_id\n                     where p.account_id=(select id from account where username=$1)\n                     and extract(week from date_time) = $2\n                     and extract(year from date_time) = $3\n                     order by date_time desc", [username, week, year])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetPaymentsForMonth: function (username, month, year) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select p.amount as amount,\n                    s.name as customer,\n                    p.date_time as date\n             from payment p\n                      inner join stakeholder s on s.id = p.stakeholder_id\n             where p.account_id=(select id from account where username=$1)\n               and extract(month from date_time) = $2\n               and extract(year from date_time) = $3\n               order by date_time desc", [username, month, year])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetRevenueByCustomer: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                     from revenue_by_customer\n                     where account_id=(select id from account where username=$1)\n                     order by revenue desc ", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetRevenueFrom: function (username, customer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select p.amount as amount,\n                        s.name as customer,\n                        p.date_time as date\n                     from payment p\n                     inner join stakeholder s on s.id = p.stakeholder_id\n                     where p.account_id=(select id from account where username=$1)\n                     and s.name = $2\n                     order by date desc ", [username, customer])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
};
//# sourceMappingURL=finance_data.js.map