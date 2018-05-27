import { modeSelectorDirective } from './directive';
export default angular.module('modeSelector', [])
    .directive('modeSelector', modeSelectorDirective)
    .name;
