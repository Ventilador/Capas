import { unlink as unlink_, rmdir } from 'fs';
import { stats } from './stats';
import { readDir } from './readDir';
import { promisify } from './../../utils/promisify'
import { resolve } from 'path';
import * as rimraf from 'rimraf';
export function unlink(path): Promise<void> {
    return new Promise(function (res, rej) {
        rimraf(path, function (err) {
            if (err) {
                rej(err);
            } else {
                res();
            }
        })
    });
}

function noop() {
    return null;
}
