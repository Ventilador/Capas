import { modeSelectorDirective } from './directive';
export default angular.module(nextModule(), [])
    .directive('modeSelector', modeSelectorDirective)
    .name;
