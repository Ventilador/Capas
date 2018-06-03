import { random, getLoremLine, generateName } from "../random";
import { Writer } from "../../things/functions/writer";
import { resolve } from "path";
import { put } from "./fsQueue";
import defer from "../defer";
import { writeFile, createWriteStream } from "fs";



export function generateFile(path: string, options: IExample) {
    path = resolve(path, generateName(true));
    const deferred = defer();
    if (options.mode === 'streamed') {
        return put(
            writeStream(path, options, deferred.resolve, deferred.reject),
            deferred.promise);
    }
    return put(
        generateText(path, options, deferred.resolve, deferred.reject),
        deferred.promise);
}

function writeStream(path: string, options: IExample, res, rej) {
    return function () {
        const stream = createWriteStream(path, 'utf-8');
        stream.on('finish', res)
            .on('error', rej);
        const fileLines = random(options.fileSize[0], options.fileSize[1]);
        let writen = 0;
        return workStream();
        function workStream() {
            if (writen < fileLines) {
                const randomText = getLoremLine(100);
                stream.write(randomText);
                writen += randomText.length;
                setImmediate(workStream);
            } else {
                stream.end();
            }
        }
    }
}



function generateText(path: string, options: IExample, res, rej) {
    return function () {
        const text = [];
        if (!options.fileSize && options.hardText) {
            text.push(options.hardText);
        } else {
            const fileLines = random(options.fileSize[0], options.fileSize[1]);
            let writen = 0;
            while (writen < fileLines) {
                const randomText = getLoremLine();
                writen += randomText.length;
                text.push(randomText);
            }
        }
        writeFile(path, text.join('\r\n'), function (err) {
            if (err) {
                rej(err);
            } else {
                res();
            }
        })
    }
}
