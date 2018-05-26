export function promisify(method, ...args: any[])
export function promisify(method) {
    const args = [];
    for (let i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    return new Promise((res, rej) => {
        args.push((err, val) => {
            if (err) {
                rej(err);
            } else {
                res(val);
            }
        });
        method.apply(null, args);
    });
}