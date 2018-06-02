import { exists, readDir, readFile, stats } from './things/functions';
import { resolve, basename } from 'path';

function findInFiles(dir: string, content: string) {
    return finder(dir, content.toLowerCase(), []);
}

async function finder(path: string, content: string, found: string[]) {
    const stat = await stats(path);
    if (stat.isFile()) {
        const text = await readFile(path);
        if (text.includes(content)) {
            found.push(path);
        }
    } else {
        const dirContent = await readDir(path);
        await Promise.all(dirContent.map(cur => {
            return finder(cur, content, found);
        }));
    }
    return found;
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
