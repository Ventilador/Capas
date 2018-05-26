import { sleep } from './utils/Sleep';
setTimeout(async function () {
    try {
        console.log(await processVal());
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});
async function getValue() {
    await (sleep(500) as Promise<any>);
    return {
        success: true
    };
}
async function processVal() {
    const value = await getValue();
    if (value.success) {
        return 'Everything went fine';
    }
    throw 'Everybody panic!!!';
}


setTimeout(() => {
    return processValPromise()
        .then(val => (console.log(val), process.exit(0)))
        .catch(err => (console.error(err), process.exit(1)));
});

function getValuePromise() {
    return sleep(500)
        .then(_ => ({ success: true }));
}


function processValPromise() {
    return getValuePromise()
        .then(val => {
            if (val.success) {
                return 'Everything went fine';
            }
            throw 'Everybody panic!!!';
        });
}
