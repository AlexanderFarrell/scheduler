import {Data} from "../../Modules/Database";
import {marked} from "marked";
import {WikiApp} from "./WikiApp";
import use = marked.use;


export class WikiDao {
    static async CreatePage(title: string, content: string, username: string) {
        await Data.Execute(`insert into wiki (title, content, account_id) 
                                    values ($1, $2, (select id from account where username=$3));`, title, content, username);
        return '/wiki/page/' + title;
    }

    static async GetPage(name: string, username: string) {
        let rows = (await Data.Query(`
                    select * from wiki where title=$1 and account_id=(select id from account where username=$2) limit 1`,
            name, username)).rows;

        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
            // return {title: "Not Found", content: "Not Found", created_on: new Date().toISOString()}
        }
    }

    static async Update(title: string, username: string, new_content: string) {
        await Data.Execute(
            `update wiki set content=$1 
                where title=$2
                    and account_id=(select id from account where username=$3)`,
            new_content, title, username
        );
    }

    static async GetRecent(username: string) {
        return (await Data.Query(
            `select title, created_on
                 from wiki
                 where account_id=(select id from account where username=$1)
                 order by created_on desc limit 30`,
            username
        )).rows;
    }

    static async Search(term: string, username: string) {
        return (await Data.Query(
            `select * 
                 from wiki w
                 where (lower(w.content) like lower(concat('%', $1::text, '%')) 
                    or lower(w.title) like lower(concat('%', $1::text, '%')))
                        and account_id=(select id from account where username=$2)`,
            term, username
        )).rows;
    }
}