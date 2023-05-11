import { Pool } from "pg";
//
// import * as pg from "pg";
// import parseDate from "postgres-date";
//
// pg.types.setTypeParser(1082, function (val) {
//     return val === null ? null : parseDate(val)
// })

export let Data: Database = null;

export function SetupDatabaseDevelopment(config) {
    Data = new Database(Database.ConstructUri(
        config.database_dev.username,
        config.database_dev.password,
        config.database_dev.host,
        config.database_dev.port,
        config.database_dev.database
    ));
}

export function SetupDatabaseProductionHeroku() {
    Data = new Database(
        process.env.DATABASE_URL,
        true
    )
}

export function SetupDatabaseProduction(config) {
    Data = new Database(Database.ConstructUri(
        config.database.username,
        config.database.password,
        config.database.host,
        config.database.port,
        config.database.database
    ));
}

class Database {
    public Pool: Pool;

    constructor(url: string, production: boolean = false) {
        let config = {
            connectionString: url,
        }

        if (production) {
            config['ssl'] = {
                rejectUnauthorized: false
            }
        }

        this.Pool = new Pool(config);
    }

    public static ConstructUri(
        username:   string,
        password:   string,
        host:       string,
        port:       string,
        database:   string): string
    {
        return `postgres://${username}:${password}@${host}:${port}/${database}`;
    }

    public async TryGet(res, error_message="Error retrieving Data from Server.",  sql, ...args) {
        try {
            res.json((await this.Query(sql, args)).rows);
        } catch (e) {
            res.status(500).json({message: error_message});
        }
    }

    public async TrySet(res, error_message="Error sending Data to Server.",  sql, ...args) {
        try {
            await this.Execute(sql, args)
            res.sendStatus(200);
        } catch (e) {
            res.status(500).json({message: error_message});
        }
    }

    public async QueryRows(sql, args = []) {
        try {
            return (await this.Pool.query(sql, args)).rows;
        } catch (e) {
            console.error("Database Error: " + e.message);
            throw new Error("Unable to retrieve Data from database");
        }
    }

    public async QueryFirst(sql, args = []) {
        try {
            let data = (await this.Pool.query(sql, args)).rows;
            return (data.length > 0) ? data[0] : null;
        } catch (e) {
            console.error("Database Error: " + e.message);
            throw new Error("Unable to retrieve Data from database");
        }
    }

    public async Query(sql, ...args) {
        try {
            return await this.Pool.query(sql, args);
        } catch (e) {
            console.error("Database Error: " + e.message);
            throw new Error("Unable to retrieve Data from database");
        }
    }

    public async Execute(sql, ...args) {
        try {
            await this.Pool.query(sql, args);
        } catch (e) {
            console.error("Database Error: " + e.message);
            throw new Error("Unable to retrieve Data from database");
        }
    }
}