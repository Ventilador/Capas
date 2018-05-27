



import * as fs from 'fs';
printFileContent(__filename);
function printFileContent(fileName: string) {
    try {
        readFile(fileName, function (result: string) {
            console.log(result);
            process.exit(0);
        });
    } catch  {
        console.error(':(');
        process.exit(1);
    }
}
function readFile(fileToRead: string, cb: Function) {
    fs.stat(fileToRead, function (err: Error, stats: fs.Stats) {
        if (err) {
            throw err;
        } else if (stats.isFile()) {
            fs.readFile(fileToRead, function (err: Error, result: Buffer) {
                if (err) {
                    throw err;
                }
                cb(result.toString());
            });
        } else {
            throw new Error('Not a file')
        }
    });
}


