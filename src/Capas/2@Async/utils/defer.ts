export default function defer() {
    const toReturn = {
        promise: null,
        resolve: null,
        reject: null
    };
    toReturn.promise = new Promise(function (res, rej) {
        toReturn.resolve = res
        toReturn.reject = rej;
    });
    return toReturn;
}