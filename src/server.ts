import * as mysql from "mysql";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, CategoriesController } from "./controller";
import connect from "./connect";
import { Category, Product } from "./model";
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
        const db = await connect();
        // TODO db name legyen northwind
        await db.query(`DROP DATABASE IF EXISTS northwind`);
        await db.query(`CREATE DATABASE northwind`);
        await db.query(`USE northwind`);
        // TODO tördeljük be a tábla sémákat
        await db.query("CREATE TABLE Categories (`Id` INT AUTO_INCREMENT,`Description` VARCHAR(25) CHARACTER SET utf8,`Name` VARCHAR(32) CHARACTER SET utf8, PRIMARY KEY (Id));");
        await db.query("CREATE TABLE Products (`Id` INT AUTO_INCREMENT,`QuantityPerUnit` VARCHAR(20) CHARACTER SET utf8,`UnitPrice` NUMERIC(5, 2),`CategoryId` INT,`Name` VARCHAR(32) CHARACTER SET utf8,`Discontinued` TINYINT(1), PRIMARY KEY (Id));");
        // TODO szervezzük ki egy multipleInsert utils függvénybe
        // await multipleInsert(categories)
        await db.query(`INSERT INTO Categories VALUES ${getParameterStringForMultipleRowInsertion(categories)};`, getValuesForMultipleRowInsertion(categories));
        await db.query(`INSERT INTO Products VALUES ${getParameterStringForMultipleRowInsertion(products)};`, getValuesForMultipleRowInsertion(products));
    }
}