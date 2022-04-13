import {IApp} from "./App";
import * as e from "express";
import {Router} from "express";
import {ContainsBodyArgs, IsLoggedIn, RenderTemplate} from "../Modules/ServerHelper";
import {Data} from "../Modules/Database";
import parseDate from "postgres-date";

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

            let r = [

            ]

            let curr = ""
            track.forEach(row => {
                if (curr != row['type']) {
                    curr = row['type'];
                    r.push([])
                }

                // @ts-ignore
                let date = parseDate(row['at'] as string);

                r[r.length-1] = [row['value'], date.toLocaleString()];
            })

            RenderTemplate(res, "Tracker", "tracker", {types: types, table: r});
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
 (select id from account where username=$3))`,
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

    async GetEntriesBy(type, account_name, days) {
        return (await Data.Query(
            `
select ty.name as type,
       t.value as value,
       t.at as at
from tracker t
inner join tracker_type ty on ty.id = t.type_id
where type_id = (select id from tracker_type tt where tt.name = $1)
and account_id = (select id from account a where a.username = $2)
order by t.at
`,
            type,
            account_name
        )).rows;
    }

    async GetEntries(account_name, days) {
        return (await Data.Query(
            `
select ty.name as type,
       t.value as value,
       t.at as at
from tracker t
inner join tracker_type ty on ty.id = t.type_id
where account_id = (select id from account a where a.username = $1)
order by ty.name, t.at
`,
            account_name
        )).rows;
    }

    async GetEntriesByType(account_name, days) {
        return (await Data.Query(
            `
select ty.name as type,
       t.value as value,
       t.at as at
from tracker t
inner join tracker_type ty on ty.id = t.type_id
`
        )).rows;
    }

    GetWebUrl(): string {
        return "/track";
    }

}