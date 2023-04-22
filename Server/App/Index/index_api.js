"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index_api = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../../Modules/ServerHelper");
exports.index_api = (0, express_1.Router)();
exports.index_api.use(ServerHelper_1.IsLoggedIn);
exports.index_api.get('/', function (req, res) {
    if (req.session['username'] != undefined) {
        res.redirect('/home');
    }
    else {
        res.redirect('/auth');
    }
});
exports.index_api.get('/home', function (req, res) {
    (0, ServerHelper_1.RenderTemplate)(req, res, 'Home', "index.ejs");
});
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
//             RenderTemplate(req, res, 'Home', "index.ejs");
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