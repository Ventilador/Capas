import {
    unlink
} from './../functions';
import {
    random
} from './../../utils/random';
import {
    generateFolder
} from './../../utils/exampleGenerator/generateFolder';
import { mkdir } from '../functions/mkdir';
import { resolve } from 'path';
import { sleep } from '../../utils/Sleep';

const examples: IExample[] = [{
    name: 'example-1',
    depth: [2, 4],
    size: [3, 6],
    fileSize: [5, 20].map(kbToMb)
},
{
    name: 'example-2',
    depth: [5, 7],
    size: [5, 15],
    hardText: 'lorem'
},
{
    name: 'example-3',
    depth: [2, 4],
    size: [3, 6],
    fileSize: [500, 800].map(kbToMb).map(kbToMb),
    streamed: true
}
];
const filesPath = resolve(__dirname, './../../../../../files');
const index = process.argv[2];
let promises;
if (process.argv.length === 3) {
    promises = [deleteFolder(examples[process.argv[2]])];
} else {
    promises = examples.map(deleteFolder);
}

Promise.all(promises)
    .then(generateExamples)
    .catch(err => {
        console.log(err);
    })
    .then(function () {
        process.exit(0);
    });
process.on('beforeExit', function () {
    console.log('exiting');
})
function deleteFolder(item) {
    return unlink(resolve(filesPath, item.name))
        .then(_ => (console.log('Deleted:', item.name), item));
}


function generateExamples(examples) {
    return examples.reduce((prev: Promise<any>, cur: IExample, index) => {
        if (prev) {
            return prev.then(function () {
                return generate(cur);
            });
        }
        return generate(cur);
    }, null as Promise<any>);
}


function kbToMb(item) {
    return item * 1024;
}


function generate(item) {
    const path = resolve(filesPath, item.name);
    return mkdir(path)
        .then(_ => generateFolder(path, item, 0))
        .then(_ => console.log('Generated:', item.name));
}