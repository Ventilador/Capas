import { exists } from './exists';
import { readdir } from 'fs';
import { resolve } from 'path';
import { promisify } from './../../utils/promisify';
import { valueFn } from '../../utils/valueFn';
export function readDir(dir: string) {
    return exists(dir)
        .then(ensureDir)
        .then(valueFn(dir))
        .then(read)
        .then(resolveTo(dir));
}

function read(dir) {
    return promisify(readdir, dir);
}

function ensureDir(stat) {
    if (stat.isFile()) {
        throw new Error('Is a file');
    }
}

function resolveTo(dir) {
    return function (list: string[]) {
        return list.map(resolveFile, dir);
    }
}
function resolveFile(this: string, fileName: string) {
    return resolve(this, fileName);
}