import {Data} from "../../Modules/Database";

export class Word {
    static async Add(date: string, title: string, content: string) {
        await Data.Execute("insert into words (number, date, title, content) values ($1, $2, $3, $4)",
            -1,
            date,
            title,
            content);
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

    static async Get(id: number) {
        let data = (await Data.Query(`select * from words
                                      where id=$1 limit 1`,
            id)).rows;
        if (data.length > 0) {
            return data[0];
        } else {
            return null;
        }
    }

    static async GetRange(start: Date, end: Date) {
        return (await Data.Query(`select * from words where date between date($1) and date($2) order by date desc`,
                start.toISOString(), end.toISOString())).rows;
    }

    static async GetRecent() {
        return (await Data.Query("select * from words order by date desc limit 10")).rows;
    }

    static async Search(term: string) {
        return (await Data.Query(`select * from words 
                                      where content like concat('%', $1::text, '%') 
                                      limit 500`, term)).rows;
    }

    static async GetRecentAdded() {
        return (await Data.Query("select * from words order by added_on desc limit 10")).rows;
    }

    static async GetWordCounts(sorting) {
        if (sorting == "alpha") {
            return (await Data.Query(`select title, count(*) as count
                                from words
                                group by title
                                order by title;`)).rows;
        } else {
            return (await Data.Query(`select title, count(*) as count
                                from words
                                group by title
                                order by count(*) desc , title;`)).rows;
        }

    }

    static async GetByTopic(topic: string) {
        return (await Data.Query("select * from words where title=$1 order by date desc", topic)).rows;
    }
}