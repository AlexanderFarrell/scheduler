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
        "Design": "# Table of Contents\n" +
            "\n" +
            " - [Purpose of This Document](#purpose-of-this-document)\n" +
            "    - [Design Process](#design-process)\n" +
            " - [Domain Driven Analysis](#domain-driven-analysis)\n" +
            "    - [Decisions](#decisions)\n" +
            " - [Overall Design](#overall-design)\n" +
            "    - [Client](#client)\n" +
            "    - [Server](#server)\n" +
            "    - [Data](#data)\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Purpose of This Document\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Design Process\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Domain Driven Analysis\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Decisions\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Overall Design\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Client\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Server\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Data\n" +
            "\n" +
            "\n" +
            "\n",
        "PC": "# Table of Contents\n" +
            "\n" +
            " - [Executive Summary](#executive-summary)\n" +
            " - [Scope](#scope)\n" +
            "    - [Scope Overview](#scope-overview)\n" +
            "       - [Features](#features)\n" +
            "       - [Time](#time)\n" +
            "       - [Budget](#budget)\n" +
            "    - [Scope Management](#scope-management)\n" +
            "       - [Deployment Plan](#deployment-plan)\n" +
            "       - [Work Breakdown Structure](#work-breakdown-structure)\n" +
            "       - [Change Control](#change-control)\n" +
            "       - [Budget Control](#budget-control)\n" +
            " - [Time Management](#time-management)\n" +
            "    - [Milestones](#milestones)\n" +
            "    - [Schedule](#schedule)\n" +
            " - [Budget](#budget)\n" +
            "    - [Cost Overview](#cost-overview)\n" +
            " - [Quality](#quality)\n" +
            "    - [Documentation](#documentation)\n" +
            "    - [Item 1](#item-1)\n" +
            " - [Risks](#risks)\n" +
            "    - [Cost Risk](#cost-risk)\n" +
            "    - [Schedule Risk](#schedule-risk)\n" +
            "    - [Market Risk](#market-risk)\n" +
            "    - [Operational Risk](#operational-risk)\n" +
            "    - [Strategic Risk](#strategic-risk)\n" +
            "    - [Reputational Risk](#reputational-risk)\n" +
            "    - [Legal Risk](#legal-risk)\n" +
            " - [Issues](#issues)\n" +
            "    - [Priority Issue List](#priority-issue-list)\n" +
            "    - [Issue List](#issue-list)\n" +
            " - [Vendor Management](#vendor-management)\n" +
            "    - [Procurement](#procurement)\n" +
            "    - [Compliance](#compliance)\n" +
            " - [Appendix](#appendix)\n" +
            "    - [Inspiration](#inspiration)\n" +
            "    - [Future Updates](#future-updates)\n" +
            "    - [References](#references)\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Executive Summary\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Scope\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Scope Overview\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Features\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Time\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Budget\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Scope Management\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Deployment Plan\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Work Breakdown Structure\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Change Control\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Budget Control\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Time Management\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Milestones\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Schedule\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Budget\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Cost Overview\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Quality\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Documentation\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Item 1\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Risks\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Cost Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Schedule Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Market Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Operational Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Strategic Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Reputational Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Legal Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Issues\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Priority Issue List\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Issue List\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Vendor Management\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Procurement\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Compliance\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Appendix\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Inspiration\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Future Updates\n" +
            "\n" +
            "\n" +
            "\n" +
            "## References\n" +
            "\n" +
            "\n" +
            "\n",
        "PMP": "# Table of Contents\n" +
            "\n" +
            " - [Executive Summary](#executive-summary)\n" +
            " - [Scope](#scope)\n" +
            "    - [Scope Overview](#scope-overview)\n" +
            "       - [Features](#features)\n" +
            "       - [Time](#time)\n" +
            "       - [Budget](#budget)\n" +
            "    - [Scope Management](#scope-management)\n" +
            "       - [Deployment Plan](#deployment-plan)\n" +
            "       - [Work Breakdown Structure](#work-breakdown-structure)\n" +
            "       - [Change Control](#change-control)\n" +
            "       - [Budget Control](#budget-control)\n" +
            " - [Time Management](#time-management)\n" +
            "    - [Milestones](#milestones)\n" +
            "    - [Schedule](#schedule)\n" +
            " - [Budget](#budget)\n" +
            "    - [Cost Overview](#cost-overview)\n" +
            " - [Quality](#quality)\n" +
            "    - [Documentation](#documentation)\n" +
            "    - [Item 1](#item-1)\n" +
            " - [Risks](#risks)\n" +
            "    - [Cost Risk](#cost-risk)\n" +
            "    - [Schedule Risk](#schedule-risk)\n" +
            "    - [Market Risk](#market-risk)\n" +
            "    - [Operational Risk](#operational-risk)\n" +
            "    - [Strategic Risk](#strategic-risk)\n" +
            "    - [Reputational Risk](#reputational-risk)\n" +
            "    - [Legal Risk](#legal-risk)\n" +
            " - [Issues](#issues)\n" +
            "    - [Priority Issue List](#priority-issue-list)\n" +
            "    - [Issue List](#issue-list)\n" +
            " - [Vendor Management](#vendor-management)\n" +
            "    - [Procurement](#procurement)\n" +
            "    - [Compliance](#compliance)\n" +
            " - [Appendix](#appendix)\n" +
            "    - [Inspiration](#inspiration)\n" +
            "    - [Future Updates](#future-updates)\n" +
            "    - [References](#references)\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Executive Summary\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Scope\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Scope Overview\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Features\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Time\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Budget\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Scope Management\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Deployment Plan\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Work Breakdown Structure\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Change Control\n" +
            "\n" +
            "\n" +
            "\n" +
            "### Budget Control\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Time Management\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Milestones\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Schedule\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Budget\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Cost Overview\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Quality\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Documentation\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Item 1\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Risks\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Cost Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Schedule Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Market Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Operational Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Strategic Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Reputational Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Legal Risk\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Issues\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Priority Issue List\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Issue List\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Vendor Management\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Procurement\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Compliance\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Appendix\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Inspiration\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Future Updates\n" +
            "\n" +
            "\n" +
            "\n" +
            "## References\n" +
            "\n" +
            "\n" +
            "\n",
        "RS": "# Table of Contents\n" +
            "\n" +
            " - [Purpose](#purpose)\n" +
            " - [Stakeholders](#stakeholders)\n" +
            "    - [Sponsor](#sponsor)\n" +
            "    - [Team](#team)\n" +
            "    - [Customer](#customer)\n" +
            "    - [Distributors](#distributors)\n" +
            "    - [Support](#support)\n" +
            "    - [Local Authorities & Community](#local-authorities-&-community)\n" +
            "    - [Negative Stakeholders](#negative-stakeholders)\n" +
            " - [Product](#product)\n" +
            "    - [System Overview](#system-overview)\n" +
            "    - [Overall Description](#overall-description)\n" +
            "    - [Product Perspective](#product-perspective)\n" +
            "       - [System Interfaces](#system-interfaces)\n" +
            "       - [User Interfaces](#user-interfaces)\n" +
            " - [Appendix](#appendix)\n" +
            "    - [Definitions](#definitions)\n" +
            "    - [Background](#background)\n" +
            "    - [References](#references)\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Purpose\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Stakeholders\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Sponsor\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Team\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Customer\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Distributors\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Support\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Local Authorities & Community\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Negative Stakeholders\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Product\n" +
            "\n" +
            "\n" +
            "\n" +
            "## System Overview\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Overall Description\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Product Perspective\n" +
            "\n" +
            "\n" +
            "\n" +
            "### System Interfaces\n" +
            "\n" +
            "\n" +
            "\n" +
            "### User Interfaces\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Appendix\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Definitions\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Background\n" +
            "\n" +
            "\n" +
            "\n" +
            "## References\n" +
            "\n" +
            "\n" +
            "\n",
        "BPlan": "# Table of Contents\n" +
            "\n" +
            " - [Executive Summary](#executive-summary)\n" +
            "    - [Market Size](#market-size)\n" +
            "    - [Percent of Market We Wish To Serve](#percent-of-market-we-wish-to-serve)\n" +
            "    - [Money Made from Opportunity](#money-made-from-opportunity)\n" +
            " - [Industry](#industry)\n" +
            "    - [Market Growth](#market-growth)\n" +
            "    - [Consumer Demand](#consumer-demand)\n" +
            "    - [Margin](#margin)\n" +
            " - [Opportunity](#opportunity)\n" +
            "    - [Customers](#customers)\n" +
            "    - [Competition](#competition)\n" +
            "    - [Production](#production)\n" +
            " - [Company and Product Description](#company-and-product-description)\n" +
            "    - [Product](#product)\n" +
            "    - [Design](#design)\n" +
            " - [Critical Risks](#critical-risks)\n" +
            "    - [Top 5 Controllable Risks](#top-5-controllable-risks)\n" +
            "    - [Top 5 Uncontrollable Risks](#top-5-uncontrollable-risks)\n" +
            "    - [Other Miscellaneous Risks to Consider](#other-miscellaneous-risks-to-consider)\n" +
            " - [Offering](#offering)\n" +
            "    - [Funds Required](#funds-required)\n" +
            "    - [Equity Offer](#equity-offer)\n" +
            " - [Financial Plan](#financial-plan)\n" +
            "    - [Annual Profit & Loss](#annual-profit-&-loss)\n" +
            " - [Appendix](#appendix)\n" +
            "    - [Bibliography](#bibliography)\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Executive Summary\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Market Size\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Percent of Market We Wish To Serve\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Money Made from Opportunity\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Industry\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Market Growth\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Consumer Demand\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Margin\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Opportunity\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Customers\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Competition\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Production\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Company and Product Description\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Product\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Design\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Critical Risks\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Top 5 Controllable Risks\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Top 5 Uncontrollable Risks\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Other Miscellaneous Risks to Consider\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Offering\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Funds Required\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Equity Offer\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Financial Plan\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Annual Profit & Loss\n" +
            "\n" +
            "\n" +
            "\n" +
            "# Appendix\n" +
            "\n" +
            "\n" +
            "\n" +
            "## Bibliography\n" +
            "\n" +
            "\n" +
            "\n"
    }
}