import {Application} from "express";
import * as express from 'express';
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as logger from 'morgan';
import * as helmet from "helmet";
import * as enforce from 'express-sslify';
import {SetupDatabaseDevelopment, SetupDatabaseProduction} from "./Database";
import * as fs from "fs";
import {SetupSession} from "./ServerHelper";
import {DayDao} from "../App/Day/DayDao";

export class ServerInit {
    public static GetExpressApp(): Application {
        const runtime_mode = process.env.RUNTIME_MODE || 'development';

        const app = express()

        app.set('views', path.join(__dirname, '../../Client/View'));
        app.set('view engine', 'ejs');

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, '../../Public')));

        switch (runtime_mode) {
            case 'production':
                app.use(enforce.HTTPS({trustProtoHeader: true}));
                app.use(helmet({
                    contentSecurityPolicy: {
                        directives: {
                            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                            "script-src": ["'self'", "https://assets.calendly.com"],
                            "object-src": ["'self'", "https://wakatime.com"],
                            "img-src": ["'self'", "https://img.itch.zone"],
                            "style-src": ["'self'", "https://cdn.jsdelivr.net/gh/devicons/"]
                        }
                    }
                }))
                SetupDatabaseProduction();
                break;
            case 'development':
                // @ts-ignore
                const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'Server.config.json')));
                app.set('config', config)
                SetupDatabaseDevelopment(config);
                SetupSession(app);
                break;
            default:
                throw new Error(`Unknown runtime mode set: ${runtime_mode}`);
        }

        return app;
    }

    public static Run(app: Application) {
        const port = process.env.PORT || app.get('config')?.port || 8750;
        app.listen(port, () => {
            console.log(`Listening on ${port}`);
            console.log(`View at http://localhost:${port} to connect locally.\n`);
        })
    }
}