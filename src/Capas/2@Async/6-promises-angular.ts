// http://tmtheme-editor.herokuapp.com/#!/editor/theme/Monokai
/* tslint:enable */
let injector = angular.injector(['ng'])
let q = injector.get('$q')

function sleep(amount, val) {
    const defer = q.defer();
    setTimeout(defer.resolve, amount, val);
    return defer.promise;
}
let prom = sleep(10000000000000, 'pedro');
[1, 1, 1, 1].forEach(_ => prom.then(console.log));
[1, 1].reduce(_ => _.then(console.log), ofuscator(prom));
console.log(prom);

// remove ts error by casting to any
function ofuscator(val) {
    return val;
}