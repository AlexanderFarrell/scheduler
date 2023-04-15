import {ServerInit} from "./Modules/ServerInit";
import {index_api} from "./App/Home";
import {portfolio_api} from "./App/Portfolio/Portfolio";
import {word_api} from "./App/Word/WordApp";
import {wiki_api} from "./App/Wiki/WikiApp";
import {day_api} from "./App/Day/DayApp";
import {auth_api} from "./App/Auth/auth_api";

// let back = new PaServer();

const app = ServerInit.GetExpressApp();

app.use('/auth', auth_api);
app.use('/', index_api);
app.use('/portfolio', portfolio_api);
app.use('/words', word_api);
app.use('/wiki', wiki_api);
app.use('/day', day_api);

ServerInit.Run(app);

// back.Start(new AuthApp());
// back.Start(new Home());
// back.Start(new Index());
// back.Start(new Portfolio());
// back.Start(new WordApp());
// back.Start(new WikiApp());
// back.Start(new DayApp());

// back.Run();