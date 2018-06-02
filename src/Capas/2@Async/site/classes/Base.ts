import { IAngularEvent } from "angular";
const value = MainScope(null, null, null);
export type MainScope = typeof value;
export function MainScope($rootScope: ng.IRootScopeService, mousePosition: IPoint, getElmPosition: (elm: JQLite) => IPoint) {
    interface IEvent extends JQueryEventObject {
        currentScope: MainScopeClass;
    }
    const events = ['MouseOver', 'MouseOut', 'Click']
    class MainScopeClass extends (Object.getPrototypeOf($rootScope).constructor as new (...args: any[]) => ng.IRootScopeService) {
        public hover: string;
        public elm: JQLite;
        public $parent: MainScopeClass;
        public $root: MainScopeClass;
        public $id: number;
        public $$isolateBindings: any;
        public $$phase: any;
        constructor() {
            super();
            this.$on('$destroy', onDestroy);
        }
        $register(elm: JQLite) {
            this.elm = elm;
            events.reduce(attachEvent, elm.data('scope', this));;
        }
        $create(): MainScopeClass {
            return new MainScopeClass();
        }
        $forEach(cb: (cur: MainScopeClass) => void): void {

        }
        $onMouseOver() {

        }
        $onMouseOut() {

        }
        $onClick() {

        }
    }

    events.reduce((prev, cur) => {
        const key = '$on' + cur;
        prev[key + 'Proxy'] = new Function('ev', `
            const self = angular.element(ev.currentTarget).data('scope');
            return self.${key}.apply(self, arguments);
            `);
        return prev;
    }, MainScopeClass.prototype);

    function attachEvent(prev, cur) {
        const self = prev.data('scope');
        return prev.on(cur.toLowerCase(), self['$on' + cur + 'Proxy']);
    }
    const mainScope = new MainScopeClass();
    MainScopeClass.prototype.$root = mainScope;
    return mainScope;
    function onDestroy(ev: IAngularEvent) {
        const self = <MainScopeClass>ev.currentScope;
        events.forEach(removeEvent, self);
        self.elm.removeData('scope');
        self.elm = null;
    }
    function removeEvent(this: MainScopeClass, ev) {
        this.elm.off(ev);
    }

}