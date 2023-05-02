import {Router} from "express";
import {IsLoggedIn, RenderTemplate} from "../../Modules/ServerHelper";
import {project_router} from "../Portfolio/project_api";
import {Project} from "../Portfolio/project_data";
import {Word} from "../Word/word_data";
import {Wiki} from "../Wiki/wiki_data";

export const index_api = Router();

index_api.use(IsLoggedIn);

index_api.get('/', (req, res) => {
    if (req.session['username'] != undefined) {
        res.redirect('/home');
    } else {
        res.redirect('/auth');
    }
})

index_api.get('/home', async (req, res) => {
    let data = {
        categories: await Project.get_categories(req.session['username']),
        word: (await Word.get_most_recent(req.session['username'])),
        docs: (await Wiki.get_recent(req.session['username'], 8))
    }
    console.log(data)

    RenderTemplate(req, res, 'Home', "index.ejs", data);
}) ;

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