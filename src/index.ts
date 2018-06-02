require('angular');
require('angular-animate');
import './styles.less';
let id = 0;
Function('return this')().nextModule = function () {
    return id++ + '';
}
angular.module(nextModule(),
    [
        'ng',
        require('./mw'),
        require('./menu'),
        require('./Capas/2@Async/site')
    ])
    .run(function ($rootScope: ng.IRootScopeService) {
        console.log($rootScope);
    })
    ;