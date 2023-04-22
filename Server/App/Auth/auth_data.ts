import * as bcrypt from "bcrypt";
import {Data} from "../../Modules/Database";

export const Account = {
    username_minimum: 1,
    username_maximum: 20,
    password_minimum: 8,
    password_maximum: 71,
    salt_rounds: 10,
    creation_enabled: true,

    async create(username: string, password: string, first_name: string, last_name: string) {
        if (!Account.creation_enabled) {
            throw new Error("Account creation is currently disabled. Please contact the administrator.");
        }

        await Account.validate_username(username);
        Account.validate_password(password);

        if (first_name.length == 0) {
            throw new Error(`Please enter your first name`);
        }

        if (last_name.length == 0) {
            throw new Error(`Please enter your last name`)
        }

        let hash;
        try {
            hash = await bcrypt.hash(password, Account.salt_rounds);
        } catch (e) {
            throw new Error("Error accepting password. Please supply a different password.")
        }

        try {
            await Data.Pool.query(
                `insert into account (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)`,
                [username, hash, first_name, last_name]
            )
            return true;
        } catch (e) {
            console.log(e);
            throw new Error("Error creating account. Please try again in a few minutes.")
        }
    },

    async login(username: string, password: string) {
        let data;
        try {
            data = await Data.Pool.query(`
                select password, first_name, last_name
                from account
                where username=$1
        `, [username]);
        } catch (e) {
            console.log(e);
            throw new Error("Error connecting to database");
        }

        if (data.rowCount == 0) {
            throw new Error("Incorrect username or password.");
        }

        let hash = data.rows[0]['password'];

        if (await bcrypt.compare(password, hash)) {
            return data.rows[0];
        } else {
            throw new Error("Incorrect username or password.");
        }
    },

    async Delete(username: string, password: string) {

    },

    async username_exists(username: string) {
        try {
            let data = await Data.Pool.query(`
                select *
                from account
                where username=$1
                limit 1
        `, [username]);
            return data.rows.length > 0;
        } catch (e) {
            console.log(e);
            throw new Error("Error connecting to database");
        }
    },

    async validate_username(username: string) {
        if (username.length < Account.username_minimum) {
            throw new Error(`Username must be at least ${Account.username_minimum} characters long.`);
        }

        if (username.length > Account.username_maximum) {
            throw new Error(`Username cannot be longer than ${Account.username_maximum} characters long.`)
        }

        if (await Account.username_exists(username)) {
            throw new Error('Username already exists. Please choose a different username.')
        }
    },

    validate_password(password: string) {
        if (password.length < Account.password_minimum) {
            throw new Error(`Password must be at least ${Account.password_minimum} characters long.`)
        }

        if (password.length > Account.password_maximum) {
            throw new Error(`Password cannot be longer than ${Account.password_maximum} characters long.`)
        }
    },
}