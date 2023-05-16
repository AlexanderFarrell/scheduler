import {Wiki} from "../../Wiki/wiki_data";
import {Data} from "../../../Modules/Database";

export const Journal = {
    async add(username: string, date: Date) {
        await Data.Execute(
            `call add_journal_entry($1, $2)`,
            Data.ToSQLDate(date), username
        )
    },

    async get_entry(username: string, date: Date) {
        let sql_date = Data.ToSQLDate(date);
        return Data.QueryFirst(`
            select * from journal_entry
            where account_id=(select id from account where username=$1)
            and date=$2
            limit 1
        `,
            [username, sql_date])
    },

    async get_recent(username: string) {
        return Wiki.search("journal", username, 40);
    }
}
