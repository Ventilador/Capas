export function nextAction($http: ng.IHttpService, resolve, reject) {
    return function (actionName: string) {
        return $http.get('http://localhost:5000/action?id=' + actionName).then(resolve, reject);
    }
}