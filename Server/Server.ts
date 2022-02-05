import {PaServer} from "./PaServer";
import {Auth} from "./App/Auth";
import {Home} from "./App/Home";
import {Idea} from "./App/Idea";
import {Index} from "./App";
import {Planner} from "./App/Planner";
import {Projects} from "./App/Projects";

let back = new PaServer();

back.Start(new Idea());
back.Start(new Auth());
back.Start(new Home());
back.Start(new Index());
back.Start(new Planner());
back.Start(new Projects());

back.Run();