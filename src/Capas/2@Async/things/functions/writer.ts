import { WriteStream, createWriteStream } from "fs";

export class Writer {
    private stream: WriteStream;
    constructor(fileName: string) {
        this.stream = createWriteStream(fileName, 'utf-8');
    }
    write(text: string) {
        this.stream.write(text);
    }
    done() {
        const stream = this.stream;
        this.stream = null;
        return new Promise((res, rej) => {
            stream
                .once('finish', res)
                .once('error', rej);
            stream.end();
        });
    }
}