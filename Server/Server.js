"use strict";
// The main entry point for the server application.
//
// The server is divided into modules. Each module's api is added here.
Object.defineProperty(exports, "__esModule", { value: true });
var ServerInit_1 = require("./Modules/ServerInit");
var index_api_1 = require("./App/Index/index_api");
var portfolio_api_1 = require("./App/Portfolio/portfolio_api");
var word_api_1 = require("./App/Word/word_api");
var wiki_api_1 = require("./App/Wiki/wiki_api");
var day_api_1 = require("./App/Day/day_api");
var auth_api_1 = require("./App/Auth/auth_api");
var planner_api_1 = require("./App/Planner/planner_api");
var app = ServerInit_1.ServerInit.GetExpressApp();
app.use('/auth', auth_api_1.auth_api);
app.use('/', index_api_1.index_api);
app.use('/portfolio', portfolio_api_1.portfolio_api);
app.use('/words', word_api_1.word_api);
app.use('/wiki', wiki_api_1.wiki_api);
app.use('/day', day_api_1.day_api);
app.use('/planner', planner_api_1.planner_api);
ServerInit_1.ServerInit.Run(app);
//# sourceMappingURL=Server.js.map