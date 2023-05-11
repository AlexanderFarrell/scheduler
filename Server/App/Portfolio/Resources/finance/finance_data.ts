import {Data} from "../../../../Modules/Database";

export const Finance = {
    async GetPayments(username: string) {
        return await Data.QueryRows(
            `select date(p.date_time) as date,
                        amount,
                        p.description as description,
                        c.name as customer
                from payment p
                inner join stakeholder c on c.id = p.stakeholder_id
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

    async GetRevenueByWeek(username: string) {
        return await Data.QueryRows(
            `select * 
                     from revenue_by_week
                     where account_id=(select id from account where username=$1)
                     order by year desc, week desc `,
            [username]
        )
    },

    async GetPaymentsForWeek(username: string, week: number, year: number) {
        return await Data.QueryRows(
            `select p.amount as amount,
                    s.name as customer,
                    p.date_time as date
                    from payment p
                      inner join stakeholder s on s.id = p.stakeholder_id
                     where p.account_id=(select id from account where username=$1)
                     and extract(week from date_time) = $2
                     and extract(year from date_time) = $3
                     order by date_time desc`,
            [username, week, year]
        )
    },

    async GetPaymentsForMonth(username: string, month: number, year: number) {
        return await Data.QueryRows(
            `select p.amount as amount,
                    s.name as customer,
                    p.date_time as date
             from payment p
                      inner join stakeholder s on s.id = p.stakeholder_id
             where p.account_id=(select id from account where username=$1)
               and extract(month from date_time) = $2
               and extract(year from date_time) = $3
               order by date_time desc`,
            [username, month, year]
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
    },

    async GetRevenueFrom(username: string, customer: string) {
        return await Data.QueryRows(
            `select p.amount as amount,
                        s.name as customer,
                        p.date_time as date
                     from payment p
                     inner join stakeholder s on s.id = p.stakeholder_id
                     where p.account_id=(select id from account where username=$1)
                     and s.name = $2
                     order by date desc `,
            [username, customer]
        )
    }
}