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
exports.tracker_api = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../../../Modules/ServerHelper");
var tracker_data_1 = require("./tracker_data");
exports.tracker_api = (0, express_1.Router)();
exports.tracker_api.get('/y/:year/w/:week', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).json;
                return [4 /*yield*/, tracker_data_1.Tracker.Analytics.get_for_week(req.session['username'], parseInt(req.params['week']), parseInt(req.params['year']))];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
exports.tracker_api.get('/y/:year/m/:month', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).json;
                return [4 /*yield*/, tracker_data_1.Tracker.Analytics.get_for_month(req.session['username'], parseInt(req.params['month']), parseInt(req.params['year']))];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
exports.tracker_api.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, _a, date, topic, value;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                username = req.session['username'];
                _a = req.body, date = _a.date, topic = _a.topic, value = _a.value;
                value = parseInt(value);
                date = new Date(date);
                if (!((0, ServerHelper_1.IsNotNull)(date, topic, value) && !isNaN(value))) return [3 /*break*/, 2];
                return [4 /*yield*/, tracker_data_1.Tracker.set(username, date, topic, value)];
            case 1:
                _b.sent();
                res.sendStatus(200);
                return [3 /*break*/, 3];
            case 2:
                res.sendStatus(400);
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.tracker_api.delete('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, _a, date, topic;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                username = req.session['username'];
                _a = req.body, date = _a.date, topic = _a.topic;
                date = new Date(date);
                if (!(0, ServerHelper_1.IsNotNull)(date, topic)) return [3 /*break*/, 2];
                return [4 /*yield*/, tracker_data_1.Tracker.clear(username, date, topic)];
            case 1:
                _b.sent();
                res.sendStatus(200);
                return [3 /*break*/, 3];
            case 2:
                res.sendStatus(400);
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.tracker_api.post('/topic', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var topic;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                topic = req.body.topic;
                if (!(topic != null)) return [3 /*break*/, 2];
                return [4 /*yield*/, tracker_data_1.Tracker.Topics.add(req.session['username'], topic)];
            case 1:
                _a.sent();
                res.sendStatus(200);
                return [3 /*break*/, 3];
            case 2:
                res.sendStatus(400);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.tracker_api.delete('/topic', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var topic;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                topic = req.body.topic;
                if (!(topic != null)) return [3 /*break*/, 2];
                return [4 /*yield*/, tracker_data_1.Tracker.Topics.remove(req.session['username'], topic)];
            case 1:
                _a.sent();
                res.sendStatus(200);
                return [3 /*break*/, 3];
            case 2:
                res.sendStatus(400);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.tracker_api.put('/topic', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, old_topic, new_topic;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, old_topic = _a.old_topic, new_topic = _a.new_topic;
                if (!(0, ServerHelper_1.IsNotNull)(old_topic, new_topic)) return [3 /*break*/, 2];
                return [4 /*yield*/, tracker_data_1.Tracker.Topics.rename(req.session['username'], old_topic, new_topic)];
            case 1:
                _b.sent();
                res.sendStatus(200);
                return [3 /*break*/, 3];
            case 2:
                res.sendStatus(400);
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=tracker_api.js.map