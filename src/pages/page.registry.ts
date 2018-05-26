export function registry(): Pages.IRegistry {
    const currentState: Pages.IPageConfig[] = [];
    const listeners = [];
    const clear = [];
    let cur = 0;
    return {
        subscribe: function (scope: ng.IScope, depth: number, render: Function) {
            ensure(depth);
            scope.$on('$destroy', clear[depth]);
            listeners[depth] = render;
            if (currentState[depth]) {
                render(currentState[depth])
            }
        },
        emit: function (depth: number, config: Pages.IPageConfig) {
            ensure(depth);
            currentState[depth] = config;
            if (listeners[depth]) {
                listeners[depth](config);
            }
        }
    };
    function ensure(size: number) {
        if (size < cur) {
            return;
        }
        for (; cur !== size; cur = (listeners.push(null), currentState.push(null), clear.push(makeClear(cur))));
    }
    function makeClear(depth) {
        return function () {
            currentState[depth] = listeners[depth] = null;
        }
    }
}