import {Data} from "../../Modules/Database";
import {Wiki} from "../Wiki/Wiki";
import {stat} from "fs";
import {marked} from "marked";
import use = marked.use;

export class Project {
    static async GetByUser(username: string) {
        let projects = await Data.Query(`select * from project where account_id=
                            (select id from account where username=$1) order by priority desc limit 100`, username);
        return projects.rows;
    }

    static async GetProjectsWithoutCategory(username: string) {
        let categories = await Data.Query(
            `select title
                from project
                left join project_category_link pcl on project.id = pcl.project_id
                where account_id=(select id from account where username=$1)
                and pcl.project_id is null
                `,
            username);
        return categories.rows;
    }

    static async Delete(project: string, username: string) {
        let data = await Project.Get(project, username);
        if (data != null) {
            // language=PostgreSQL
            await Data.Execute(`call delete_project($1)`, data['id']);
        }
        // await Data.Execute(
        //     `delete from project
        //         where title=$1
        //         and account_id=
        //             (select id
        //              from account
        //              where username=$2)`,
        //     project, username
        // )
    }

    static async GetCategoriesByUser(username: string) {
        let categories = await Data.Query(
            `select title
                from project_category
                where account_id=(select id from account where username=$1)`,
            username);
        return categories.rows;
    }

    static async GetByCategory(category: string, username: string) {
        return (await (Data.Query(
            `
                select *
                from project
                         inner join project_category_link pcl on project.id = pcl.project_id
                where pcl.category_id = (select id from project_category where title=$1)
                  and project.account_id=(select id from account where username=$2)
                order by project.priority desc ;`,
            category, username
        ))).rows
    }

    static async Update(project, status: string, time: string, maintenance: string, priority: number) {
        if (maintenance == "None") {
            maintenance = null;
        }
        await (Data.Execute(
            `update project
                set status=$1,
                    time=$2,
                    maintenance=$3,
                    priority=$4
                    where id=$5`,
                status, time, maintenance, priority, project['id']
            ));
    }

    static async AddCategoryToProject(project, category: string, username: string) {
        // language=PostgreSQL
        await Data.Execute(`call add_category_to_project($1, $2, $3)`,
            username, category, project.id);
        /*await (Data.Execute(`
            begin;

            insert into project_category (title, account_id)
            select $1, (select id from account where username=$2)
            where not exists(
                select 1 from project_category where title=$1 and account_id=
                       (select id from account where username=$2)
            );

            insert into project_category_link (category_id, project_id) 
            values ((select id from project_category where title=$1),
                    (select id from account where username=$2)
                   );

            commit;
            `, category, username
        ));*/
        // await Project.AddCategory(category, username);
        // await Data.Execute(``)
    }

    static async AddCategory(category: string, username: string) {
        await (Data.Execute(`
            insert into project_category (title, account_id)
            select $1, (select id from account where username=$2)
            where not exists(
                select 1 from project_category where title=$1 and account_id=
                       (select id from account where username=$2)
            );`, category, username
        ))
        // await (Data.Execute(`insert into project_category (title, account_id) values ($1,
        //                                                  (select id from account where username=$2))`));
    }

    static async Get(title: string, username: string) {
        let data = await Data.Query(`select * from project where title=$1 and account_id=
                            (select id from account where username=$2) order by priority desc limit 1`, title, username);
        if (data.rows.length > 0) {
            let project = data.rows[0];
            project['categories'] = (await Data.Query(
                `select c.title 
                    from project_category c
                    inner join project_category_link pcl 
                        on c.id = pcl.category_id
                    where pcl.project_id=$1
                    order by c.title`, project['id'])).rows;
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
        "Design": `<h1 id="table-of-contents">Table of Contents</h1>
<ul>
<li><a href="#purpose-of-this-document">Purpose of This Document</a><ul>
<li><a href="#design-process">Design Process</a></li>
</ul>
</li>
<li><a href="#domain-driven-analysis">Domain Driven Analysis</a><ul>
<li><a href="#decisions">Decisions</a></li>
</ul>
</li>
<li><a href="#overall-design">Overall Design</a><ul>
<li><a href="#client">Client</a></li>
<li><a href="#server">Server</a></li>
<li><a href="#data">Data</a></li>
</ul>
</li>
</ul>
<h2 id="purpose-of-this-document">Purpose of This Document</h2>
<h2 id="design-process">Design Process</h2>
<h1 id="domain-driven-analysis">Domain Driven Analysis</h1>
<h2 id="decisions">Decisions</h2>
<h1 id="overall-design">Overall Design</h1>
<h2 id="client">Client</h2>
<h2 id="server">Server</h2>
<h2 id="data">Data</h2>
`,
        "PC": `<h1 id="table-of-contents">Table of Contents</h1>
<ul>
<li><a href="#introduction">Introduction</a></li>
<li><a href="#scope">Scope</a></li>
<li><a href="#objectives">Objectives</a><ul>
<li><a href="#core">Core</a></li>
<li><a href="#stretch">Stretch</a></li>
</ul>
</li>
<li><a href="#swot">SWOT</a><ul>
<li><a href="#strength">Strength</a></li>
<li><a href="#weaknesses">Weaknesses</a></li>
<li><a href="#opportunity">Opportunity</a></li>
<li><a href="#threat">Threat</a></li>
</ul>
</li>
<li><a href="#budget">Budget</a></li>
</ul>
<h2 id="introduction">Introduction</h2>
<h1 id="scope">Scope</h1>
<h1 id="objectives">Objectives</h1>
<h2 id="core">Core</h2>
<h2 id="stretch">Stretch</h2>
<h1 id="swot">SWOT</h1>
<h2 id="strength">Strength</h2>
<h2 id="weaknesses">Weaknesses</h2>
<h2 id="opportunity">Opportunity</h2>
<h2 id="threat">Threat</h2>
<h1 id="budget">Budget</h1>
`,
        "PMP": `<h1 id="table-of-contents">Table of Contents</h1>
<ul>
<li><a href="#executive-summary">Executive Summary</a></li>
<li><a href="#scope">Scope</a><ul>
<li><a href="#scope-overview">Scope Overview</a><ul>
<li><a href="#features">Features</a></li>
<li><a href="#time">Time</a></li>
<li><a href="#budget">Budget</a></li>
</ul>
</li>
<li><a href="#scope-management">Scope Management</a><ul>
<li><a href="#deployment-plan">Deployment Plan</a></li>
<li><a href="#work-breakdown-structure">Work Breakdown Structure</a></li>
<li><a href="#change-control">Change Control</a></li>
<li><a href="#budget-control">Budget Control</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#time-management">Time Management</a><ul>
<li><a href="#milestones">Milestones</a></li>
<li><a href="#schedule">Schedule</a></li>
</ul>
</li>
<li><a href="#budget">Budget</a><ul>
<li><a href="#cost-overview">Cost Overview</a></li>
</ul>
</li>
<li><a href="#quality">Quality</a><ul>
<li><a href="#documentation">Documentation</a></li>
<li><a href="#item-1">Item 1</a></li>
</ul>
</li>
<li><a href="#risks">Risks</a><ul>
<li><a href="#cost-risk">Cost Risk</a></li>
<li><a href="#schedule-risk">Schedule Risk</a></li>
<li><a href="#market-risk">Market Risk</a></li>
<li><a href="#operational-risk">Operational Risk</a></li>
<li><a href="#strategic-risk">Strategic Risk</a></li>
<li><a href="#reputational-risk">Reputational Risk</a></li>
<li><a href="#legal-risk">Legal Risk</a></li>
</ul>
</li>
<li><a href="#issues">Issues</a><ul>
<li><a href="#priority-issue-list">Priority Issue List</a></li>
<li><a href="#issue-list">Issue List</a></li>
</ul>
</li>
<li><a href="#vendor-management">Vendor Management</a><ul>
<li><a href="#procurement">Procurement</a></li>
<li><a href="#compliance">Compliance</a></li>
</ul>
</li>
<li><a href="#appendix">Appendix</a><ul>
<li><a href="#inspiration">Inspiration</a></li>
<li><a href="#future-updates">Future Updates</a></li>
<li><a href="#references">References</a></li>
</ul>
</li>
</ul>
<h2 id="executive-summary">Executive Summary</h2>
<h1 id="scope">Scope</h1>
<h2 id="scope-overview">Scope Overview</h2>
<h3 id="features">Features</h3>
<h3 id="time">Time</h3>
<h3 id="budget">Budget</h3>
<h2 id="scope-management">Scope Management</h2>
<h3 id="deployment-plan">Deployment Plan</h3>
<h3 id="work-breakdown-structure">Work Breakdown Structure</h3>
<h3 id="change-control">Change Control</h3>
<h3 id="budget-control">Budget Control</h3>
<h1 id="time-management">Time Management</h1>
<h2 id="milestones">Milestones</h2>
<h2 id="schedule">Schedule</h2>
<h1 id="budget-1">Budget</h1>
<h2 id="cost-overview">Cost Overview</h2>
<h1 id="quality">Quality</h1>
<h2 id="documentation">Documentation</h2>
<h2 id="item-1">Item 1</h2>
<h1 id="risks">Risks</h1>
<h2 id="cost-risk">Cost Risk</h2>
<h2 id="schedule-risk">Schedule Risk</h2>
<h2 id="market-risk">Market Risk</h2>
<h2 id="operational-risk">Operational Risk</h2>
<h2 id="strategic-risk">Strategic Risk</h2>
<h2 id="reputational-risk">Reputational Risk</h2>
<h2 id="legal-risk">Legal Risk</h2>
<h1 id="issues">Issues</h1>
<h2 id="priority-issue-list">Priority Issue List</h2>
<h2 id="issue-list">Issue List</h2>
<h1 id="vendor-management">Vendor Management</h1>
<h2 id="procurement">Procurement</h2>
<h2 id="compliance">Compliance</h2>
<h1 id="appendix">Appendix</h1>
<h2 id="inspiration">Inspiration</h2>
<h2 id="future-updates">Future Updates</h2>
<h2 id="references">References</h2>
`,
        "RS": `<h1 id="table-of-contents">Table of Contents</h1>
<ul>
<li><a href="#purpose">Purpose</a></li>
<li><a href="#stakeholders">Stakeholders</a><ul>
<li><a href="#sponsor">Sponsor</a></li>
<li><a href="#team">Team</a></li>
<li><a href="#customer">Customer</a></li>
<li><a href="#distributors">Distributors</a></li>
<li><a href="#support">Support</a></li>
<li><a href="#local-authorities-&-community">Local Authorities &amp; Community</a></li>
<li><a href="#negative-stakeholders">Negative Stakeholders</a></li>
</ul>
</li>
<li><a href="#product">Product</a><ul>
<li><a href="#system-overview">System Overview</a></li>
<li><a href="#overall-description">Overall Description</a></li>
<li><a href="#product-perspective">Product Perspective</a><ul>
<li><a href="#system-interfaces">System Interfaces</a></li>
<li><a href="#user-interfaces">User Interfaces</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#appendix">Appendix</a><ul>
<li><a href="#definitions">Definitions</a></li>
<li><a href="#background">Background</a></li>
<li><a href="#references">References</a></li>
</ul>
</li>
</ul>
<h2 id="purpose">Purpose</h2>
<h1 id="stakeholders">Stakeholders</h1>
<h2 id="sponsor">Sponsor</h2>
<h2 id="team">Team</h2>
<h2 id="customer">Customer</h2>
<h2 id="distributors">Distributors</h2>
<h2 id="support">Support</h2>
<h2 id="local-authorities--community">Local Authorities &amp; Community</h2>
<h2 id="negative-stakeholders">Negative Stakeholders</h2>
<h1 id="product">Product</h1>
<h2 id="system-overview">System Overview</h2>
<h2 id="overall-description">Overall Description</h2>
<h2 id="product-perspective">Product Perspective</h2>
<h3 id="system-interfaces">System Interfaces</h3>
<h3 id="user-interfaces">User Interfaces</h3>
<h1 id="appendix">Appendix</h1>
<h2 id="definitions">Definitions</h2>
<h2 id="background">Background</h2>
<h2 id="references">References</h2>
`,
        "BPlan": `<h1 id="table-of-contents">Table of Contents</h1>
<ul>
<li><a href="#executive-summary">Executive Summary</a><ul>
<li><a href="#market-size">Market Size</a></li>
<li><a href="#percent-of-market-we-wish-to-serve">Percent of Market We Wish To Serve</a></li>
<li><a href="#money-made-from-opportunity">Money Made from Opportunity</a></li>
</ul>
</li>
<li><a href="#industry">Industry</a><ul>
<li><a href="#market-growth">Market Growth</a></li>
<li><a href="#consumer-demand">Consumer Demand</a></li>
<li><a href="#margin">Margin</a></li>
</ul>
</li>
<li><a href="#opportunity">Opportunity</a><ul>
<li><a href="#customers">Customers</a></li>
<li><a href="#competition">Competition</a></li>
<li><a href="#production">Production</a></li>
</ul>
</li>
<li><a href="#company-and-product-description">Company and Product Description</a><ul>
<li><a href="#product">Product</a></li>
<li><a href="#design">Design</a></li>
</ul>
</li>
<li><a href="#critical-risks">Critical Risks</a><ul>
<li><a href="#top-5-controllable-risks">Top 5 Controllable Risks</a></li>
<li><a href="#top-5-uncontrollable-risks">Top 5 Uncontrollable Risks</a></li>
<li><a href="#other-miscellaneous-risks-to-consider">Other Miscellaneous Risks to Consider</a></li>
</ul>
</li>
<li><a href="#offering">Offering</a><ul>
<li><a href="#funds-required">Funds Required</a></li>
<li><a href="#equity-offer">Equity Offer</a></li>
</ul>
</li>
<li><a href="#financial-plan">Financial Plan</a><ul>
<li><a href="#annual-profit-&-loss">Annual Profit &amp; Loss</a></li>
</ul>
</li>
<li><a href="#appendix">Appendix</a><ul>
<li><a href="#bibliography">Bibliography</a></li>
</ul>
</li>
</ul>
<h2 id="executive-summary">Executive Summary</h2>
<h2 id="market-size">Market Size</h2>
<h2 id="percent-of-market-we-wish-to-serve">Percent of Market We Wish To Serve</h2>
<h2 id="money-made-from-opportunity">Money Made from Opportunity</h2>
<h1 id="industry">Industry</h1>
<h2 id="market-growth">Market Growth</h2>
<h2 id="consumer-demand">Consumer Demand</h2>
<h2 id="margin">Margin</h2>
<h1 id="opportunity">Opportunity</h1>
<h2 id="customers">Customers</h2>
<h2 id="competition">Competition</h2>
<h2 id="production">Production</h2>
<h1 id="company-and-product-description">Company and Product Description</h1>
<h2 id="product">Product</h2>
<h2 id="design">Design</h2>
<h1 id="critical-risks">Critical Risks</h1>
<h2 id="top-5-controllable-risks">Top 5 Controllable Risks</h2>
<h2 id="top-5-uncontrollable-risks">Top 5 Uncontrollable Risks</h2>
<h2 id="other-miscellaneous-risks-to-consider">Other Miscellaneous Risks to Consider</h2>
<h1 id="offering">Offering</h1>
<h2 id="funds-required">Funds Required</h2>
<h2 id="equity-offer">Equity Offer</h2>
<h1 id="financial-plan">Financial Plan</h1>
<h2 id="annual-profit--loss">Annual Profit &amp; Loss</h2>
<h1 id="appendix">Appendix</h1>
<h2 id="bibliography">Bibliography</h2>

`
    }
}