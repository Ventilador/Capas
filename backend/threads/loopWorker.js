const random = require('./random');

function work(valA, valB) {
    var text = [];
    for (let i = 0; i < valA; i++) {
        for (let j = 0; j < valB; j++) {
            if ((i % j) === 0) {
                text.push(String.fromCharCode((i * j) % 65535 /* max char value */ ));
            }
        }
    }
    return text.join('');
}
process.stdin.on('readable', function () {
    const value = process.stdin.read().toString();
    if (value === 'optimize') {
        optimizeCode();
        process.stdout.write(toBuffer('optimized'));
    } else {
        const text = value.split('|');
        work(+text[0] | 0, +text[1] | 0)
        process.stdout.write(toBuffer('a'));
    }
});

function toBuffer(result) {
    return new Buffer(result.toString());
}

// if (process.argv.length === 3) {
//     const id = process.argv[2];
//     const express = require('express');
//     const app = express();
//     let optimize = true;
//     app.get('', function (req, res) {
//         if (optimize) {
//             optimizeCode(res);
//             res.setHeader('Access-Control-Allow-Origin', '*');
//             res.status(200).json({
//                 result: 'optimized'
//             });
//             return optimize = false;
//         }

//         const text = req.originalUrl.split('|');
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.status(200).json({
//             result: work(+text[0] | 0, +text[1] | 0)
//         });
//     })
// } else {

// }


function optimizeCode(res) {
    for (let i = 0; i < 10000; i++) {
        work(random(250), random(250));
    }
}