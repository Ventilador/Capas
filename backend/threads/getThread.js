const childProcess = require('child_process');
const {
    join
} = require('path');
const threads = [
    null, null, null, null, null,
    null, null, null, null, null,
    null, null, null, null, null,
    null, null, null, null, null
];

module.exports = function () {
    if (arguments.length === 0) {
        const id = threads.indexOf(null);
        const child = childProcess.fork(join(__dirname, './loopWorker.js'), [], {
            silent: true,
            execArgv: []
        });
        const thread = threads[id] = {
            id: id,
            kill: killThis,
            placeholder: null,
            process: child,
            optimize: optimizeProto
        }
        thread.process.stdout.on('readable', makeListener(thread));
        return thread;
    }
}

function optimizeProto(cb) {
    optimize(this, cb);
}

function send(thread, val, cb) {
    if (typeof thread === 'string') {
        thread = threads[thread];
    }
    if (thread) {
        if (thread.placeholder) {
            cb(new Error('Thread in use'));
            return;
        }
        thread.placeholder = cb;
        thread.process.stdin.write(new Buffer(val));
        return thread;
    } else {
        cb(new Error('Thread not found'));
    }
}


function optimize(thread, cb) {
    send(thread, 'optimize', cb)
}

function tick(thread, val, cb) {
    send(thread, val + '|' + val, function (err) {
        if (err) {
            cb(err);
        } else {
            cb(null, toMs(process.hrtime(curTime)));
        }
    });
    let curTime = process.hrtime();
    return thread;
}

function makeListener(context) {
    return function () {
        const cb = context.placeholder
        context.placeholder = null;
        cb(null, this.read());
    }
}


module.exports.calibrate = function (done) {
    const child = optimize(this(), function () {
        Function('return this')().child = child;
        tick(child, current, calibrate);
    });
    let values = [];
    const expected = [5, 20, 50];
    const testSize = 25;
    const step = 50;
    const results = [0, 0, 0];

    let current = 100,
        iteration = 0;

    function calibrate(error, result) {
        if (error) {
            done(error);
            return;
        }
        values.push(result);
        if (values.length === testSize) {
            const mid = values.reduce(sum, 0) / values.length;
            values = [];
            if (mid > expected[iteration]) {
                console.log('found iteration:', iteration, 'current:', current);
                results[iteration] = current;
                iteration++;
                if (iteration === results.length) {
                    child.kill();
                    return done(null, results);
                }
            }
            current += step;
        }
        tick(child, current, calibrate);
    }
}

function toMs(hr) {
    return ((hr[0] * 1e9) + hr[1] / 1e6);
}

function sum(prev, cur) {
    return prev + cur;
}

function killThis() {
    this.process.kill();
    threads[this.id] = null;
}

function getExecArgv() {
    let execArgv = [];
    for (let _i = 0, _a = process.execArgv; _i < _a.length; _i++) {
        let arg = _a[_i];
        let match = /^--(inspect)(=(\d+))?$/.exec(arg);
        if (match) {
            let currentPort = match[3] !== undefined ? +match[3] : match[1] === 'debug' ? 5858 : 9229;
            execArgv.push('--' + match[1] + '=' + (currentPort + 1));
        } else {
            execArgv.push(arg);
        }
    }

    return execArgv;
}