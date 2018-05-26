import { registry } from './page.registry';
import { pagesDirective } from './pages.directive';
export = angular.module('capas.pages', ['ngAnimate', 'ng'])
    .directive('pages', pagesDirective)
    .factory('registry', registry)
    .name;
