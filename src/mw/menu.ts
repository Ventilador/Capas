export function menuGetter($http: ng.IHttpService, resolve, reject) {
    return function (menuName: string) {
        return $http.get('http://localhost:5000/menu?id=' + menuName).then(resolve, reject);
    }
}