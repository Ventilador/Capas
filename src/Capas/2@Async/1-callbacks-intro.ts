
const value = doSomething();
console.log(value);

doSomethingAsync(function (value) {
    console.log(value);
});

function doSomethingAsync(cb) {
    setTimeout(cb, 0, 'value');
}

function doSomething() {
    return 'value';
}


export = null;