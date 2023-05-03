import {Data} from "../../../Modules/Database";

export const Finance = {
    async GetPayments(username: string) {
        return await Data.QueryRows(
            `select date(p.date_time) as date,
                        amount,
                        p.description as description,
                        c.name as customer
                from payment p
                inner join customer c on c.id = p.customer_id
                where p.account_id = (select id from account where username=$1)
                order by p.date_time desc `,
            [username]);
    },

    async AddPayment(amount: number, customer: string, description: string, date: Date,username: string) {
        return await Data.Execute(
            `call add_payment($1, $2, $3, $4, $5)`,
            amount, customer, date.toISOString(), description, username
        )
    },

    async GetRevenueByMonth(username: string) {
        return await Data.QueryRows(
            `select * 
                     from revenue_by_month
                     where account_id=(select id from account where username=$1)
                     order by year desc ,month desc `,
            [username]
        )
    },

    async GetRevenueByYear(username: string) {
        return await Data.QueryRows(
            `select * 
                     from revenue_by_year
                     where account_id=(select id from account where username=$1)
                     order by year desc `,
            [username]
        )
    },

    async GetRevenueByCustomer(username: string) {
        return await Data.QueryRows(
            `select * 
                     from revenue_by_customer
                     where account_id=(select id from account where username=$1)
                     order by revenue desc `,
            [username]
        )
    }
}