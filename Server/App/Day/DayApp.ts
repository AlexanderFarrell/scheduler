import e = require("express");
import {IsLoggedIn, RenderTemplate} from "../../Modules/ServerHelper";
import {DayDao} from "./DayDao";

export const day_api = e.Router();
day_api.use(IsLoggedIn);

day_api.get('/', async (req, res) => {
    let scores = await DayDao.GetScoresByDay(req.session['username']);
    RenderTemplate(req, res, "Day", "day/index.ejs", {scores: scores})
})

// day_api.get('/day/:day', async (req, res) => {
//
// })

// export class DayApp implements IApp {
//     GetName(): string {
//         return "Day";
//     }
//
//     GetRouter(): e.Router {
//         let router = e.Router();
//         router.use(IsLoggedIn);
//
//         router.get('/', async (req, res) => {
//             let scores = await DayDao.GetScoresByDay(req.session['username']);
//             RenderTemplate(req, res, "Day", "day/index.ejs", {scores: scores})
//         })
//
//         router.get('/day/:day', async (req, res) => {
//
//         })
//
//         return router;
//     }
//
//     GetWebUrl(): string {
//         return "/day";
//     }
// }