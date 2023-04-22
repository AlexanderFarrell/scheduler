import {Data} from "../../Modules/Database";

export const Word = {
    display_count_recent: 10,
    display_count_recently_entered: 10,

    async get(id: number, username: string) {
        return await Data.QueryFirst(
            `select *
                 from words
                 where id = $1
                   and account_id =
                       (select id from account where username = $2)
                 limit 1`,
            [id, username]
        );
    },

    async add(date: string, title: string, content: string, username: string) {
        await Data.Execute(
            `insert into words (number, date, title, content, account_id) 
                values ($1, $2, $3, $4, (select id from account where username=$5))`,
            -1, date, title, content, username);
    },

    async update(id: number, word: string, content: string, date: Date) {
        await Data.Execute(
            `update words
                set title=$1,
                    content=$2,
                    date=$3
                where id=$4`,
            word, content, date.toISOString(), id
        );
    },

    async get_years(username: string) {
        return (await Data.QueryRows(
            `select extract('year' from date) as year
                 from words
                 where account_id=(select id from account where username=$1)
                 group by extract('year' from date)
                 order by extract('year' from date);`
            , [username]))
            .map(row => row['year']);
    },

    async get_range(start: Date, end: Date, username: string) {
        return await Data.QueryRows(
            `select * 
                 from words 
                 where date between date($1) 
                     and date($2) 
                     and account_id=
                         (select id from account where username=$3)
                 order by date desc`,
            [start.toISOString(), end.toISOString(), username]
        );
    },

    async get_recent(username: string) {
        return (await Data.QueryRows(
            `select * 
                from words
                where account_id=(select id from account where username=$1)
                order by date desc limit 10`,
            [username]));
    },

    async search(term: string, username: string) {
        return await Data.QueryRows(
            `select * 
                 from words 
                 where content like concat('%', $1::text, '%') 
                   and account_id=
                       (select id from account where username=$2)
                 limit 500`, [term, username]
        );
    },

    async get_recently_added(username: string, limit: number = Word.display_count_recently_entered) {
        return await Data.QueryRows(
            `select * 
                 from words
                 where account_id=(select id from account where username=$1)
                 order by added_on desc limit 10`,
            [username]
        );
    },

    // TODO: Refactor this query
    async get_word_counts(sorting, username: string) {
        if (sorting == "alpha") {
            return (await Data.Query(`select title, count(*) as count
                                from words
                                where account_id=
                                      (select id from account where username=$1)
                                group by title
                                order by title;`, username)).rows;
        } else {
            return (await Data.Query(`select title, count(*) as count
                                from words
                                where account_id=
                                      (select id from account where username=$1)
                                group by title
                                order by count(*) desc , title;`, username)).rows;
        }
    },

    async get_by_topic(topic: string, username: string) {
        return await Data.QueryRows(
            `select * 
                 from words 
                 where title=$1 
                  and account_id=
                      (select id from account where username=$2)
                 order by date desc`,
            [topic, username]
        );
    },

    async get_most_recent(username: string, limit: number = 1) {
        return await Data.QueryRows(
            `select * 
                  from words
                  where account_id=(select id from account where username=$1)
                  order by date desc 
                  limit $2`,
            [username, limit]);
    },

    async get_categories(username: string) {
      return Data.QueryRows(
          `select title, date 
               from words 
               where account_id=(select id from account where username=$1)
               order by date desc`,
          [username]
      )
    }
}