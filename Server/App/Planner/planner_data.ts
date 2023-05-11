import {Data} from "../../Modules/Database";
import {marked} from "marked";
import use = marked.use;

export const Planner = {
    async AddDailyGoal(username: string, title: string, date: Date, amount: number) {
        // language=PostgreSQL
        await Data.Execute(
            `call add_daily_goal($1, 0, $2, $3, $4)`,
            title, amount, date.toISOString(), username
        )
    },

    async GetGoalsToday(username: string) {
        return await Data.QueryRows(
            `select * from daily_goals 
                where day=date(now())
                and account_id=(select id from account where username=$1);`,
            [username]
        )
    }
}