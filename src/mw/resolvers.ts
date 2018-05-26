export function resolvers(valueFn: any) {
    return {
        resolve: valueFn(function (val) {
            return val.data;
        }),
        reject: valueFn(function (err) {
            return err;
        })
    }
}