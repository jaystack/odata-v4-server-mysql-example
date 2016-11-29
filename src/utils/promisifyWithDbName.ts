export default function promisifyWithDbName(client) {
  return new Proxy(client, {
    get(target, name) {
      if (name !== 'query')
        return target[name];

      return function (...args) {
        return new Promise((resolve, reject) => {
          target.query(`USE northwind_mysql_test_db`, (error, res) => {
            if (error) return reject(error);
            target.query(...args, (err, result) => {
              if (err) return reject(err);
              resolve(result);
            })
          })
        });
      }
    }
  });
}