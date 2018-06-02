import router from 'angular-ui-router';
import regularModeModule from './regularMode';
import modeSelectorModule from './modeSelector';
import configRoutes from './config.routes';
import { MainScope } from './classes/Base';
export = angular.module(nextModule(), [router, regularModeModule, modeSelectorModule])
    .config(configRoutes)
    .factory('mainScope', () => MainScope)
    .run(function ($rootScope: ng.IRootScopeService) {
        console.log($rootScope);
    })
    .decorator('$rootScope', function ($delegate) {
        console.log($delegate);
        return $delegate;
    })
    .name;
