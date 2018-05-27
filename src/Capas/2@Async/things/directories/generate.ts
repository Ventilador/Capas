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

const examples: IExample[] = [{
    name: 'example-1',
    depth: [1, 3],
    size: [3, 6],
    fileSize: [5, 20].map(kbToMb)
},
{
    name: 'example-2',
    depth: [1, 3],
    size: [3, 15],
    fileSize: [.3, .5].map(kbToMb).map(kbToMb)
},
{
    name: 'example-3',
    depth: [1, 3],
    size: [3, 6],
    fileSize: [250, 500].map(kbToMb).map(kbToMb)
}
];
const filesPath = resolve(__dirname, './../../../../../files');
Promise.all(examples.map(item => {
    return unlink(resolve(filesPath, item.name))
        .then(_ => generate(item));
}))
    .then(_ => process.exit(0));

function generateExamples() {
    return Promise.all(examples.map(generate));
}


function kbToMb(item) {
    return item * 1024;
}


function generate(item) {
    const path = resolve(filesPath, item.name);
    return mkdir(path).then(_ => generateFolder(path, item, 0));
}