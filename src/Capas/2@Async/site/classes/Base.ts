import { Cache } from './../../utils/Decorators/cache';
export function BaseFactory($rootScope: ng.IRootScopeService) {
    Base.prototype['_rootScope'] = $rootScope;
    Base.prototype['_notifying'] = {};
    Base.prototype['_constructors'] = {};
    return Base;
}
export enum Faces {
    UP, DOWN, LEFT, RIGHT
}
export interface IState {
    facing: Faces;
    depth: number;
    items: Base[];
    states: IState[];
    selected: number;
}
export class Base {
    static readonly STRUTUCTURE_CHANGED = 'strucuture';
    static readonly STYLES_CHANGED = 'styles';
    public parent: Base;
    public nextSibling: Base;
    public prevSibling: Base;
    public firstChild: Base;
    public lastChild: Base;
    public root: Base;

    private _rootScope: ng.IRootScopeService;
    private _listeners: Dictionary<Function[]>;
    private _notifying: Dictionary<boolean>;
    private _constructors: Dictionary<new (data: { parent: Base, next: Base, prev: Base }) => Base>;
    constructor(data: { parent: Base, next: Base, prev: Base }) {
        const { parent, next, prev } = data;
        this._listeners = {};
        this.parent = parent;
        this.root = this.parent && this.parent.root || this;
        this.firstChild = this.lastChild = null;
        this.nextSibling = next;
        this.prevSibling = prev;
        this.notify(Base.STRUTUCTURE_CHANGED);
    }

    notify(name: string): void {
        if (this._notifying[name]) {
            return;
        }
        this._notifying[name] = true;
        setTimeout(() => {
            let target = this.root,
                current = target,
                next = target;
            this._notifying[name] = false;
            while ((current = next)) {
                const listeners = current._listeners[name];
                if (listeners && listeners.length) {
                    listeners.forEach(callCb, current);
                }
                if (!(next = (current.firstChild ||
                    (current !== target && current.nextSibling)))) {
                    while (current !== target && !(next = current.nextSibling)) {
                        current = current.parent;
                    }
                }
            }
            this._rootScope.$apply();
        });

    };

    getStyles(dif: Base) {
        return null;
    }

    on(event: string, cb): Function {
        const array = this._listeners[event] || (this._listeners[event] = []);
        array.push(cb);
        return function () {
            const index = array.indexOf(cb);
            if (index !== -1) {
                array.splice(index, 1);
            }
        }
    }

    @Cache([Base.STRUTUCTURE_CHANGED])
    getChildren(): Base[] {
        const results = [];
        let cur = this.firstChild;
        if (cur) {
            do {
                results.push(cur);
            } while (cur = cur.nextSibling);
        }
        return results;
    };

    protected createChildNextTo(node: Base, type: any): Base {
        let created: Base;
        if (!node || node === this.lastChild) {
            created = this.appendChild(type);
        } else {
            created = node.nextSibling = new (this._constructors[type])({
                parent: this,
                next: node.nextSibling,
                prev: node
            });
        }
        return created;
    };
    protected appendChild(type: any): Base {
        let created: Base;
        if (!this.firstChild) {
            created = this.firstChild = this.lastChild = new (this._constructors[type])({
                parent: this,
                next: null,
                prev: null
            });
        } else {
            created = this.lastChild = this.lastChild.nextSibling = new (this._constructors[type])({
                parent: this,
                next: null,
                prev: this.lastChild
            });
        }
        return created;
    };
    protected prependChild(type: any): Base {
        let created: Base;
        if (!this.firstChild) {
            created = this.appendChild(type);
        } else {
            created = this.firstChild = this.firstChild.prevSibling = (new (this._constructors[type])({
                parent: this,
                next: this.firstChild,
                prev: null
            }));
        }
        return created;
    };



}


function getParentPath(child: Base, parent: Base, depth: number): Base[] {
    if (child === parent) {
        return [];
    }
    const result = [];
    let cur = child;
    while (cur = (cur as any)._parent) {
        result.push(cur);
        if (cur === parent) {
            return result;
        }
    }
    return [];
}

function callCb(cb) {
    try { cb.call(this); } catch{ }
}

