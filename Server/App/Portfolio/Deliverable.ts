import {Data} from "../../Modules/Database";


export class Deliverable {
    static async GetDeliverables(username: string, options) {
        let deliverables;
        if (options['category'] != null) {
            deliverables = await Data.Query(
                `select d.title as title,
                         p.title as project,
                         d.completed as completed
             from deliverable d
             inner join project p on p.id = d.project_id
--              inner join project_category_link pcl on p.id = pcl.project_id
             inner join project_category pc on pc.id = p.category_id
             where p.account_id=(select id from account where username=$1)
                    and pc.title=$2
                    and p.priority>=$3
                    and (d.completed is null or date(d.completed) = current_date)
             order by d.completed desc ,p.priority desc ;`,
                username,
                // options['order'] || 'priority',
                options['category'],
                options['min_priority'] || 0
            );
        } else {
            deliverables = await Data.Query(
                `select d.title as title,
                         p.title as project,
                         d.completed as completed
             from deliverable d
             inner join project p on p.id = d.project_id
--              inner join project_category_link pcl on p.id = pcl.project_id
             inner join project_category pc on pc.id = p.category_id
             where p.account_id=(select id from account where username=$1)
               and p.priority>=$2
                and (d.completed is null or date(d.completed) = current_date)
                 order by d.completed desc ,p.priority desc ;`,
                username,
                // options['order'] || 'priority',
                options['min_priority'] || 0
            );
        }
        return deliverables.rows;
    }

    static async AddDeliverable(project, deliverable) {
        await Data.Execute(`insert into deliverable (title, project_id) values ($1, $2);`, deliverable,
            project['id']);
    }
}