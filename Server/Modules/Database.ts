import { Pool } from "pg";

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

    public ToSQLDate(date: Date) {
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    }
}