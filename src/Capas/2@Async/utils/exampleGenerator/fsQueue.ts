import defer from "../defer";

const queue = {
    length: 0,
    first: null,
    last: null,
    unshift: function (val: any) {
        if (!this.length) {
            this.first = this.last = {
                value: val,
                next: null
            }
        } else {
            this.last = (this.last.next = {
                value: val,
                next: null
            });
        }
        this.length++;
    },
    pop() {
        const val = this.first.value;
        this.first = this.first.next;
        this.length--;
        if (this.length < 1) {
            this.length = 0;
            this.first = this.last = null;
        }
        return val;
    }
};
(global as any).queue = queue;
(global as any).onDone = onDone;

let MAX = 100;
export function concurrency(amount) {
    MAX = amount;
}
let r = true ? undefined : defer();
let waiter: typeof r;
export function shouldWait() {
    if (waiter) {
        return waiter;
    }
    if (!queue.length) {
        return true;
    }
    return waiter = defer();
}

let working = 0;
export function put(cb, promise) {
    if (working < MAX) {
        proceessFn(cb);
    } else {
        queue.unshift(cb);
    }
    return promise.then(onDone, onError);
}


function proceessFn(cb) {
    working++;
    // console.log(queue.length);
    cb();
}


function onError(err) {
    working--;
    if (queue.length) {
        proceessFn(queue.pop());
    }
    if (!queue.length && waiter) {
        waiter.resolve();
        waiter = null;
    }
    throw err;
}

function onDone(val) {
    working--;
    if (queue.length) {
        proceessFn(queue.pop());
    }
    if (!queue.length && waiter) {
        waiter.resolve();
        waiter = null;
    }
    return val;
}