import { mkdir } from "../../things/functions/mkdir";
import { random, flipCoin, generateName } from "../random";
import { generateFile } from "./generateFile";
import { resolve } from "path";
import { sleep } from "../Sleep";
import { putDir } from "./fsQueue";
import defer from "../defer";


let folders = 0;
export function generateFolder(path: string, options: IExample, depth: number) {
    path = resolve(path, generateName(false));
    return makeDirQueued(path)
        .then(function () {
            const maxDepth = options.depth[1];
            const force = depth < options.depth[0];
            const thingsToCreate = random(options.size[0], options.size[1]);
            const foldersPromisefn = [];
            const promises = [];
            if (!thingsToCreate) {
                console.log('wat');
            }
            if (depth < maxDepth && (force || flipCoin())) {
                for (let i = 0; i < thingsToCreate; i++) {
                    if (flipCoin()) {
                        promises.push(generateFile(path, options));
                    } else {
                        promises.push(generateFolder(path, options, depth + 1));
                    }
                }
            } else {
                for (let i = 0; i < thingsToCreate; i++) {
                    promises.push(generateFile(path, options));
                }
            }

            return Promise.all(promises)
            // .then(reduceFolders(foldersPromisefn));
        });
}

function makeDirQueued(path) {
    const deferred = defer();
    return putDir(function () {
        mkdir(path).then(deferred.resolve, deferred.resolve);
    }, deferred.promise);
}

function reduceFolders(arr: any[]) {
    return function () {
        return arr.reduce(function (prev, cur) {
            return prev.then(cur);
        }, Promise.resolve(null));
    }
}

function minusFolder() {
    folders--;
    console.log('Done folder:', folders);
}