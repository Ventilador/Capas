
const value = doSomething();
console.log(value);
function doSomething() {
    return 'value';
}

doSomethingAsync()
    .then(function (value) {
        console.log(value);
    });


function doSomethingAsync() {
    return Promise.resolve('value');
}


doSomethingAsync()
    .then(value => console.log(value));
