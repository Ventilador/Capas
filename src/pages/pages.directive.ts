export function pagesDirective(registry: Pages.IRegistry, $animate: ng.animate.IAnimateService, $compile: ng.ICompileService, $controller: ng.IControllerService) {
    return {
        scope: {},
        link: function (scope: ng.IScope, elm: JQLite, attrs: ng.IAttributes) {
            const depth = scope.$emit('page-depth')['depth'] || 0;
            scope.$on('page-depth', function (ev: ng.IAngularEvent) {
                ev.stopPropagation();
                ev['depth'] = depth + 1;
            });
            registry.subscribe(scope, depth, render);
            let lastScope: ng.IScope = null, lastElement: JQuery = null, promise: ng.IPromise<any>;
            let promiseCount = 0;
            function render(config: Pages.IPageConfig) {
                if (lastScope) {
                    promiseCount++;
                    promise = promise ? promise.then(makeLeave(lastElement, lastScope)) : leave(lastElement, lastScope);
                    promise.finally(reduceCount);
                    lastScope = null;
                    lastElement = null;
                }
                if (!config) {
                    return;
                }
                lastScope = scope.$new(true);
                lastElement = angular.element(config.template) as JQuery;
                const link = $compile(config.template);
                const controller = $controller(config.controller, {
                    $scope: lastScope,
                    $data: config.data
                });
                lastElement = link(lastScope);
                lastScope[config.controllerAs || '$ctrl'] = controller;
                promise = promise ? promise.then(makeEnter(lastElement)) : enter(lastElement);
            }
            function reduceCount() {
                promiseCount--;
                if (!promiseCount) {
                    promise = null;
                }
            }
            function enter(jq: JQuery) {
                return $animate.enter(jq, elm);
            }
            function makeEnter(jq: JQuery) {
                return function () {
                    return enter(jq);
                }
            }
            function leave(lastElement: JQuery, scope: ng.IScope) {
                scope.$destroy();
                return $animate.leave(lastElement);
            }
            function makeLeave(lastElement, scope: ng.IScope) {
                return function () {
                    return leave(lastElement, scope);
                }
            }
        }
    };
}