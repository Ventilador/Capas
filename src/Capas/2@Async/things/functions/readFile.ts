import { stats } from './stats';
import { readFile as read_ } from 'fs';
import { promisify } from './../../utils/promisify';
import { valueFn } from '../../utils/valueFn';
export function readFile(file) {
    return stats(file)
        .then(ensureFile)
        .then(valueFn(file))
        .then(read);
}

function read(file: string) {
    return promisify(read_, file, 'utf8');;
}

function ensureFile(stat) {
    if (stat.isFile()) {
        return;
    }
    throw new Error('Not a file');
}



