import { Base } from "../classes/Base";
import { valueFn } from "../../utils/valueFn";

export function MainDirective() {
    return {
        controller: MainController,
        controllerAs: 'ctrl',
        template: '',
        scope: {}
    }
}

interface IItem {
    scope: any;
    elm: JQLite;
    node: Base;
}

function MainController($scope: ng.IScope, $element: JQLite, $attrs: any, $animate: ng.animate.IAnimateService, $compile: ng.ICompileService, $q: ng.IQService) {
    const scope = $scope;
    const elm = $element;
    const q = $q;
    const config: Base = scope.$parent.$eval($attrs.regularMode);
    const list = scope['list'] = [] as IItem[];
    let cur = config;
    this.getCurrent = function () {
        return cur;
    }
    scope['toParent'] = toParent;
    let toAppend, toRemove;
    function toParent() {
        let array = [];
        if (cur.parent && cur.parent.parent) {
            array = cur.parent.parent.getChildren();
        } else {
            return array;
        }
        cur = cur.parent;
        array.forEach(appendElement);
    }

    function tick() {
        toAppend = [];
        toRemove = [];
        list.forEach(processItem);
        q.resolve(toAppend)
            .then(doEnter)
            .then(doUpdate)
            .then(valueFn(toRemove))
            .then(doRemove);
        toRemove = toAppend = null;
    }

    function doRemove(items: IItem[]) {
        return q.all(items.map(leave));
    }

    function doUpdate() {
        return q.all(list.map(update));
    }

    function update(item: IItem) {
        return $animate.animate(item.elm, null, item.node.getStyles(cur));
    }



    function doEnter(items: IItem[]) {
        return q.all(items.map(enter));
    }

    function leave(item: IItem) {
        return $animate.leave(item.elm);
    }

    function enter(item: IItem) {
        return $animate.enter(item.elm, elm);
    }

    function processItem(item: IItem) {
        if (!item.scope) {
            item.scope = scope.$new();
            item.scope.node = item.node;
            item.elm = $compile('<box></box>')(item.scope);
            item.scope.$on('$destroy', removeFromEvent)
            toAppend.push(item.elm);
        }

        if (item.scope.$$destroyed) {
            toRemove.push(elm);
        } else {
            item.scope.update();
        }

    }

    function removeFromEvent(ev: ng.IAngularEvent) {
        remove((<any>ev).targetScope.node);
    }

    function remove(item: Base) {
        const index = list.findIndex(byNode, item);
        if (index !== -1) {
            const listItem = list[index];
            list.splice(index, 1);
            listItem.scope.$destroy();
            listItem.scope.$$destroyed = true;
        }
    }


    function enableParent() {
        return !!cur.parent;
    }

    function appendElement(item) {
        if (notInList(item)) {
            list.push({
                node: item,
                elm: null,
                scope: null
            });
        }
    }

    function notInList(item) {
        return !list.find(byNode, item);
    }

    function byNode(item) {
        return item === this.node;
    }
}