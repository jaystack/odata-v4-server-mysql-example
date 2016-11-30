import { createQuery } from "odata-v4-mysql";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import connect from "./connect";
import convertResult from "./utils/convertResult";
import update from "./utils/update";
import insert from './utils/insert';

@odata.type(Product)
export class ProductsController extends ODataController {

    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Product[]> {
        const db = await connect();
        await db.query("USE northwind");
        const sqlQuery = createQuery(query);
        const results = await db.query(`SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}`, [...sqlQuery.parameters]);
        return convertResult(results);
    }

    @odata.GET
    async findOne( @odata.key key: number, @odata.query query: ODataQuery): Promise<Product> {
        const db = await connect();
        await db.query("USE northwind");
        const sqlQuery = createQuery(query);
        const results = await db.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
        return convertResult(results)[0];
    }

    @odata.GET("Category")
    async getCategory( @odata.result result: Product, @odata.query query: ODataQuery): Promise<Category> {
        const db = await connect();
        await db.query("USE northwind");
        const sqlQuery = createQuery(query);
        const results = await db.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters]);
        return results[0];
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory( @odata.key key: number, @odata.link link: string): Promise<number> {
        const db = await connect();
        await db.query("USE northwind");
        return await db.query(`UPDATE Products SET CategoryId = ? WHERE Id = ?`, [link, key]);
    }

    @odata.DELETE("Category").$ref
    async unsetCategory( @odata.key key: number): Promise<number> {
        const db = await connect();
        await db.query("USE northwind");
        return await db.query(`UPDATE Products SET CategoryId = NULL WHERE Id = ?`, [key]);
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        const db = await connect();
        await db.query("USE northwind");
        return await insert(db, 'Products', data);
    }

    @odata.PUT
    async upsert( @odata.key key: number, @odata.body data: any, @odata.context context: any): Promise<Product> {
        const db = await connect();
        await db.query("USE northwind");
        return await db.query(`
                            INSERT INTO Products
                                (Id,QuantityPerUnit,UnitPrice,CategoryId,Name,Discontinued)
                            VALUES
                                (?,?,?,?,?,?)
                            ON DUPLICATE KEY UPDATE
                                QuantityPerUnit=?,UnitPrice=?,CategoryId=?,Name=?,Discontinued=?`,
            [key, data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued,
                data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued]);
    }

    @odata.PATCH
    async update( @odata.key key: number, @odata.body delta: any): Promise<any> {
        const db = await connect();
        await db.query("USE northwind");
        return update(db, delta, key, 'Products');
    }

    @odata.DELETE
    async remove( @odata.key key: number): Promise<number> {
        const db = await connect();
        await db.query("USE northwind");
        return await db.query(`DELETE FROM Products WHERE Id = ?`, [key]);
    }

    @Edm.Function
    @Edm.EntityType(Product)
    async getCheapest(): Promise<Product> {
        const db = await connect();
        await db.query("USE northwind");
        const results: Product[] = await db.query(`SELECT * FROM Products WHERE UnitPrice = (SELECT MIN(UnitPrice) FROM Products)`);
        return convertResult(results)[0];
    }

    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Product[]> {
        const db = await connect();
        await db.query("USE northwind");
        const results = await db.query(`SELECT * FROM Products WHERE UnitPrice BETWEEN ? AND ?`, [min, max]);
        return convertResult(results);
    }

    @Edm.Action
    async swapPrice( @Edm.String key1: number, @Edm.String key2: number) {
        const db = await connect();
        await db.query("USE northwind");
        const product1 = (await db.query(`SELECT * FROM Products WHERE Id = ?`, [key1]))[0];
        const product2 = (await db.query(`SELECT * FROM Products WHERE Id = ?`, [key2]))[0];
        await db.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [product1.UnitPrice, key2]);
        await db.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [product2.UnitPrice, key1]);
    }

    @Edm.Action
    async discountProduct( @Edm.String productId: number, @Edm.Int32 percent: number): Promise<void> {
        const db = await connect();
        await db.query("USE northwind");
        const product = await db.query(`SELECT * FROM Products WHERE Id = ?`, [productId]);
        const discountedPrice = ((100 - percent) / 100) * product[0].UnitPrice;
        await db.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [discountedPrice, productId]);
    }
}

@odata.type(Category)
export class CategoriesController extends ODataController {

    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Category[]> {
        const db = await connect();
        await db.query("USE northwind");
        const sqlQuery = createQuery(query);
        return await db.query(`SELECT ${sqlQuery.select} FROM Categories WHERE ${sqlQuery.where}`, [...sqlQuery.parameters]);
    }

    @odata.GET
    async findOne( @odata.key key: number, @odata.query query: ODataQuery): Promise<Category> {
        const db = await connect();
        await db.query("USE northwind");
        const sqlQuery = createQuery(query);
        const results = await db.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
        return convertResult(results)[0];
    }

    @odata.GET("Products")
    async getProducts( @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product[]> {
        const db = await connect();
        await db.query("USE northwind");
        const sqlQuery = createQuery(query);
        const results = await db.query(`SELECT ${sqlQuery.select} FROM Products WHERE CategoryId = ? AND (${sqlQuery.where})`, [result.Id, ...sqlQuery.parameters]);
        return convertResult(results);
    }

    @odata.GET("Products")
    async getProduct( @odata.key key: number, @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product> {
        const db = await connect();
        await db.query("USE northwind");
        const sqlQuery = createQuery(query);
        const results = await db.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (${sqlQuery.where})`, [key, , result.Id, ...sqlQuery.parameters]);
        return convertResult(results)[0];
    }

    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    async setCategory( @odata.key key: number, @odata.link link: string): Promise<number> {
        const db = await connect();
        await db.query("USE northwind");
        return (await db.query(`UPDATE Products SET CategoryId = ? WHERE Id = ? `, [key, link]))[0];
    }

    @odata.DELETE("Products").$ref
    async unsetCategory( @odata.key key: number, @odata.link link: string): Promise<number> {
        const db = await connect();
        await db.query("USE northwind");
        return (await db.query(`UPDATE Products SET CategoryId = NULL WHERE Id = ?`, [link]))[0];
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Category> {
        const db = await connect();
        await db.query("USE northwind");
        return await insert(db, 'Categories', data);
    }

    @odata.PUT
    async upsert( @odata.key key: number, @odata.body data: any): Promise<Category> {
        const db = await connect();
        await db.query("USE northwind");
        return await db.query(`INSERT INTO Categories
                                (Id,Description,Name) VALUES (?,?,?)
                                ON DUPLICATE KEY UPDATE Description=?,Name=?`,
            [key, data.Description, data.Name, data.Description, data.Name]);
    }

    @odata.PATCH
    async update( @odata.key key: number, @odata.body delta: any): Promise<number> {
        const db = await connect();
        await db.query("USE northwind");
        return update(db, delta, key, 'Categories');
    }

    @odata.DELETE
    async remove( @odata.key key: number): Promise<number> {
        const db = await connect();
        await db.query("USE northwind");
        return await db.query(`DELETE FROM Categories WHERE Id = ?`, [key]);
    }
}