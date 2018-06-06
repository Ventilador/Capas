import { exists, readDir, readFile, stats } from './things/functions';
import { resolve, basename } from 'path';
import defer from './utils/defer';
import { createReadStream, Stats } from 'fs';
import { put, concurrency, putFirst } from './utils/exampleGenerator/fsQueue';
concurrency(100);
function findInFiles(dir: string, content: string) {
    return finder(dir, content.toLowerCase(), []);
}

async function finder(path: string, content: string, found: string[]) {
    return secureStats(path)
        .then(stat => {
            if (stat.isFile()) {
                return processFile(path, stat, chunk => chunk.toLowerCase().indexOf(content) !== -1)
                    .then(containsContent => {
                        if (containsContent) {
                            found.push(path);
                        }
                        return found;
                    })
            } else {
                return secureReadDir(path)
                    .then(dirContent => {
                        return Promise.all(dirContent.map(cur => {
                            return finder(cur, content, found)
                        }));
                    })
                    .then(_ => found);
            }
        });
}

function secureReadDir(path) {
    const deferred = defer();
    return put(function () {
        return readDir(path)
            .then(deferred.resolve, deferred.reject);
    }, deferred.promise);
}

function secureStats(path) {
    const deferred = defer();
    return put(function () {
        return stats(path)
            .then(deferred.resolve, deferred.reject);
    }, deferred.promise);
}

function processFile(path, stat: Stats, matcher) {
    const deferred = defer();
    return putFirst(function () {
        let found = false;
        createReadStream(path, {
            start: 0,
            end: stat.size
        })
            .on('data', function (chunk: Buffer) {
                if (found = matcher(chunk.toString())) {
                    this.close();
                }
            })
            .on('error', deferred.reject)
            .on('close', function () {
                deferred.resolve(found);
            });
    }, deferred.promise);
}

function contains(context: string, toFind: string) {
    return context.indexOf(toFind) !== -1;
}

const dir = resolve(process.cwd(), 'files', process.argv[2]);
const toFind = process.argv[3];
findInFiles(dir, toFind)
    .then(matches => {
        console.log('found:', matches.slice(0, 10).map(_ => basename(_)), 'items');
        if (matches.length > 10) {
            console.log('There are', matches.length, 'results, showing 10');
        }
        process.exit(0);
    }, err => {
        console.error(err);
        process.exit(1);
    });
