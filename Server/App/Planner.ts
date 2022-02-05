import * as express from 'express';
import {Router} from 'express';
import {IApp} from "./App";
import {IsLoggedIn, RenderTemplate} from "../Modules/ServerHelper";
import {Data} from "../Modules/Database";

export class Planner implements IApp {
    GetName(): string {
        return "Planner";
    }

    GetRouter(): express.Router {
        let router = Router();
        router.use(IsLoggedIn);

        router.get("/", async (req, res) => {
            let username = req.session['username'];
            await this.RenderTemplate(res, username, new Date(Date.now()));
        })

        router.get("/by_date/:year/:month/:day", async (req, res) => {
            let username = req.session['username'];
            let year =  parseInt(req.params['year']);
            let month = parseInt(req.params['month']);
            let day =   parseInt(req.params['day']);

            if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
                console.log("Error")
                res.redirect("/planner")
            } else {
                console.log("Worked")
                let date = new Date(Date.UTC(year, month-1, day));
                console.log(date);
                await this.RenderTemplate(res, username, date);
            }
        })

        router.post('/goal', async (req, res) => {
            try {
                //TODO: Add sanitation
                let date = new Date(req.body['date']);
                await this.AddGoal(req.session['username'], req.body['title'], date);
                res.redirect('/planner');
                //res.redirect(`/planner/by_date/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getDate()}`); //TODO: Make for all days
            } catch (e) {
                console.log(e);
            }
        })

        return router;

    }

    private async RenderTemplate(res, username, date) {

        try {
            let goals = await this.GetGoalsByDate(username, date);
            let plans = await this.GetPlansByDate(username, date);

            console.log(goals);

            RenderTemplate(res, 'Planner', 'planner.ejs', {date: date.toDateString(), goals: goals.rows, plans: plans.rows, dateval: date.toISOString()})
        } catch (e) {
            console.log(e);
        }
    }

    GetWebUrl(): string {
        return "/planner";
    }

    async GetGoalsByDate(username, date) {
        return await Data.Pool.query(`
        select *
        from goal
        inner join item i on i.id = goal.item_id
        where account_id=(select id from account where username=$1)
and date=$2
limit 50
        ;`, [username, date.toISOString()]);
    }

    async GetPlansByDate(username, date) {
        return await Data.Pool.query(`
        select *
        from plan
        inner join item i on i.id = plan.item_id
        where account_id=(select id from account where username=$1)
and date=$2
limit 50
        ;`, [username, date.toISOString()]);
    }

    async AddGoal(username, title, date) {
        return await Data.Pool.query(
            `
            call add_goal($1, $2, $3)`,
            [title, date.toISOString().slice(0, 10), username]
        )
    }

    async RemoveGoal(username, title, date) {
        return await Data.Pool.query(
            `
            delete from goal`
        )
    }

    async AddPlan(username, title, date) {

    }
}