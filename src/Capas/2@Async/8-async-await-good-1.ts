



import * as fs from 'fs';
declare var readDir: (dirName: string) => Promise<string[]>;
declare var readFile: (dirName: string) => Promise<string>;
declare var stats: (dirName: string) => Promise<fs.Stats>;




function findInFiles(dir: string, content: string): Promise<string[]> {
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
        await dirContent.forEach(async (somePath) => {
            await finder(somePath, content, founds);
        });
    }
    return founds;
}
export = null;



