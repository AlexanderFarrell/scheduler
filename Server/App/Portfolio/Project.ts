import {Data} from "../../Modules/Database";
import {Wiki} from "../Wiki/Wiki";

export class Project {
    static async GetByUser(username: string) {
        let projects = await Data.Query(`select * from project where account_id=
                            (select id from account where username=$1) order by priority desc limit 100`, username);
        return projects.rows;
    }

    static async Get(title: string, username: string) {
        let data = await Data.Query(`select * from project where title=$1 and account_id=
                            (select id from account where username=$2) order by priority desc limit 1`, title, username);
        if (data.rows.length > 0) {
            let project = data.rows[0];
            project['documents'] = (await Data.Query(`select w.title  
                                                    from wiki w
                                                    inner join project_wiki_link pwl on w.id = pwl.wiki_id
                                                    where pwl.project_id=$1`, project['id'])).rows;
            project['deliverables'] = (await Data.Query(`select d.title, d.completed
                                                                from deliverable d
                                                                where project_id=$1
                                                                order by d.completed desc, d.created_on`, project['id'])).rows
            console.log(project)
            return project;
        } else {
            return null;
        }
    }

    static async AddDeliverable(project, deliverable) {
        await Data.Execute(`insert into deliverable (title, project_id) values ($1, $2);`, deliverable,
            project['id']);
    }

    static async Add(title: string, username: string) {
        await Data.Execute(`insert into project (title, account_id) values ($1,                                                             (select id from account where username=$2))`,
            title, username)
    }

    static async AddWikiPage(project, title: string, username: string, kind: string) {
        let content = (Project.DocTemplates.hasOwnProperty(kind)) ? Project.DocTemplates[kind] : "";
        let document_name = title + " - " + project['title'];
        await Wiki.CreatePage(document_name, content, username);
        await Data.Execute(`insert into project_wiki_link (project_id, wiki_id) VALUES 
                                         (
                                          $1, (select id from wiki where title=$2)
                                         )`, project['id'], document_name)
    }

    private static DocTemplates = {
        "Main": "",
        "RS": ""
    }
}