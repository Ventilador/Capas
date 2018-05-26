import { exists, readDir, readFile, stats } from './things/functions';

export function findInFiles(dir: string, content: string) {
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
        await Promise.all(dirContent.map(async function (cur) {
            return await finder(cur, content, founds);
        }));
    }
    return founds;
}

function contains(context: string, toFind: string) {
    return context.indexOf(toFind) !== -1;
}