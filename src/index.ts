require('angular');
require('angular-animate');
import './styles.less';
angular.module('capas',
    [
        'ng',
        require('./mw'),
        require('./menu'),
        require('./pages'),
        require('./1@async')
    ])
    .run(function ($rootScope: ng.IRootScopeService) {
        console.log($rootScope);
    })
    ;