// The main entry point for the server application.
//
// The server is divided into modules. Each module's api is added here.

import {ServerInit} from "./Modules/ServerInit";
import {index_api} from "./App/Index/index_api";
import {portfolio_api} from "./App/Portfolio/portfolio_api";
import {word_api} from "./App/Word/word_api";
import {wiki_api} from "./App/Wiki/wiki_api";
import {day_api} from "./App/Day/day_api";
import {auth_api} from "./App/Auth/auth_api";
import {planner_api} from "./App/Planner/planner_api";

const app = ServerInit.GetExpressApp();

app.use('/auth', auth_api);
app.use('/', index_api);
app.use('/portfolio', portfolio_api);
app.use('/words', word_api);
app.use('/wiki', wiki_api);
app.use('/day', day_api);
app.use('/planner', planner_api);

ServerInit.Run(app);