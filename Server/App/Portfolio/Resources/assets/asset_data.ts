import {Data} from "../../../../Modules/Database";

export const Assets = {
    async get(username: string) {
        return await Data.QueryRows(
            `select *
             from asset
             where account_id = (select id from account where username = $1)`,
            [username]
        )
    },

    async add(name: string, date: Date, value: number, username: string) {
        await Data.Execute(
            `insert into asset (name, purchase_date, purchase_value, account_id) 
                VALUES ($1, 
                        $2, 
                        $3,
                        (select id from account where username=$4))`,
            name, Data.ToSQLDate(date), value, username
        )
    },

    async remove(asset_id: number, username: string) {
        await Data.Execute(
            `delete from asset
                where id=$1 
                and account_id=(select id from account where username=$2)`,
            asset_id, username
        )
    },

    async get_net_worth(username: string) {
        return await Data.QueryFirst(
            `select sum(purchase_value) from asset where account_id=(select id from account where username=$1)`,
            [username]
        );
    }
}