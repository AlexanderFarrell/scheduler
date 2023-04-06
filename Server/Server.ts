import {PaServer} from "./PaServer";
import {Auth} from "./App/Auth";
import {Home} from "./App/Home";
import {Index} from "./App";
import {Portfolio} from "./App/Portfolio/Portfolio";
import {Words} from "./App/Word/Words";
import {Wiki} from "./App/Wiki/Wiki";

let back = new PaServer();

back.Start(new Auth());
back.Start(new Home());
back.Start(new Index());
back.Start(new Portfolio());
back.Start(new Words());
back.Start(new Wiki());

back.Run();