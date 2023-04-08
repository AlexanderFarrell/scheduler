import {PaServer} from "./PaServer";
import {AuthApp} from "./App/Auth/AuthApp";
import {Home} from "./App/Home";
import {Index} from "./App";
import {Portfolio} from "./App/Portfolio/Portfolio";
import {WordApp} from "./App/Word/WordApp";
import {WikiApp} from "./App/Wiki/WikiApp";

let back = new PaServer();

back.Start(new AuthApp());
back.Start(new Home());
back.Start(new Index());
back.Start(new Portfolio());
back.Start(new WordApp());
back.Start(new WikiApp());

back.Run();