import { Base } from "../../site/classes/base";
import { valueFn } from "../valueFn";

export function Cache(events: string[]) {
    return function (prototype: any, name: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = attach

        function attach(this: Base) {
            this[name] = createCache;
            events.forEach(attachEvent, this);
            return this[name].apply(this, arguments);
        }

        function attachEvent(this: Base, event: string) {
            this.on(event, reset);
        }

        function reset() {
            this[name] = createCache;
        }

        function createCache(this: Base) {
            const result = original.apply(this, arguments);
            this[name] = valueFn(result);
            return result;
        }
    }
}