import { exists } from './exists';
import { readdir } from 'fs';
import { resolve } from 'path';
import { promisify } from './../../utils/promisify';
import { valueFn } from '../../utils/valueFn';
import { stats } from '.';
export function readDir(dir: string): Promise<string[]> {
    return promisify(readdir, dir)
        .then(resolveTo(dir));
}


function resolveTo(dir) {
    return function (list: string[]) {
        return list.map(resolveFile, dir);
    }
}
function resolveFile(this: string, fileName: string) {
    return resolve(this, fileName);
}