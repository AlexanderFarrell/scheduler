import {Data} from "../../../Modules/Database";

export const Tracker = {
    async set(username: string, date: Date, topic: string, value: number) {
        await Data.Execute(
            `insert into tracker_item (topic_id, date, value) 
                 VALUES ((select id from tracker_topic 
                                    where name=$1
                                    and account_id=(select id from account
                                                              where username=$4)),
                         $2,
                         $3)
                 on conflict (date, topic_id) do update 
                        set value=$3
                        where tracker_item.topic_id=(select id from tracker_topic
                                        where name=$1
                                          and account_id=(select id from account
                                                          where username=$4))
                        and tracker_item.date=$2`,
            topic, date.toISOString(), value, username
        )
    },

    async clear(username: string, date: Date, topic: string) {
        await Data.Execute(
            `delete from tracker_item
                where topic_id=(select id from tracker_topic
                                where name=$1
                                  and account_id=(select id from account
                                                  where username=$3))
                and date=$2`,
            topic, date, username
        )
    },

    async get_for_day(username: string, date: Date) {
        return await Data.QueryRows(
            `select * 
                from tracker_topic
                left join tracker_item ti on tracker_topic.id = ti.topic_id
                    and ti.date = $2
                where account_id=(select id from account where username=$1)
                order by tracker_topic.name`,
            [username, date.toISOString()]
        )
    },

    Analytics: {
        async get_for_month(username: string, month:number, year: number) {
            return await Data.QueryRows(
                `select * from tracker
                where account_id=(select id from account where username=$1)
                and extract(month from date)=$2
                and extract(year from date)=$3
                order by date, topic`,
                [username, month, year]
            )
        },

        async get_for_week(username: string, week:number, year: number) {
            return await Data.QueryRows(
                `select * from tracker
                where account_id=(select id from account where username=$1)
                and extract(week from date)=$2
                and extract(year from date)=$3
                order by date, topic`,
                [username, week, year]
            )
        },

        async get_averages_for_month(username: string, month:number, year: number) {
            return await Data.QueryRows(
                `select topic,
                            avg(value)
                from tracker
                where account_id=(select id from account where username=$1)
                and extract(month from date)=$2
                and extract(year from date)=$3
                group by topic`,
                [username, month, year]
            )
        },

        async get_averages_for_week(username: string, week:number, year: number) {
            return await Data.QueryRows(
                `select topic,
                        avg(value) 
                from tracker
                where account_id=(select id from account where username=$1)
                and extract(week from date)=$2
                and extract(year from date)=$3
                 group by topic`,
                [username, week, year]
            )
        }
    },

    Topics: {
        async get(username: string) {
            return await Data.QueryRows(
                `select * from tracker_topic
                    where account_id=(select id from account where username=$1)`,
                [username]
            )
        },

        async add(username: string, topic: string) {
            await Data.Execute(
                `insert into tracker_topic (name, account_id) 
                     values ($1,
                             (select id from account where username=$2))`,
                topic, username
            )
        },

        async remove(username: string, topic: string) {
            await Data.Execute(
                `delete from tracker_topic where account_id=(select id from account where username=$1)
                    and name=$2`,
                username, topic
            )
        },

        async rename(username: string, old_name: string, new_name: string) {
            await Data.Execute(
                `update tracker_topic set name=$1 where account_id=(select id from account where username=$2)
                                                    and name=$3`,
                new_name, username, old_name
            )
        }
    }
}