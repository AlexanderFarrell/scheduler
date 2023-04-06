import {Data} from "../../Modules/Database";

export class Word {
    static async Add(date: string, title: string, content: string) {
        await Data.Execute("insert into words (number, date, title, content) values ($1, $2, $3, $4)",
            -1,
            date,
            title,
            content);
    }
}