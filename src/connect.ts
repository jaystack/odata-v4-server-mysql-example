import * as mysql from "mysql";
import promisify from "./utils/promisify";

const config: mysql.IConnectionConfig = <mysql.IConnectionConfig>{
    "host": "localhost",
    "user": "root",
    "password": "mysql"
};

let connection = null;

export default async function () {
    return connection || (connection = promisify(await mysql.createConnection(config)));
};