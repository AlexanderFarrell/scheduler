import {PaServer} from "./PaServer";
import {Auth} from "./App/Auth";
import {Home} from "./App/Home";

let back = new PaServer();

back.Start(new Home());
back.Start(new Auth());

back.Run();