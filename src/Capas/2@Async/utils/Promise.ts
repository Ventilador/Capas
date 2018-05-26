export class CustomPromise<T> extends Promise<T>  { // tslint:ignore-line
    static resolve: { <T>(value: T | PromiseLike<T>): CustomPromise<T>; (): CustomPromise<void>; } = function <T>(val?: T) {
        return new CustomPromise<T>(function (res) {
            res(val);
        });
    };
    constructor(cb: any) {
        super(cb);
    }
    finally(cb) {
        const empty = emptyResolver(cb);
        this.then(empty, empty);
        return this;
    }
    then<T>(...args): CustomPromise<T> {
        return super.then.apply(this, args);
    }
    catch<T>(...args): CustomPromise<T> {
        return super.catch.apply(this, args);
    }
}

CustomPromise.resolve = ((val) => {
    return new CustomPromise(function (res) {
        res(val);
    });
}) as any;

function emptyResolver(cb) {
    return function () {
        cb();
    }
}