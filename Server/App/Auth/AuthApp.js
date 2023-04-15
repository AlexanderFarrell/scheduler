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
exports.auth_api = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../../Modules/ServerHelper");
var Account_1 = require("./Account");
exports.auth_api = (0, express_1.Router)();
exports.auth_api.get("/", function (req, res) {
    (0, ServerHelper_1.RenderTemplate)(req, res, "Scheduler", "auth/index.ejs", { hideHeader: true });
});
exports.auth_api.get('/create', function (req, res) {
    (0, ServerHelper_1.RenderTemplate)(req, res, 'Create Account', 'auth/create.ejs', { m: "Enter a username and password.", hideHeader: true });
});
exports.auth_api.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, password, first_name, last_name, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!Account_1.Account.CreationEnabled) {
                    (0, ServerHelper_1.RenderTemplate)(req, res, 'Create Account', 'auth/create.ejs', { m: "Account creation is currently disabled for security reasons.", hideHeader: true });
                    return [2 /*return*/];
                }
                if (!(0, ServerHelper_1.ContainsBodyArgs)(req, 'username', 'password')) {
                    (0, ServerHelper_1.RenderTemplate)(req, res, 'Create Account', 'auth/create.ejs', { m: "Missing username or password.", hideHeader: true });
                    return [2 /*return*/];
                }
                username = req.body.username;
                password = req.body.password;
                first_name = req.body['first_name'];
                last_name = req.body['last_name'];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Account_1.Account.Create(username, password, first_name, last_name)];
            case 2:
                _a.sent();
                // @ts-ignore
                req.session.username = username;
                // @ts-ignore
                req.session.first_name = first_name;
                // @ts-ignore
                req.session.last_name = last_name;
                res.redirect('/');
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                (0, ServerHelper_1.RenderTemplate)(res, 'Create Account', 'auth/create.ejs', { m: e_1.message, hideHeader: true });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.auth_api.get('/login', function (req, res) {
    (0, ServerHelper_1.RenderTemplate)(req, res, 'Login', 'auth/login.ejs', { m: "Enter a username and password.", hideHeader: true });
});
exports.auth_api.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, password, data, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, ServerHelper_1.ContainsBodyArgs)(req, 'username', 'password')) {
                    (0, ServerHelper_1.RenderTemplate)(req, res, 'Login', 'auth/login.ejs', { m: "Missing username or password.", hideHeader: true });
                }
                username = req.body.username;
                password = req.body.password;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Account_1.Account.Login(username, password)];
            case 2:
                data = _a.sent();
                // @ts-ignore
                req.session.username = username;
                // @ts-ignore
                req.session.first_name = data.first_name;
                // @ts-ignore
                req.session.last_name = data.last_name;
                res.redirect('/');
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                console.log(e_2);
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Login', 'auth/login.ejs', { m: e_2.message, hideHeader: true });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.auth_api.get('/logout', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        delete req.session['username'];
        res.redirect('/auth');
        return [2 /*return*/];
    });
}); });
// export class AuthApp implements IApp {
//
//     public GetName(): string {
//         return "Auth";
//     }
//
//     public GetRouter(): express.Router {
//         let router = Router();
//
//         router.get("/", (req, res) => {
//             RenderTemplate(req, res, "Scheduler", "auth/index.ejs", {hideHeader: true})
//         })
//
//         router.get('/create', (req, res) => {
//             RenderTemplate(req, res, 'Create Account', 'auth/create.ejs', {m: "Enter a username and password.", hideHeader: true})
//         });
//
//         router.post('/create', async (req, res) => {
//             if (!Account.CreationEnabled) {
//                 RenderTemplate(
//                     req,
//                     res,
//                     'Create Account',
//                     'auth/create.ejs',
//                     {m: "Account creation is currently disabled for security reasons.", hideHeader: true}
//                 );
//                 return;
//             }
//
//             if (!ContainsBodyArgs(req, 'username', 'password')) {
//                 RenderTemplate(
//                     req,
//                     res,
//                     'Create Account',
//                     'auth/create.ejs',
//                     {m: "Missing username or password.", hideHeader: true}
//                 );
//                 return;
//             }
//
//             let username = req.body.username;
//             let password = req.body.password;
//             let first_name = req.body['first_name'];
//             let last_name = req.body['last_name'];
//
//             try {
//                 await Account.Create(username, password, first_name, last_name);
//                 // @ts-ignore
//                 req.session.username = username;
//                 // @ts-ignore
//                 req.session.first_name = first_name;
//                 // @ts-ignore
//                 req.session.last_name = last_name;
//                 res.redirect('/');
//             } catch (e) {
//                 console.log(e);
//                 RenderTemplate(
//                     res,
//                     'Create Account',
//                     'auth/create.ejs',
//                     {m: e.message, hideHeader: true}
//                 );
//             }
//         });
//
//         router.get('/login', (req, res) => {
//             RenderTemplate(req, res, 'Login', 'auth/login.ejs', {m: "Enter a username and password.", hideHeader: true})
//         });
//
//         router.post('/login', async (req, res) => {
//             if (!ContainsBodyArgs(req, 'username', 'password')) {
//                 RenderTemplate(
//                     req,
//                     res,
//                     'Login',
//                     'auth/login.ejs',
//                     {m: "Missing username or password.", hideHeader: true}
//                 );
//             }
//
//             let username = req.body.username;
//             let password = req.body.password;
//
//             try {
//                 let data = await Account.Login(username, password);
//                 // @ts-ignore
//                 req.session.username = username;
//                 // @ts-ignore
//                 req.session.first_name = data.first_name;
//                 // @ts-ignore
//                 req.session.last_name = data.last_name
//                 res.redirect('/');
//             } catch (e) {
//                 console.log(e);
//                 RenderTemplate(
//                     req,
//                     res,
//                     'Login',
//                     'auth/login.ejs',
//                     {m: e.message, hideHeader: true}
//                 );
//             }
//         })
//
//         router.get('/logout', async (req, res) => {
//             delete req.session['username']
//             res.redirect('/auth')
//         })
//
//         return router;
//     }
//
//     GetWebUrl(): string {
//         return "/auth";
//     }
// }
//# sourceMappingURL=AuthApp.js.map