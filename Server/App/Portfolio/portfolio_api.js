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
exports.portfolio_api = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../../Modules/ServerHelper");
var auth_middleware_1 = require("../Auth/auth_middleware");
var Database_1 = require("../../Modules/Database");
var Deliverable_1 = require("./Project/Deliverable");
var analysis_api_1 = require("./Analysis/analysis_api");
var stakeholder_api_1 = require("./Stakeholder/stakeholder_api");
var project_api_1 = require("./Project/project_api");
var resource_api_1 = require("./Resources/resource_api");
var project_data_1 = require("./Project/project_data");
exports.portfolio_api = (0, express_1.Router)();
exports.portfolio_api.use(auth_middleware_1.IsLoggedIn);
exports.portfolio_api.use('/Stakeholder', stakeholder_api_1.stakeholder_router);
exports.portfolio_api.use('/Resources', resource_api_1.resources_router);
exports.portfolio_api.use('/Project', project_api_1.project_router);
exports.portfolio_api.use('/Analysis', analysis_api_1.analysis_router);
exports.portfolio_api.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, e_1;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                data = {};
                _l.label = 1;
            case 1:
                _l.trys.push([1, 7, , 8]);
                // data['projects'] = await Project.Get(req.session['username']);
                _a = data;
                _b = 'unsorted';
                return [4 /*yield*/, project_data_1.Project.get_without_category(req.session['username'])];
            case 2:
                // data['projects'] = await Project.Get(req.session['username']);
                _a[_b] = _l.sent();
                _c = data;
                _d = 'projects_root';
                return [4 /*yield*/, project_data_1.Project.get_in_progress(req.session['username'], false)];
            case 3:
                _c[_d] = _l.sent();
                _e = data;
                _f = 'projects';
                return [4 /*yield*/, project_data_1.Project.get_in_progress(req.session['username'], true)];
            case 4:
                _e[_f] = _l.sent();
                _g = data;
                _h = 'on_going';
                return [4 /*yield*/, project_data_1.Project.get_on_going(req.session['username'])];
            case 5:
                _g[_h] = _l.sent();
                _j = data;
                _k = 'categories';
                return [4 /*yield*/, project_data_1.Project.get_categories(req.session['username'])];
            case 6:
                _j[_k] = _l.sent();
                return [3 /*break*/, 8];
            case 7:
                e_1 = _l.sent();
                data['error'] = "Unable to retrieve projects.";
                return [3 /*break*/, 8];
            case 8:
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Portfolio', 'portfolio/index.ejs', data);
                return [2 /*return*/];
        }
    });
}); });
exports.portfolio_api.get('/deliver', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deliverables;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Deliverable_1.Deliverable.GetDeliverables(req.session['username'], req.query)];
            case 1:
                deliverables = _a.sent();
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Portfolio Analysis', 'portfolio/deliver.ejs', { deliverables: deliverables });
                return [2 /*return*/];
        }
    });
}); });
exports.portfolio_api.post('/wiki', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var project, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, project_data_1.Project.get(req.body['project'], req.session['username'])];
            case 1:
                project = _a.sent();
                if (!(project != null)) return [3 /*break*/, 3];
                return [4 /*yield*/, project_data_1.Project.add_wiki_page(project, req.body['title'], req.session['username'], req.body['kind'])];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                res.redirect('/portfolio/project/' + req.body['project']);
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                console.error(e_2);
                res.redirect('/portfolio/project/' + req.body['project']);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.portfolio_api.post('/news', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var project, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, project_data_1.Project.get(req.body['project'], req.session['username'])];
            case 1:
                project = _a.sent();
                if (!(project != null)) return [3 /*break*/, 3];
                return [4 /*yield*/, project_data_1.Project.add_news_article(project, req.body['title'], req.body['content'], new Date(req.body['date']))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                res.redirect('/portfolio/project/' + req.body['project'] + "/news");
                return [3 /*break*/, 5];
            case 4:
                e_3 = _a.sent();
                console.error(e_3);
                res.redirect('/portfolio/project/' + req.body['project'] + "/news");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.portfolio_api.post("/deliverable", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var project;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, project_data_1.Project.get(req.body['project'], req.session['username'])];
            case 1:
                project = _a.sent();
                if (!(project != null)) return [3 /*break*/, 3];
                return [4 /*yield*/, Deliverable_1.Deliverable.AddDeliverable(project, req.body['title'])];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                res.redirect('/portfolio/project/' + project['title'] + "/deliverables");
                return [2 /*return*/];
        }
    });
}); });
exports.portfolio_api.post('/deliverable/track', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                if (!(req.body['completed'] == 'on')) return [3 /*break*/, 2];
                return [4 /*yield*/, Database_1.Data.Execute("update deliverable set completed=now() where project_id=(select id from project where project.title=$1 and account_id=(select id from account where username=$2)) and title=$3;", req.body['project'], req.session['username'], req.body['title'])];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, Database_1.Data.Execute("update deliverable set completed=null where project_id=(select id from project where project.title=$1 and account_id=(select id from account where username=$2)) and title=$3;", req.body['project'], req.session['username'], req.body['title'])];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                res.redirect("/portfolio/project/" + req.body['project']);
                return [2 /*return*/];
        }
    });
}); });
exports.portfolio_api.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, ServerHelper_1.RenderTemplate)(req, res, 'Stakeholders', 'portfolio/search.ejs');
        return [2 /*return*/];
    });
}); });
exports.portfolio_api.get('/track', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, ServerHelper_1.RenderTemplate)(req, res, 'Stakeholders', 'portfolio/track.ejs');
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=portfolio_api.js.map