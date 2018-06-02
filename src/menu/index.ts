import './menu.styles.less';
import { menuDirective } from './menu.directive';
export = angular.module(nextModule(), [])
    .directive('menu', menuDirective)
    .name;
