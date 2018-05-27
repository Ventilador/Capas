import { WriteStream, createWriteStream } from "fs";

export class Writer {
    private stream: WriteStream;
    private res;
    private rej;
    constructor(private fileName: string) {
        this.stream = createWriteStream(fileName, 'utf-8');
    }
    write(text: string) {
        this.stream.write(text);
    }
    start() {
        if (!this.res || !this.rej) {
            throw 'Promise not initialized';
        }
        this.stream = createWriteStream(this.fileName, 'utf-8');
        this.stream
            .once('finish', this.res)
            .once('error', this.rej);
    }
    end() {
        this.stream.end();
        this.stream = null;
    }
    done() {
        return new Promise((res, rej) => {
            this.res = res;
            this.rej = rej;
        });
    }
}