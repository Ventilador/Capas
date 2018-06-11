
interface QueueItem {
    value: any;
    next: QueueItem;
}
export class Queue {
    public length = 0;
    private first: QueueItem;
    private last: QueueItem;
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
    public take() {
        if (this.first) {
            const val = this.first.value;
            this.first = this.first.next;
            this.length--;
            if (this.length < 1) {
                this.length = 0;
                this.first = this.last = null;
            }
            return val;
        }

    }
}
const fileQueue = new Queue();
const dirQueue = new Queue();
(global as any).queue = fileQueue;
(global as any).onDone = onDone;
let MAX = 100;
let MAX_DIR = 3;
export function concurrency(amount) {
    MAX = amount;
}
let working_files = 0;
let working_directories = 0;
export function putDir(cb, promise) {
    if (fileQueue.length < 10) {
        setImmediate(cb);
    } else {
        dirQueue.put(cb);
    }
    return promise;
}

export function putFile(cb, promise) {
    if (working_files < MAX) {
        proceessFn(cb);
    } else {
        fileQueue.put(cb);
    }
    return promise.then(onDone, onError);
}

function proceessFn(cb) {
    working_files++;
    setImmediate(cb);
}

function registerNextTick() {
    working_files--;
    if (fileQueue.length) {
        proceessFn(fileQueue.take());
    }
    if (fileQueue.length < 10 && dirQueue.length) {
        setImmediate(dirQueue.take());
    }
}


function onError(err) {
    registerNextTick();
    throw err;
}

function onDone(val) {
    registerNextTick();
    return val;
}