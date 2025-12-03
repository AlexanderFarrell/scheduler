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
exports.wiki_api = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../../Modules/ServerHelper");
var auth_middleware_1 = require("../Auth/auth_middleware");
var wiki_data_1 = require("./wiki_data");
exports.wiki_api = (0, express_1.Router)();
exports.wiki_api.use(auth_middleware_1.IsLoggedIn);
exports.wiki_api.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, wiki_data_1.Wiki.get("Home", req.session['username'])];
            case 1:
                page = _a.sent();
                if (page != null) {
                    (0, ServerHelper_1.RenderTemplate)(req, res, "Home - Wiki", 'wiki/page.ejs', { page: page['content'] });
                }
                else {
                    (0, ServerHelper_1.RenderTemplate)(req, res, 'WikiApp', 'wiki/add.ejs', { title: 'Home' });
                }
                return [2 /*return*/];
        }
    });
}); });
exports.wiki_api.get('/recent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, e_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = ServerHelper_1.RenderTemplate;
                _b = [req, res,
                    'WikiApp',
                    'wiki/index.ejs'];
                _c = {};
                return [4 /*yield*/, wiki_data_1.Wiki.get_recent(req.session['username'])];
            case 1:
                _a.apply(void 0, _b.concat([(_c.pages = _d.sent(), _c)]));
                return [3 /*break*/, 3];
            case 2:
                e_1 = _d.sent();
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Recent - Wiki', 'wiki/index.ejs', { error: 'Unable to retrieve recent wiki pages.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.wiki_api.get("/api/:name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, page, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.params["name"];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, wiki_data_1.Wiki.get(name, req.session['username'])];
            case 2:
                page = _a.sent();
                res.json({ title: page['title'], content: page['content'], created_on: page['created_on'] });
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                console.error(e_2);
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.wiki_api.get("/download/:name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, page, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.params["name"];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, wiki_data_1.Wiki.get(name, req.session['username'])];
            case 2:
                page = _a.sent();
                (0, ServerHelper_1.SendAsDownload)(res, page['title'] + ".html", page['content'] + "\n\n" + page['created_on']);
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                console.error(e_3);
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.wiki_api.get("/add/title/:title", function (req, res) {
    (0, ServerHelper_1.RenderTemplate)(req, res, 'WikiApp', 'wiki/add.ejs', { title: 'title' });
});
exports.wiki_api.get("/add", function (req, res) {
    (0, ServerHelper_1.RenderTemplate)(req, res, 'WikiApp', 'wiki/add.ejs', { title: '' });
});
exports.wiki_api.get('/page/:name', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, wiki_data_1.Wiki.get(req.params['name'], req.session['username'])];
            case 1:
                page = _a.sent();
                if (page != null) {
                    (0, ServerHelper_1.RenderTemplate)(req, res, page['title'], 'wiki/page.ejs', { page: page['content'] });
                }
                else {
                    (0, ServerHelper_1.RenderTemplate)(req, res, 'Not Found - WikiApp', 'wiki/page.ejs', { error: "Could not find page ".concat(req.params['name'].substring(0, 100)) });
                }
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                console.error(e_4);
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Not Found - WikiApp', 'wiki/page.ejs', { error: 'Database error. Please try again later' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.wiki_api.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title, content, account, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, ServerHelper_1.ContainsBodyArgs)(req, res, 'title', 'content')) {
                    (0, ServerHelper_1.RenderTemplate)(req, res, 'New WikiApp Page', 'wiki/add.ejs', { error: "Need title and content" });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                title = req.body['title'];
                content = req.body['content'];
                account = req.session['username'];
                return [4 /*yield*/, wiki_data_1.Wiki.add(title, content, account)];
            case 2:
                _a.sent();
                res.redirect('/wiki/page/' + title);
                return [3 /*break*/, 4];
            case 3:
                e_5 = _a.sent();
                console.error(e_5);
                (0, ServerHelper_1.RenderTemplate)(req, res, 'New WikiApp Page', 'wiki/add.ejs', { error: "Database error. Could not add." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.wiki_api.post('/update', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, wiki_data_1.Wiki.update(req.body['title'], req.session['username'], req.body['content'], req.body['new_title'])];
            case 1:
                _a.sent();
                url = '/wiki/page/' + req.body['new_title'];
                res.redirect(url);
                return [2 /*return*/];
        }
    });
}); });
exports.wiki_api.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.query['term'] != null)) return [3 /*break*/, 2];
                return [4 /*yield*/, wiki_data_1.Wiki.search(req.query['term'], req.session['username'])];
            case 1:
                pages = _a.sent();
                (0, ServerHelper_1.RenderTemplate)(req, res, "Search Wiki", 'wiki/search.ejs', { results: pages });
                return [3 /*break*/, 3];
            case 2:
                (0, ServerHelper_1.RenderTemplate)(req, res, "Search Wiki", 'wiki/search.ejs');
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=wiki_api.js.map