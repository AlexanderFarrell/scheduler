import {Wiki} from "../../Wiki/wiki_data";

export const Journal = {
    async get_recent(username: string) {
        return Wiki.search("journal", username, 40);
    }
}