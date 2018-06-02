import { menuGetter } from './menu';
import { resolvers } from './resolvers'
export = angular.module(nextModule(), [])
    .config(function ($provide: ng.auto.IProvideService) {
        const resolvers_ = resolvers(valueFn);
        $provide.factory('mw', function ($injector: ng.auto.IInjectorService) {
            return {
                getMenu: $injector.invoke(menuGetter)
            }
        });
        $provide.factory('valueFn', valueFn(valueFn));
        $provide.factory('resolve', resolvers_.resolve);
        $provide.factory('reject', resolvers_.reject);
    })
    .name;
function valueFn(val: any) {
    return function () {
        return val;
    }
}
