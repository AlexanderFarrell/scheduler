import {Data} from "../../../Modules/Database";
import {Wiki} from "../../Wiki/wiki_data";
import {doc_templates} from "../doc_templates";

export const Project = {
    news_per_page: 20,

    async get(title: string, username: string) {
        let project = await Data.QueryFirst(
            `select p.id as id,
                        p.title as title,
                        description,
                        time,
                        status,
                        maintenance, 
                        priority,
                        p.account_id as account_id,
                        parent_id,
                        created_on,
                        pc.id as category_id,
                        case 
                            when category_id is not null then pc.title
                            else null
                        end as category            
                from project p
                left join project_category pc 
                    on pc.id = p.category_id
                where p.title=$1 
                    and p.account_id=
                            (select id from account where username=$2) 
                order by priority desc 
                limit 1`,
            [title, username]);
        if (project != null) {
            project['documents'] = await Data.QueryRows(
                `select w.title  
                    from wiki w
                    inner join project_wiki_link pwl on w.id = pwl.wiki_id
                    where pwl.project_id=$1`,
                [project['id']]);
            project['deliverables'] = await Data.QueryRows(
                `select d.title, d.completed
                     from deliverable d
                     where project_id=$1
                     order by d.completed desc, 
                              d.created_on`,
                [project['id']])
            project['news'] = await Project.get_news(project)
            // Project['children'] = await Project.get_children(Project);
            project['children'] = {
                todo: await Project.get_children_to_do(project),
                completed: await Project.get_children_completed(project)
            }
            if (project['parent_id'] != null) {
                project['parent_title'] = (await Data.QueryFirst(
                    'select title from Project where id=$1',
                    [project['parent_id']]
                ))['title'];
            }
            return project;
        } else {
            return null;
        }
    },

    async get_last_24_hours(username: string) {
        return await Data.QueryRows(
            `select p.title as title,
                        c.title as category,
                        p.description as description,
                        status
                from project p
                left join project_category c on p.category_id = c.id
                where p.account_id=(select id from account where username=$1)
                    and created_on >= now() - '1 day'::interval
--                     and p.status='In Development'
--                     and parent_id is null
                    order by created_on desc `,
            [username]
        );
    },

    async add(title: string, username: string, category: string) {
        await Data.Execute(`insert into project (title, account_id) values ($1,                                                             (select id from account where username=$2))`,
            title, username)
        let project = await Project.get(title, username);

        await Project.set_category(project, category, username);
    },

    async update(project, title: string, status: string, time: string, maintenance: string, priority: number) {
        if (maintenance == "None") {
            maintenance = null;
        }
        await (Data.Execute(
            `update project
                set title=$1,
                    status=$2,
                    time=$3,
                    maintenance=$4,
                    priority=$5
                    where id=$6`,
            title, status, time, maintenance, priority, project['id']
        ));
    },

    async set_description(project, description: string) {
        await (Data.Execute(
            `update project
                  set description=$1
                  where id=$2`,
            description, project['id']
        ));
    },

    async delete(project: string, username: string) {
        let data = await Project.get(project, username);
        if (data != null) {
            // language=PostgreSQL
            // ts-ignore
            await Data.Execute(`call delete_project($1)`, data['id']);
        }
    },

    async set_category(project, category: string, username: string) {
        // language=PostgreSQL
        await Data.Execute(`call set_category_to_project($1, $2, $3)`,
            username, category, project.id);
    },

    async set_parent(project, username: string, parent: string) {
        if (parent == project.title) {
            throw new Error("Project cannot be its own parent")
        }

        if (project == null) {
            throw new Error("Project is invalid")
        }

        await Data.Execute(
            `update project
                set parent_id=(select id
                               from project
                               where title=$1
                                and account_id=(select id from account where username=$2))
                where id=$3`,
            parent, username, project['id']
        );
    },

    async remove_parent(project) {
        await Data.Execute(
            `update project
                 set parent_id=null
                 where id=$1`,
            project['id']
        )
    },

    async get_children(project) {
        return await Data.QueryRows(
            `select * 
                 from project
                 where parent_id=$1`,
            [project['id']]
        );
    },

    async get_without_category(username: string) {
        return await Data.QueryRows(
            `select title
                from project p
                where account_id=(select id from account 
                                            where username=$1)
                    and category_id is null
                    and parent_id is null`,
            [username]
        );
    },

    async get_in_progress(username: string, with_parent: boolean = false) {
        return await Data.QueryRows(
            `select p.title as title,
                        c.title as category,
                    p.description as description,
                        status
                from project p
                left join project_category c on p.category_id = c.id
                where c.account_id=(select id from account where username=$1)
                    and p.status='In Development'
                    ${with_parent ? "and parent_id is not null" : "and parent_id is null"}
                    --and parent_id is null
                    order by priority desc `,
            [username]
        );
    },

    async get_in_progress_category(username: string, category: string, with_parent: boolean = false) {
        return await Data.QueryRows(
            `select p.title as title,
                        c.title as category,
                    p.description as description,
                        status
                from project p
                left join project_category c on p.category_id = c.id
                where c.account_id=(select id from account where username=$1)
                  and p.category_id=(select id from project_category where c.title=$2)
                    and p.status='In Development'
                    ${with_parent ? "and parent_id is not null" : "and parent_id is null"}
                    --and parent_id is null
                    order by priority desc `,
            [username]
        );
    },

    async get_on_going(username: string) {
        return await Data.QueryRows(
            `select p.title as title,
                        c.title as category,
                    p.description as description,
                        status
                from project p
                left join project_category c on p.category_id = c.id
                where c.account_id=(select id from account where username=$1)
                    and p.status='On-Going'
                  and parent_id is null
                    order by priority desc `,
            [username]
        );
    },

    async get_on_going_category(username: string) {
        return await Data.QueryRows(
            `select p.title as title,
                        c.title as category,
                    p.description as description,
                        status
                from project p
                left join project_category c on p.category_id = c.id
                where c.account_id=(select id from account where username=$1)
                  and p.category_id=(select id from project_category where c.title=$2)
                    and p.status='On-Going'
                  and parent_id is null
                    order by priority desc `,
            [username]
        );
    },

    async get_children_to_do(project) {
        return await Data.QueryRows(
            `select * 
                 from project
                 where parent_id=$1
                 and (status='In Development' or status='Not Started' or status='On Hold')`,
            [project['id']]
        );
    },

    async get_children_completed(project) {
        return await Data.QueryRows(
            `select * 
                 from project
                 where parent_id=$1
                 and (status='Completed' or status='On-Going' or status='Retired')`,
            [project['id']]
        );
    },

    async get_analysis(username: string, options) {
        let priority = parseInt(options['min_priority'])
        let sort = "priority";
        if (options['sort'] === 'Time' || options['sort'] === 'Status' || options['sort'] === "Maintenance") {
            sort = options['sort'];
            sort += ", priority"
        }
        let params = [
            username,
            (!isNaN(priority)) ? priority : 0,
        ];
        if (options['category'] != 'All' && options['category'] != null) params.push(options['category'])
        let data = await Data.Pool.query(`
            select p.title as project,
                        c.title as category,
                        time,
                        status,
                        maintenance,
                        priority
                 from project p
                 left join project_category c on c.id = p.category_id
                 where p.account_id=(select id from account where username=$1)
                     and p.priority>=$2
--                          and p.parent_id is null
                 ${((options['category'] != 'All' && options['category'] != null) ? "and c.title=$3" : "")}
                 order by ${sort} desc;`,
            params
        );
        return data.rows;
    },

    async get_by_category(category: string, username: string, filter_children = true) {
        return await (Data.QueryRows(
            `
                select p.title as title,
                       pc.title as category,
                       p.description as description,
                       status,
                       parent_id as parent
                from project p
                inner join project_category pc on pc.id = p.category_id
--                          inner join project_category_link pcl on Project.id = pcl.project_id
                where p.category_id = (select id from project_category where title=$1)
                  and p.account_id=(select id from account where username=$2)
                --and p.parent_id is null
                order by p.priority desc ;`,
            [category, username]
        ))
    },

    async add_wiki_page(project, title: string, username: string, kind: string) {
        let content = (doc_templates.hasOwnProperty(kind)) ? doc_templates[kind] : "";
        let document_name = title + " - " + project['title'];
        await Wiki.add(document_name, content, username);
        await Data.Execute(`insert into project_wiki_link (project_id, wiki_id) VALUES 
                                         (
                                          $1, (select id from wiki where title=$2)
                                         )`, project['id'], document_name)
    },

    async get_categories(username: string) {
        return await Data.QueryRows(
            `select title
                from project_category
                where account_id=(select id from account where username=$1)`,
            [username]);
    },

    async get_category_counts(username: string) {
        return await Data.QueryRows(
            `select c.title as category,
                        count(*) as count
                 from project p 
                 inner join project_category c on c.id = p.category_id
                 where p.account_id=(select id from account where username=$1)
                 group by c.title`,
            [username]
        )
    },

    async get_category_counts_by_status(username: string, status: string) {
        return await Data.QueryRows(
            `select c.title as category,
                        count(*) as count
                 from project p 
                 inner join project_category c on c.id = p.category_id
                 where p.account_id=(select id from account where username=$1)
                 and status=$2
                 group by c.title`,
            [username, status]
        )
    },

    async get_news(project, page: number = 1) {
        // page -= 1
        // let limit = Project.news_per_page;
        // let offset = limit * page;
        return await Data.QueryRows(
            "select * from project_news where project_id=$1",
            [project['id']]
        );
    },

    async get_news_all_projects(username: string, page: number = 1) {
        // page -= 1
        // let limit = Project.news_per_page;
        // let offset = limit * page;
        return await Data.QueryRows(
            `select n.title as title,
                        p.title as project,
                        n.date as date,
                        n.content as content
                from project_news n 
                inner join project p on p.id = n.project_id
                where account_id=(select id from account where username=$1) 
                order by n.date desc
                limit 100`,
            [username]
        );
    },

    async add_news_article(project, title: string, content: string, date: Date) {
        await Data.Execute(
            `insert into project_news (title, content, date, project_id) 
                VALUES ($1,
                        $2,
                        $3,
                        $4)`,
            title, content, Data.ToSQLDate(date), project['id']
        )
    }

    // async get_all_by_user(username: string) {
    //     return await Data.QueryRows(
    //         `select *
    //             from Project
    //             where account_id=(select id from account
    //                                         where username=$1)
    //             order by priority desc
    //             limit 100`,
    //         [username]
    //     );
    // },
}