import * as fs from 'fs';
const readDir = null, readFile = null, stats = null;
declare var inline: boolean;
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
        /*inline*/
        for (let i = 0; i < dirContent.length; i++) {
            await finder(dirContent[i], content, founds);
        }
        /*paralelo*/
        await Promise.all(dirContent.map(async function (cur) {
            return await finder(cur, content, founds);
        }));
        /*reduce*/
        await dirContent.reduce(async (prev: any, cur) => (await prev, finder(cur, content, founds)), null);
    }
    return founds;
}




function contains(context: string, toFind: string) {
    return context.indexOf(toFind) !== -1;
}


export = null;