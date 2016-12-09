# odata-v4-server-mysql-example
MySQL Server example for **[JayStack OData V4 Server](https://github.com/jaystack/odata-v4-server)**

## About JayStack OData V4 Server (odata-v4-server)
This example uses **JayStack OData V4 Server [(odata-v4-server)](https://github.com/jaystack/odata-v4-server)** and [odata-v4-mysql](https://github.com/jaystack/odata-v4-mysql) repositories.

You can read more about **JayStack OData V4 Server** in our tutorial at ...

Also there are sevaral other examples on **JayStack OData V4 Server (odata-v4-server)**:
- [client example using React](https://github.com/jaystack/odata-v4-server-react-client-example)
- [server example using MS SQL](https://github.com/jaystack/odata-v4-server-mssql-example)
- [server example using PostgreSql](https://github.com/jaystack/odata-v4-server-pgsql-example)
- [server example using MongoDb](https://github.com/jaystack/odata-v4-server-mongodb-example)

## Technical details of this example
### Setting up the database
You have to create the database manually using these commands in [server.ts](https://github.com/jaystack/odata-v4-server-mysql-example/blob/master/src/server.ts#L17-L34):
```js
await db.query(`DROP DATABASE IF EXISTS northwind`);
await db.query(`CREATE DATABASE northwind`);
await db.query(`USE northwind`);
```

### Setting up the connection string to your MySQL Server
You have to customize the db connection options
by editing [connect.ts](https://github.com/jaystack/odata-v4-server-mysql-example/blob/master/src/connect.ts#L4-L8).
By default, these are the options:
```js
const config = {
    host: "localhost",
    user: "root",
    password: "mysql"
};
```
By default, the server will listen on `port` `3306` therefore it is not set above.

### Building the application
```
npm run build
```

### Testing the application
```
npm test
```

### Starting the application
```
npm start
```

### Creating sample data
After starting the application (it will listen on `localhost:3000` by default) you can generate / recreate the sample dataset
by submitting [localhost:3000/initDb](http://localhost:3000/initDb).
Alternatively if you start unit tests (`npm test`) then the database will be initialized automatically.