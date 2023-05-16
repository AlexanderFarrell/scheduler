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

    async DeleteDailyGoal(username: string, goal_id: number) {
        await Data.Execute(
            `delete from goal
                where account_id=(select id from account where username=$1)
                and id=$2
                `,
            username, goal_id
        )
    },

    async GetGoalsToday(username: string) {
        return await Data.QueryRows(
            `select * from daily_goals 
                where day=date(now())
                and account_id=(select id from account where username=$1)
                order by max desc;`,
            [username]
        )
    },

    async GetGoals(username: string, date: Date) {
        console.log(Data.ToSQLDate(date))
        return await Data.QueryRows(
            `select * from daily_goals 
                where day=$2
                and account_id=(select id from account where username=$1)
                order by max desc;`,
            [username, Data.ToSQLDate(date)]
        )
    },

    async SetStatus(username: string, goal_id: number, status: number) {
        await Data.Execute(
            `update goal 
                 set status=$1
                 where goal.id =$2
                 and account_id=(select id from account where username=$3)`,
            status, goal_id, username
        )
    },

    async SetMax(username: string, goal_id: number, max: number) {
        await Data.Execute(
            `update goal 
                 set max=$1
                 where goal.id =$2
                 and account_id=(select id from account where username=$3)`,
            max, goal_id, username
        )
    }
}