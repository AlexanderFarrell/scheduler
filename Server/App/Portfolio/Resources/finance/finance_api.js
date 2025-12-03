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
exports.finance_router = void 0;
var express_1 = require("express");
var resource_data_1 = require("../resource_data");
var ServerHelper_1 = require("../../../../Modules/ServerHelper");
exports.finance_router = (0, express_1.Router)();
exports.finance_router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var monthly, annual, weekly, customer, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, resource_data_1.Resource.Finance.GetRevenueByMonth(req.session['username'])];
            case 1:
                monthly = _a.sent();
                return [4 /*yield*/, resource_data_1.Resource.Finance.GetRevenueByYear(req.session['username'])];
            case 2:
                annual = _a.sent();
                return [4 /*yield*/, resource_data_1.Resource.Finance.GetRevenueByWeek(req.session['username'])];
            case 3:
                weekly = _a.sent();
                return [4 /*yield*/, resource_data_1.Resource.Finance.GetRevenueByCustomer(req.session['username'])];
            case 4:
                customer = _a.sent();
                data = { monthly: monthly, annual: annual, weekly: weekly, customer: customer, tab: "finance.ejs" };
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Resources', 'portfolio/finance/finance.ejs', data);
                return [2 /*return*/];
        }
    });
}); });
exports.finance_router.get('/add', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var payments, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, resource_data_1.Resource.Finance.GetPayments(req.session['username'])];
            case 1:
                payments = _a.sent();
                data = { payments: payments, tab: "finance.ejs" };
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Resources', 'portfolio/finance/add.ejs', data);
                return [2 /*return*/];
        }
    });
}); });
exports.finance_router.get('/projector', function (req, res) {
    (0, ServerHelper_1.RenderTemplate)(req, res, 'Projector', "portfolio/resources/projector");
});
exports.finance_router.get('/y/:year/w/:week', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var year, week, payments, total_1, previous, next;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                year = parseInt(req.params['year']);
                week = parseInt(req.params['week']);
                if (!(!isNaN(year) && !isNaN(week))) return [3 /*break*/, 2];
                return [4 /*yield*/, resource_data_1.Resource.Finance.GetPaymentsForWeek(req.session['username'], week, year)
                    // @ts-ignore
                ];
            case 1:
                payments = _a.sent();
                total_1 = 0;
                payments.forEach(function (payment) {
                    total_1 += parseFloat(payment['amount']);
                });
                previous = "/portfolio/resources/finance/y/".concat(year, "/w/").concat(week - 1);
                next = "/portfolio/resources/finance/y/".concat(year, "/w/").concat(week + 1);
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Finances', 'portfolio/finance/time_interval.ejs', { payments: payments, message: "Payments for Week ".concat(week, " of ").concat(year), total: total_1, previous: previous, next: next });
                return [3 /*break*/, 3];
            case 2:
                res.sendStatus(400);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.finance_router.get('/y/:year/m/:month', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var year, month, payments, total_2, previous, next;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                year = parseInt(req.params['year']);
                month = parseInt(req.params['month']);
                if (!(!isNaN(year) && !isNaN(month))) return [3 /*break*/, 2];
                return [4 /*yield*/, resource_data_1.Resource.Finance.GetPaymentsForMonth(req.session['username'], month, year)
                    // @ts-ignore
                ];
            case 1:
                payments = _a.sent();
                total_2 = 0;
                payments.forEach(function (payment) {
                    total_2 += parseFloat(payment['amount']);
                });
                previous = "/portfolio/resources/finance/y/".concat(year, "/m/").concat(month - 1);
                next = "/portfolio/resources/finance/y/".concat(year, "/m/").concat(month + 1);
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Finances', 'portfolio/finance/time_interval.ejs', { payments: payments, message: "Payments for ".concat(ServerHelper_1.monthNames[month - 1], " ").concat(year), total: total_2, previous: previous, next: next });
                return [3 /*break*/, 3];
            case 2:
                res.sendStatus(400);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.finance_router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, resource_data_1.Resource.Finance.AddPayment(parseInt(req.body['amount']), req.body['customer'], req.body['description'], new Date(req.body['date']), req.session['username'])];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 3];
            case 3:
                res.redirect("/portfolio/resources/finance/add");
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=finance_api.js.map