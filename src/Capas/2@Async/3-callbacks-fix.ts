



import * as fs from 'fs';
printFileContentSecure(__filename);
function printFileContentSecure(fileName: string) {
    readFile(fileName, function (err: Error, content: string) {
        if (err) {

            process.exit(1);
        }
        console.log(content);
        process.exit(0);
    });
}
function readFile(fileToRead: string, cb: any) {
    fs.stat(fileToRead, function (err: Error, stats: fs.Stats) {
        if (err) {
            cb(err);
        } else if (stats.isFile()) {
            fs.readFile(fileToRead, function (err: Error, content: Buffer) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, content.toString);
                }
            });
        } else {
            cb(new Error('Not a file'));
        }
    });
}


printFileContentSecureSync(__filename);
function printFileContentSecureSync(fileName: string) {
    try {
        console.log(readFileSync(fileName))
        process.exit(0);
    } catch{
        console.error(':(');
        process.exit(1);
    }
}
function readFileSync(fileName: string) {
    if (fs.statSync(fileName).isFile()) {
        return fs.readFileSync(fileName).toString();
    }
    throw new Error('Not a file');
}

