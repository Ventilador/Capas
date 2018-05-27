require('angular');
require('angular-animate');
import './styles.less';
angular.module('capas',
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