import {Data} from "../../Modules/Database";

export class DayDao {
    static async GetCompletedByDay(username: string) {
        let sql = `select count(p.priority) as score, 
                          date(d.completed)
                from deliverable d
                inner join project p on p.id = d.project_id
                    where d.completed is not null
                    and p.account_id=(select id from account where username=$1)
                group by date(d.completed)
                order by date(d.completed);`
        return (await Data.Query(sql, username)).rows;
    }

    static async GetScoresByDay(username: string) {
        let sql = `select sum(p.priority) as score, 
                          count(d.completed) as completed_count,
                          date(d.completed) as date
                from deliverable d
                inner join project p on p.id = d.project_id
                    where d.completed is not null
                      and p.account_id=(select id from account where username=$1)
                group by date(d.completed)
                order by date(d.completed) desc; `
        return (await Data.Query(sql, username)).rows;
    }

    static async GetScoresByCategory(category: string, username: string) {
        let sql = `select sum(p.priority) as score,
                          count(d.completed) as count,
                          date(d.completed) as date,
                          pc.title as category
                   from deliverable d
                            inner join project p on p.id = d.project_id
                            inner join project_category pc on pc.id = p.category_id
-- where pc.title='Education'
                       and d.completed is not null
                   where p.account_id=(select id from account where username=$1)
                   group by pc.title, date(d.completed)
                   order by date(d.completed), pc.title;`
        return (await Data.Query(sql, category, username)).rows;
    }

    static async GetDeliverablesCompletedByDay(date: Date, username: string) {
        let sql = `select d.title as deliverable,
                          p.title as project,
                          p.priority
                   from deliverable d
                            inner join project p on p.id = d.project_id
                   where date(d.completed) = $1
                     and p.account_id=(select id from account where username=$2);`
        return (await Data.Query(sql, date.toISOString(), username)).rows;
    }

    static async GetProjectsCreatedByDay(username: string) {
        let sql = `select p.title, date(created_on)
                   from project p
                    where p.account_id=(select id from account where username=$1)
                   order by date(created_on);`
        return (await Data.Query(sql, username)).rows;
    }

    static async GetProjectsCreatedCountsByDay(username: string) {
        let sql = `select count(title)
                    from project p
                        where p.account_id=(select id from account where username=$1)
                    group by date(created_on)
                    order by date(created_on);`
        return (await Data.Query(sql, username)).rows;
    }
}