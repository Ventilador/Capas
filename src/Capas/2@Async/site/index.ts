import router from 'angular-ui-router';
import regularModeModule from './regularMode';
import modeSelectorModule from './modeSelector';
import configRoutes from './config.routes';
export = angular.module('async-await', [router, regularModeModule, modeSelectorModule])
    .config(configRoutes)
    .name;
