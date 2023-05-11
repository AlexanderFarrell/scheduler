import {Data} from "../../../Modules/Database";

export const Stakeholder = {
    async GetCustomers(username: string) {
        return await Data.QueryRows(
            `select *
                from stakeholder
                where account_id=(select id from account where username=$1)
                order by name`,
            [username]
        )
    },
    async GetFamily(username: string) {
        return await Data.QueryRows(
            `select *
                from stakeholder
                where account_id=(select id from account where username=$1)
                order by name`,
            [username]
        )
    },
    async GetStakeholder(username: string, name: string) {
        return await Data.QueryFirst(
            `select *
                  from stakeholder
                  where account_id=(select id from account where username=$1)
                    and name=$2;`,
            [username, name]
        )
    }
}