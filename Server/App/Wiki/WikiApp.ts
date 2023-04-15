import {Router} from "express";
import {ContainsBodyArgs, IsLoggedIn, RenderTemplate, SendAsDownload} from "../../Modules/ServerHelper";
import {WikiDao} from "./WikiDao";

export const wiki_api = Router();

wiki_api.use(IsLoggedIn);
wiki_api.get('/', async (req, res) => {
    let page = await WikiDao.GetPage(`Home`, req.session['username']);
    if (page != null) {
        RenderTemplate(req, res, 'Home', 'wiki/page.ejs',
            {wiki_page: page['content'], content_page: page['content']})
    } else {
        RenderTemplate(req, res, 'WikiApp', 'wiki/add.ejs', {title: 'Home'});
    }
});

wiki_api.get('/recent', async (req, res) => {
    try {
        RenderTemplate(req, res,
            'WikiApp',
            'wiki/index.ejs',
            {pages: await WikiDao.GetRecent(req.session['username'])});
    } catch (e) {
        RenderTemplate(req, res, 'Recent - Wiki', 'wiki/index.ejs', {error: 'Unable to retrieve recent wiki pages.'});
    }
})

wiki_api.get("/api/:name", async (req, res) => {
    let name: string = req.params["name"];
    try {
        let page = await WikiDao.GetPage(name, req.session['username']);
        res.json({title: page['title'], content: page['content'], created_on: page['created_on']});
    } catch (e) {
        console.error(e)
        res.sendStatus(500);
    }
})

wiki_api.get("/download/:name", async (req, res) => {
    let name: string = req.params["name"];
    try {
        let page = await WikiDao.GetPage(name, req.session['username']);
        SendAsDownload(res, page['title'] + ".html", page['content'] + "\n\n" + page['created_on']);
    } catch (e) {
        console.error(e)
        res.sendStatus(500);
    }
})

wiki_api.get("/add/title/:title", (req, res) => {
    RenderTemplate(req, res, 'WikiApp', 'wiki/add.ejs', {title: 'title'});
})

wiki_api.get("/add", (req, res) => {
    RenderTemplate(req, res, 'WikiApp', 'wiki/add.ejs', {title: ''});
})

wiki_api.get('/page/:name', async (req, res) => {
    try {
        let page = await WikiDao.GetPage(req.params['name'], req.session['username'])
        if (page != null) {
            RenderTemplate(req, res, page['title'], 'wiki/page.ejs', {wiki_page: page['content'], content_page: page['content']});
        } else {
            RenderTemplate(req, res, 'Not Found - WikiApp', 'wiki/page.ejs', {error: `Could not find page ${req.params['name'].substring(0, 100)}`});
        }
    } catch (e) {
        console.error(e)
        RenderTemplate(req, res, 'Not Found - WikiApp', 'wiki/page.ejs', {error: 'Database error. Please try again later'});
    }
})

wiki_api.post('/', async (req, res) => {
    if (!ContainsBodyArgs(req, res, 'title', 'content')) {
        RenderTemplate(req, res, 'New WikiApp Page', 'wiki/add.ejs', {error: "Need title and content"});
        return;
    }

    // Add length

    try {
        let title = req.body['title'];
        let content = req.body['content'];
        let account = req.session['username'];
        let url = await WikiDao.CreatePage(title, content, account);
        res.redirect(url);
    } catch (e) {
        console.error(e);
        RenderTemplate(req, res, 'New WikiApp Page', 'wiki/add.ejs', {error: "Database error. Could not add."});
    }
})

wiki_api.post('/update', async (req, res) => {
    await WikiDao.Update(req.body['title'],
        req.session['username'],
        req.body['content']);
    res.redirect('/wiki/page/' + req.body['title'])
})

wiki_api.get('/search', async (req, res) => {
    if (req.query['term'] != null) {
        let pages = await WikiDao.Search(req.query['term'] as string, req.session['username']);
        RenderTemplate(req, res, "Search Wiki", 'wiki/search.ejs', {results: pages});
    } else {
        RenderTemplate(req, res, "Search Wiki", 'wiki/search.ejs');
    }
})

// export class WikiApp implements IApp{
//     GetName(): string {
//         return "Wiki";
//     }
//
//     GetRouter(): e.Router {
//         let router = Router();
//
//         router.use(IsLoggedIn);
//         router.get('/', async (req, res) => {
//             let page = await WikiDao.GetPage(`Home`, req.session['username']);
//             if (page != null) {
//                 RenderTemplate(req, res, 'Home', 'wiki/page.ejs',
//                     {wiki_page: page['content'], content_page: page['content']})
//             } else {
//                 RenderTemplate(req, res, 'WikiApp', 'wiki/add.ejs', {title: 'Home'});
//             }
//             // try {
//             //     RenderTemplate(req, res,
//             //         'WikiApp',
//             //         'wiki/index.ejs',
//             //         {pages: await WikiDao.GetRecent(req.session['username'])});
//             // } catch (e) {
//             //     RenderTemplate(req, res, 'WikiApp', 'wiki/index.ejs', {error: 'Unable to retrieve recent wiki pages.'});
//             // }
//         });
//
//         router.get('/recent', async (req, res) => {
//             try {
//                 RenderTemplate(req, res,
//                     'WikiApp',
//                     'wiki/index.ejs',
//                     {pages: await WikiDao.GetRecent(req.session['username'])});
//             } catch (e) {
//                 RenderTemplate(req, res, 'Recent - Wiki', 'wiki/index.ejs', {error: 'Unable to retrieve recent wiki pages.'});
//             }
//         })
//
//         router.get("/api/:name", async (req, res) => {
//             let name: string = req.params["name"];
//             try {
//                 let page = await WikiDao.GetPage(name, req.session['username']);
//                 res.json({title: page['title'], content: page['content'], created_on: page['created_on']});
//             } catch (e) {
//                 console.error(e)
//                 res.sendStatus(500);
//             }
//         })
//
//         router.get("/download/:name", async (req, res) => {
//             let name: string = req.params["name"];
//             try {
//                 let page = await WikiDao.GetPage(name, req.session['username']);
//                 SendAsDownload(res, page['title'] + ".html", page['content'] + "\n\n" + page['created_on']);
//             } catch (e) {
//                 console.error(e)
//                 res.sendStatus(500);
//             }
//         })
//
//         router.get("/add/title/:title", (req, res) => {
//             RenderTemplate(req, res, 'WikiApp', 'wiki/add.ejs', {title: 'title'});
//         })
//
//         router.get("/add", (req, res) => {
//             RenderTemplate(req, res, 'WikiApp', 'wiki/add.ejs', {title: ''});
//         })
//
//         router.get('/page/:name', async (req, res) => {
//             try {
//                 let page = await WikiDao.GetPage(req.params['name'], req.session['username'])
//                 if (page != null) {
//                     RenderTemplate(req, res, page['title'], 'wiki/page.ejs', {wiki_page: page['content'], content_page: page['content']});
//                 } else {
//                     RenderTemplate(req, res, 'Not Found - WikiApp', 'wiki/page.ejs', {error: `Could not find page ${req.params['name'].substring(0, 100)}`});
//                 }
//             } catch (e) {
//                 console.error(e)
//                 RenderTemplate(req, res, 'Not Found - WikiApp', 'wiki/page.ejs', {error: 'Database error. Please try again later'});
//             }
//         })
//
//         router.post('/', async (req, res) => {
//             if (!ContainsBodyArgs(req, res, 'title', 'content')) {
//                 RenderTemplate(req, res, 'New WikiApp Page', 'wiki/add.ejs', {error: "Need title and content"});
//                 return;
//             }
//
//             // Add length
//
//             try {
//                 let title = req.body['title'];
//                 let content = req.body['content'];
//                 let account = req.session['username'];
//                 let url = await WikiDao.CreatePage(title, content, account);
//                 res.redirect(url);
//             } catch (e) {
//                 console.error(e);
//                 RenderTemplate(req, res, 'New WikiApp Page', 'wiki/add.ejs', {error: "Database error. Could not add."});
//             }
//         })
//
//         router.post('/update', async (req, res) => {
//             await WikiDao.Update(req.body['title'],
//                 req.session['username'],
//                 req.body['content']);
//             res.redirect('/wiki/page/' + req.body['title'])
//         })
//
//         router.get('/search', async (req, res) => {
//             if (req.query['term'] != null) {
//                 let pages = await WikiDao.Search(req.query['term'] as string, req.session['username']);
//                 RenderTemplate(req, res, "Search Wiki", 'wiki/search.ejs', {results: pages});
//             } else {
//                 RenderTemplate(req, res, "Search Wiki", 'wiki/search.ejs');
//             }
//         })
//
//         return router;
//     }
//
//     GetWebUrl(): string {
//         return "/wiki";
//     }
// }