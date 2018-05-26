export function valueFn(val: any) {
    return function () {
        return val;
    }
}