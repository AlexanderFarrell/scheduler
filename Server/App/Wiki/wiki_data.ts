import {Data} from "../../Modules/Database";

export const Wiki = {
    display_count_recent: 30,

    async get(name: string, username: string) {
        return await Data.QueryFirst(
            `select * 
                from wiki 
                where title=$1 
                  and account_id=(select id from account where username=$2)
                limit 1`,
            [name, username]
        );
    },

    async add(title: string, content: string, username: string) {
        await Data.Execute(
            `insert into wiki (title, content, account_id) 
                 values ($1, $2, (select id from account where username=$3));`,
            title, content, username);
    },

    async update(title: string, username: string, new_content: string, new_title: string) {
        await Data.Execute(
            `update wiki 
                set content=$1,
                    title=$4
                where title=$2
                    and account_id=(select id from account where username=$3)`,
            new_content, title, username, new_title
        );
    },

    async get_recent(username: string, limit: number = Wiki.display_count_recent) {
        return await Data.QueryRows(
            `select title, created_on
                 from wiki
                 where account_id=(select id from account where username=$1)
                 order by created_on desc limit $2`,
            [username, limit]
        );
    },

    async search(term: string, username: string, limit: number = 100) {
        return await Data.QueryRows(
            `select * 
                 from wiki w
                 where (lower(w.content) like lower(concat('%', $1::text, '%')) 
                    or lower(w.title) like lower(concat('%', $1::text, '%')))
                        and account_id=(select id from account where username=$2)
                    order by created_on desc 
                    limit $3`,
            [term, username, limit]
        );
    }
}