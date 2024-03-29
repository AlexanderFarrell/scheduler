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
exports.index_api = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../../Modules/ServerHelper");
var auth_middleware_1 = require("../Auth/auth_middleware");
var project_data_1 = require("../Portfolio/Project/project_data");
var word_data_1 = require("../Word/word_data");
var wiki_data_1 = require("../Wiki/wiki_data");
exports.index_api = (0, express_1.Router)();
exports.index_api.use(auth_middleware_1.IsLoggedIn);
exports.index_api.get('/', function (req, res) {
    if (req.session['username'] != undefined) {
        res.redirect('/home');
    }
    else {
        res.redirect('/auth');
    }
});
exports.index_api.get('/home', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = {};
                return [4 /*yield*/, project_data_1.Project.get_categories(req.session['username'])];
            case 1:
                _a.categories = _b.sent();
                return [4 /*yield*/, word_data_1.Word.get_most_recent(req.session['username'])];
            case 2:
                _a.word = (_b.sent());
                return [4 /*yield*/, wiki_data_1.Wiki.get_recent(req.session['username'], 8)];
            case 3:
                _a.docs = (_b.sent());
                return [4 /*yield*/, project_data_1.Project.get_news_all_projects(req.session['username'])];
            case 4:
                data = (_a.news = (_b.sent()),
                    _a);
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Home', "index.ejs", data);
                return [2 /*return*/];
        }
    });
}); });
// export class Home implements IApp {
//     GetName(): string {
//         return "Home";
//     }
//
//     GetRouter(): express.Router {
//         let router = Router();
//
//         router.use(IsLoggedIn);
//         router.get('/', (req, res) => {
//             RenderTemplate(req, res, 'Home', "planner.ejs");
//         }) ;
//
//         return router;
//     }
//
//     GetWebUrl(): string {
//         return "/home";
//     }
// }
//# sourceMappingURL=index_api.js.map