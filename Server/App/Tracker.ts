import {IApp} from "./App";
import * as e from "express";
import {Router} from "express";
import {ContainsBodyArgs, IsLoggedIn, RenderTemplate} from "../Modules/ServerHelper";
import {Data} from "../Modules/Database";

export class Tracker implements IApp {
    GetName(): string {
        return "Tracker";
    }

    GetRouter(): e.Router {
        const router = Router();

        router.use(IsLoggedIn);
        router.get("/", async (req, res) => {
            let types = await this.GetTypes();
            let track = await this.GetEntries(req.session['name'], 30);
            RenderTemplate(res, "Tracker", "tracker", {});
        })

        router.post('/', async (req, res) => {
            if (ContainsBodyArgs(req, res, "type", "val")) {
                await this.AddEntry(
                    req.body.type,
                    req.body.val,
                    req.session['username']
                )
                res.redirect("/track");
            } else {
                res.sendStatus(400);
            }
        })

        router.post('/type', async (req, res) => {
            if (ContainsBodyArgs(req, res, "type")) {
                await this.AddType(req.body.type);
                res.redirect("/track");
            } else {
                res.sendStatus(400);
            }
        })

        return router;
    }

    async AddType(name) {
        await Data.Execute(
            `insert into tracker_type (name) values ($1)`,
            name
        )
    }

    async AddEntry(type, value, account_name) {
        await Data.Execute(
            `insert into tracker (value, type_id, account_id) VALUES 
($1, 
 (select id from tracker_type where name=$2),
 (select id from account where name=$3))`,
            value,
            type,
            account_name
        )
    }

    async GetTypes() {
        return (await Data.Query(
            `select name
            from tracker_type`
        )).rows.map(i => {
            return i[0]
        });
    }

    async GetEntries(account_name, days) {
        return (await Data.Query(
            `
select ty.name as type,
       t.value as value,
       t.at as at
from tracker t
inner join tracker_type ty on ty.id = tracker.type_id
`
        )).rows;
    }

    GetWebUrl(): string {
        return "/track";
    }

}