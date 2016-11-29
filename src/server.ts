import * as mysql from "mysql";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, CategoriesController } from "./controller";
import mysqlConnection from "./connection";
import { Category, Product } from "./model";
import promisify from "./utils/promisify";
import getValuesForMultipleRowInsertion from './utils/getValuesForMultipleRowInsertion';
import getParameterStringForMultipleRowInsertion from './utils/getParameterStringForMultipleRowInsertion';
const categories: Category[] = require("../src/categories");
const products: Product[] = require("../src/products");

@odata.namespace("Northwind")
@odata.controller(ProductsController, true)
@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer {
    @Edm.ActionImport
    async initDb() {
        const connection = promisify(await mysqlConnection());
        await connection.query(`DROP DATABASE IF EXISTS northwind_mysql_test_db`);
        await connection.query(`CREATE DATABASE northwind_mysql_test_db`);
        await connection.query(`USE northwind_mysql_test_db`);
        await connection.query("CREATE TABLE Categories (`Id` INT AUTO_INCREMENT,`Description` VARCHAR(25) CHARACTER SET utf8,`Name` VARCHAR(32) CHARACTER SET utf8, PRIMARY KEY (Id));");
        await connection.query("CREATE TABLE Products (`Id` INT AUTO_INCREMENT,`QuantityPerUnit` VARCHAR(20) CHARACTER SET utf8,`UnitPrice` NUMERIC(5, 2),`CategoryId` INT,`Name` VARCHAR(32) CHARACTER SET utf8,`Discontinued` TINYINT(1), PRIMARY KEY (Id));");
        await connection.query(`INSERT INTO Categories VALUES ${getParameterStringForMultipleRowInsertion(categories)};`, getValuesForMultipleRowInsertion(categories));
        await connection.query(`INSERT INTO Products VALUES ${getParameterStringForMultipleRowInsertion(products)};`, getValuesForMultipleRowInsertion(products));
    }
}