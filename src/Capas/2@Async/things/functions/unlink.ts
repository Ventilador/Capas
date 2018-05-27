import { unlink as unlink_, rmdir } from 'fs';
import { stats } from './stats';
import { readDir } from './readDir';
import { promisify } from './../../utils/promisify'
import { resolve } from 'path';
export function unlink(path): Promise<void> {
    return stats(path)
        .catch(noop)
        .then(stat => {
            if (stat) {
                if (stat.isFile()) {
                    return promisify(unlink_, path);
                } else {
                    return readDir(path)
                        .then(loop)
                        .then(_ => promisify(rmdir, path));
                }
            }
        });
    function loop(dirs: string[]) {
        return Promise.all(dirs.map(item => unlink(resolve(path, item))));
    }
}

function noop() {
    return null;
}
