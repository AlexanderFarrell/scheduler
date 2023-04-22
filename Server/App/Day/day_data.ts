import {Data} from "../../Modules/Database";

export const Day = {
    async get_completed_by_day(username: string) {
        return await Data.QueryRows(
            `select count(p.priority) as score, 
                          date(d.completed)
                from deliverable d
                inner join project p on p.id = d.project_id
                    where d.completed is not null
                    and p.account_id=(select id from account where username=$1)
                group by date(d.completed)
                order by date(d.completed);`,
            [username]);
    },

    async get_scores_by_day(username: string) {
        return await Data.QueryRows(
            `select sum(p.priority) as score, 
                          count(d.completed) as completed_count,
                          date(d.completed) as date
                from deliverable d
                inner join project p on p.id = d.project_id
                    where d.completed is not null
                      and p.account_id=(select id from account where username=$1)
                group by date(d.completed)
                order by date(d.completed) desc; `,
            [username]);
    },

    async get_scores_by_category(category: string, username: string) {
        return await Data.QueryRows(
            `select sum(p.priority) as score,
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
                   order by date(d.completed), pc.title;`,
            [category, username]);
    },

    async get_deliverables_completed_by_day(date: Date, username: string) {
        return await Data.QueryRows(
            `select d.title as deliverable,
                          p.title as project,
                          p.priority
                 from deliverable d
                            inner join project p on p.id = d.project_id
                 where date(d.completed) = $1
                   and p.account_id=(select id from account where username=$2);`,
            [date.toISOString(), username]);
    },

    async get_projects_created_by_day(username: string) {
        return await Data.QueryRows(
            `select p.title, date(created_on)
                 from project p
                 where p.account_id=(select id from account where username=$1)
                 order by date(created_on);`,
            [username]);
    },

    async get_projects_created_counts_by_day(username: string) {
        return await Data.QueryRows(
            `select count(title)
                 from project p
                 where p.account_id=(select id from account where username=$1)
                 group by date(created_on)
                 order by date(created_on);`,
            [username]);
    }
}