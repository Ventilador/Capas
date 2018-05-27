import { exists, readDir, readFile, stats } from './things/functions';
import { resolve } from 'path';

function findInFiles(dir: string, content: string) {
    return finder(dir, content, []);
}

async function finder(path: string, content: string, founds: string[]) {
    const stat = await stats(path);
    if (stat.isFile()) {
        const text = await readFile(path);
        if (text.includes(content)) {
            founds.push(path);
        }
    } else {
        const dirContent = await readDir(path);
        for (let i = 0; i < dirContent.length; i++) {
            await finder(dirContent[i], content, founds);
        }
    }
    return founds;
}

function contains(context: string, toFind: string) {
    return context.indexOf(toFind) !== -1;
}

const dir = resolve(process.cwd(), 'files', process.argv[2]);
const toFind = process.argv[3];
findInFiles(dir, toFind)
    .then(matches => {
        console.log('found:', matches);
        process.exit(0);
    }, err => {
        console.error(err);
        process.exit(1);
    });
