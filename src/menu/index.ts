import './menu.styles.less';
import { menuDirective } from './menu.directive';
export = angular.module('capas.menu', [])
    .directive('menu', menuDirective)
    .name;
