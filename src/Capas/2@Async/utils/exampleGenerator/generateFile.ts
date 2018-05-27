import { random, getLoremLine, generateName } from "../random";
import { Writer } from "../../things/functions/writer";
import { resolve } from "path";


export function generateFile(path: string, options: IExample) {
    const fileLines = random(options.fileSize[0], options.fileSize[1]);
    const writer = new Writer(resolve(path, generateName(true)));
    let writen = 0;
    while (writen < fileLines) {
        const text = getLoremLine();
        writen += text.length;
        writer.write(text);
        writer.write('\r\n');
    }
    return writer.done();
}
