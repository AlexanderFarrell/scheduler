import {PaServer} from "./PaServer";
import {Auth} from "./App/Auth";
import {Home} from "./App/Home";
import {Idea} from "./App/Idea";

let back = new PaServer();

back.Start(new Idea());
back.Start(new Home());
back.Start(new Auth());

back.Run();