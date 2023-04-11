import * as express from 'express';
import {Router} from 'express';
import {IApp} from "../App";
import {ContainsBodyArgs, IsLoggedIn, IsNotNull, RenderTemplate} from "../../Modules/ServerHelper";
import {Data} from "../../Modules/Database";
import {WikiApp} from "../Wiki/WikiApp";
import {Project} from "./Project";
import {Deliverable} from "./Deliverable";

export class Portfolio implements IApp {
    GetName(): string {
        return "Portfolio";
    }

    GetRouter(): express.Router {
        let router = Router();
        router.use(IsLoggedIn);

        router.get("/", async (req, res) => {
            let data = {};
            try {
                data['projects'] = await Project.GetProjectsWithoutCategory(req.session['username']);
                data['categories'] = await Project.GetCategoriesByUser(req.session['username']);
            } catch (e) {
                data['error'] = "Unable to retrieve projects."
            }
            RenderTemplate(req, res, 'Portfolio', 'portfolio/index.ejs', data)
        })

        router.get('/analysis', async (req, res) => {
            req.query['min_priority'] = req.query['min_priority'] || "0"
            let projects = await Project.GetProjectAnalysis(req.session['username'], req.query);
            let category_data = await Project.GetCategoriesByUser(req.session['username']);
            let categories = category_data.map(c => c['title']);
            categories.push('All');
            RenderTemplate(req, res, 'Portfolio Analysis', 'portfolio/analysis.ejs', {projects, priority: req.query['min_priority'] || 0, sort: req.query['sort'] || 'Only Priority', categories, category: req.query['category'] || "All"})
        })

        router.get('/deliver', async (req, res) => {

            let deliverables = await Deliverable.GetDeliverables(req.session['username'], req.query);
            RenderTemplate(req, res, 'Portfolio Analysis', 'portfolio/deliver.ejs', {deliverables})
        })

        router.post('/portfolio/project/parent', async (req, res) => {
            let project = Project.Get(req.body['project'], req.session['username']);
            try {
                await Project.SetParent(project, req.session['username'], req.body['parent']);
                res.redirect('/portfolio/project/' + project['title'])
            } catch (e) {
                console.log(e)
                res.redirect('/portfolio')
            }
        })

        router.post('/portfolio/project/delete', async (req, res) => {
            let project = Project.Get(req.body['project'], req.session['username']);
            try {
                await Project.RemoveParent(project);
                res.redirect('/portfolio/project/' + project['title'])
            } catch (e) {
                console.log(e)
                res.redirect('/portfolio')
            }
        })

        router.get('/project/:name', async (req, res) => {
            let title = "error";
            let data = {};
            try {
                let project = await Project.Get(req.params['name'], req.session['username']);
                if (project != null) {
                    title = project['title'];
                    data['project'] = project;
                } else {
                    data['error'] = "Project Not Found";
                }
            } catch (e) {
                console.error(e);
                data['error'] = "Error loading project";
            }

            RenderTemplate(req, res, `${title} - Projects`, 'portfolio/project.ejs', data);
        })

        router.get('/project/category/:category', async (req, res) => {
            let projects = await Project.GetByCategory(req.params['category'], req.session['username']);
            console.log(projects)
            RenderTemplate(req, res, req.params['category'] + " Projects", 'portfolio/results.ejs', {
                projects, message: req.params['category'] + " Projects"
            })
        })

        router.post('/project/category', async (req, res) => {
            let project = await Project.Get(req.body['project'], req.session['username']);
            if (project != null) {
                await Project.AddCategoryToProject(project, req.body['category'], req.session['username']);
            }
            res.redirect('/portfolio/project/' + req.body['project'])
        })

        router.post('/project/update', async (req, res) => {
            try {
                console.log(req.body)
                if (ContainsBodyArgs(req, res, 'status', 'time', 'maintenance', 'priority')) {
                    let project = await Project.Get(req.body['project'], req.session['username'])
                    await Project.Update(project, req.body['status'], req.body['time'], req.body['maintenance'], req.body['priority'])
                }
            } catch (e) {
                console.error(e)
            }

            res.redirect('/portfolio/project/' + req.body['project'])
        })

        router.get("/create", (req, res) => {
            RenderTemplate(req, res, 'Portfolio', 'portfolio/create.ejs', {})
        })

        router.post('/create', async (req, res) => {
            let {title} = req.body;
            if (!IsNotNull(req, res, title)) {
                RenderTemplate(req, res, 'Portfolio', 'portfolio/create.ejs', {error: "Please enter all fields"})
            }

            try {
                await Project.Add(title, req.session['username']);
                res.redirect('/portfolio')
            } catch (e) {
                console.error(e);
                RenderTemplate(req, res, 'Portfolio', 'portfolio/create.ejs', {error: "Error saving new project."})
            }
        })

        router.post('/wiki', async (req, res) => {
            try {
                let project = await Project.Get(req.body['project'], req.session['username']);
                if (project != null) {
                    await Project.AddWikiPage(project, req.body['title'], req.session['username'], req.body['kind']);
                }
                res.redirect('/portfolio/project/' + req.body['project'])
            } catch (e) {
                console.error(e)
                res.redirect('/portfolio/project/' + req.body['project'])
            }
        })

        router.post('/delete', async (req, res) => {
            await Project.Delete(req.body['project'], req.session['username'])
            res.redirect('/portfolio')
        })

        router.post("/deliverable", async (req, res) => {
            let project = await Project.Get(req.body['project'], req.session['username']);
            if (project != null) {
                await Deliverable.AddDeliverable(project, req.body['title']);
            }
            res.redirect('/portfolio/project/' + project['title'])
        })

        router.post('/deliverable/track', async (req, res) => {
            console.log(req.body)
            if (req.body['completed'] == 'on') {
                await Data.Execute(`update deliverable set completed=now() where project_id=(select id from project where project.title=$1 and account_id=(select id from account where username=$2)) and title=$3;`, req.body['project'], req.session['username'], req.body['title'])
            } else {
                await Data.Execute(`update deliverable set completed=null where project_id=(select id from project where project.title=$1 and account_id=(select id from account where username=$2)) and title=$3;`, req.body['project'], req.session['username'], req.body['title'])
            }
            res.redirect("/portfolio/project/" + req.body['project'])
        })

        // router.get("/objectives", async (req, res) => {
        //     let data = {};
        //     try {
        //         let username = req.session['username'];
        //         let projects = await Data.Query(`select * from objective where account_id=
        //                     (select id from account where username=$1) order by created_on desc limit 100`, username);
        //         data['projects'] = projects.rows;
        //     } catch (e) {
        //         data['error'] = "Unable to retrieve projects."
        //     }
        //     RenderTemplate(req, res, 'Portfolio', 'portfolio/index.ejs', data)
        // })

        return router;
    }



    GetWebUrl(): string {
        return "/portfolio";
    }

    public DocTemplates = {
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