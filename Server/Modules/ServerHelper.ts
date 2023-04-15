import * as session from 'express-session';
import {marked} from 'marked';

export function ContainsBodyArgs(req, res, ...args: string[]): boolean {
    args.forEach(a => {
        if (req.body[a] == undefined) {
            return false;
        }
    });

    return true;
}

export function MarkdownToHTML(html: string): string {
    return marked.parse(html);
}

export function IsNotNull(...args) {
    args.forEach(a => {
        if (a == null) {
            return false;
        }
    });

    return true;
}

export function SendAsDownload(res, filename: string, content: string) {
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.send(content);
}

export function IsLoggedIn(req, res, next) {
    if (req.session.username != undefined) {
        next()
    } else {
        res.redirect('/auth/login');
    }
}

export function RenderTemplate(req, res, title, content, data={}) {
    data['title'] = title;
    data['content'] = content;
    data['first_name'] = req.session['first_name']
    res.render('template.ejs', data);
}

export function SetupSession(app) {
    app.use(session({
        secret: app.get('config')['session']['secret'],
        resave: false,
        saveUninitialized: true,
        //cookie: { secure: true }
    }))
}