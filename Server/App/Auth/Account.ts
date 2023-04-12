import * as bcrypt from "bcrypt";
import {Data} from "../../Modules/Database";

export class Account {
    public static UsernameMinimum = 1;
    public static UsernameMaximum = 20;
    public static PasswordMinimum = 8;
    public static PasswordMaximum = 71; //Probably will be 72, but just to be safe.
    public static SaltRounds = 10;
    public static CreationEnabled = true;
    
    public static async Create(username: string, password: string, first_name: string, last_name: string) {
        if (username.length < Account.UsernameMinimum) {
            throw new Error(`Username must be at least ${Account.UsernameMinimum} characters long.`);
        }

        if (username.length > Account.UsernameMaximum) {
            throw new Error(`Username cannot be longer than ${Account.UsernameMaximum} characters long.`)
        }

        if (password.length < Account.PasswordMinimum) {
            throw new Error(`Password must be at least ${Account.PasswordMinimum} characters long.`)
        }

        if (password.length > Account.PasswordMaximum) {
            throw new Error(`Password cannot be longer than ${Account.PasswordMaximum} characters long.`)
        }

        if (first_name.length == 0) {
            throw new Error(`Please enter your first name`);
        }

        if (last_name.length == 0) {
            throw new Error(`Please enter your last name`)
        }

        if (await Account.UsernameExists(username)) {
            throw new Error('Username already exists. Please choose a different username.')
        }

        let hash;
        try {
            hash = await bcrypt.hash(password, Account.SaltRounds);
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
    }

    public static async UsernameExists(username: string) {
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
    }

    public static async Login(username: string, password: string) {
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
    }

    public static async Delete(username: string, password: string) {

    }
}