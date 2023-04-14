import {Data} from "../../Modules/Database";

export class Word {
    static async Add(date: string, title: string, content: string, username: string) {
        await Data.Execute(`insert into words (number, date, title, content, account_id) 
                                values ($1, $2, $3, $4, (select id from account where username=$5))`,
            -1,
            date,
            title,
            content,
            username);
    }

    static async Update(id: number, word: string, content: string, date: Date) {
        await Data.Execute(
            `update words
                set title=$1,
                    content=$2,
                    date=$3
                where id=$4`,
            word, content, date.toISOString(), id
        );
    }

    static async Get(id: number, username: string) {
        let data = (await Data.Query(`select * from words
                                      where id=$1 and account_id=
                                                      (select id from account where username=$2) 
                                      limit 1`,
            id, username)).rows;
        if (data.length > 0) {
            return data[0];
        } else {
            return null;
        }
    }

    static async GetYears(username: string) {
        return (await Data.Query(`select extract('year' from date) as year
                                        from words
                                        where account_id=(select id from account where username=$1)
                                        group by extract('year' from date)
                                        order by extract('year' from date);
                                        `, username))
            .rows.map(row => row['year']);
    }

    static async GetRange(start: Date, end: Date, username: string) {
        return (await Data.Query(`select * 
                                        from words 
                                        where date between date($1) 
                                            and date($2) 
                                            and account_id=
                                                (select id from account where username=$3)
                                        order by date desc`,
                start.toISOString(), end.toISOString(), username)).rows;
    }

    static async GetRecent() {
        return (await Data.Query("select * from words order by date desc limit 10")).rows;
    }

    static async Search(term: string, username: string) {
        return (await Data.Query(`select * from words 
                                      where content like concat('%', $1::text, '%') 
                                        and account_id=
                                            (select id from account where username=$2)
                                      limit 500`, term, username)).rows;
    }

    static async GetRecentAdded(username: string) {
        return (await Data.Query(`select * from words
                                        where account_id=(select id from account where username=$1)
                                        order by added_on desc limit 10`, username)).rows;
    }

    static async GetWordCounts(sorting, username: string) {
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

    }

    static async GetByTopic(topic: string, username: string) {
        return (await Data.Query(`select * 
                                        from words 
                                        where title=$1 
                                         and account_id=
                                             (select id from account where username=$2)
                                        order by date desc`, topic, username)).rows;
    }

    static async GetMostRecent(username: string) {
        return (await Data.Query(
            `select * 
                  from words
                  where account_id=(select id from account where username=$1)
                  order by date desc 
                  limit 1`));
    }
}