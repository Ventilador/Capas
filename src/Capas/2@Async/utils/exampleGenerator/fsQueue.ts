
interface QueueItem {
    value: any;
    next: QueueItem;
}
export class Queue {
    public length = 0;
    private first: QueueItem;
    private last: QueueItem;
    private short: QueueItem;
    public put(val: any) {
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
    }
    public putFirst(val: any) {
        this.length++;
        this.short = {
            value: val,
            next: this.short
        }
    }
    public take() {
        this.length--;
        let val;
        if (this.short) {
            val = this.short.value;
            this.short = this.short.next;
            return val;
        } else {
            val = this.first.value;
            this.first = this.first.next;
        }
        if (this.length < 1) {
            this.length = 0;
            this.first = this.last = null;
        }
        return val;
    }
}
const queue = new Queue();

(global as any).queue = queue;
(global as any).onDone = onDone;
let MAX = 100;
export function concurrency(amount) {
    MAX = amount;
}
let working = 0;
export function put(cb, promise) {
    if (working < MAX) {
        proceessFn(cb);
    } else {
        queue.put(cb);
    }
    return promise.then(onDone, onError);
}

export function putFirst(cb, promise) {
    if (working < MAX) {
        proceessFn(cb);
    } else {
        queue.putFirst(cb);
    }
    return promise.then(onDone, onError);
}


function proceessFn(cb) {
    working++;
    // console.log(queue.length);
    setImmediate(cb);
}


function onError(err) {
    working--;
    if (queue.length) {
        proceessFn(queue.take());
    }
    throw err;
}

function onDone(val) {
    working--;
    if (queue.length) {
        proceessFn(queue.take());
    }
    return val;
}