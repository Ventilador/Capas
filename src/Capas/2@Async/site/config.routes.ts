/*@ngInject*/
function routerMainConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider
        .state('mode-selector', {
            template: '<mode-selector></mode-selector>'
        });
}

export default routerMainConfig;