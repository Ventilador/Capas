



import * as fs from 'fs';
printFileContent(__filename);
function printFileContent(fileName: string) {
    readFile(fileName, function (result: string) {
        console.log(result);
        process.exit(0);
    });
}
function readFile(fileToRead: string, cb: Function) {
    fs.readFile(fileToRead, function (err: Error, result: Buffer) {
        if (err) {
            throw err;
        }
        cb(result.toString());
    });
}


