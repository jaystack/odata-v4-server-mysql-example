export default function promisify(client) {
    return new Proxy(client, {
        get(target, name) {
            if (name !== 'query')
                return target[name];

            return function (...args) {
                return new Promise((resolve, reject) => {
                    target.query(...args, (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            }
        }
    });
}