import * as session from 'express-session';

export function ContainsBodyArgs(req, res, ...args: string[]): boolean {
    args.forEach(a => {
        if (req.body[a] == undefined) {
            return false;
        }
    });

    return true;
}

export function IsLoggedIn(req, res, next) {
    if (req.session.username != undefined) {
        next()
    } else {
        res.redirect('/auth/login');
    }
}

export function RenderTemplate(res, title, content, data={}) {
    data['title'] = title;
    data['content'] = content;
    res.render('template.ejs', data);
}

export function SetupSession(app) {
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        //cookie: { secure: true }
    }))
}