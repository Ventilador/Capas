let seed = ((Math.random() * 100000000000000) % 2147483647 | 0);
import NaturalNameGenerator = require('natural-filename-generator');
import { readFileSync } from 'fs';

export function random(mod: number)
export function random(min: number, max: number)
export function random(min: number, max?: number) {
    if (arguments.length === 1) {
        max = min;
        min = 0;
    }
    let result;
    do {
        result = (seed = seed * 16807 % 2147483647) % max;
    } while (result < min);
    return result;
}
export function flipCoin() {
    return !!(random(2) % 2);
}
const nameGenerator = new NaturalNameGenerator();
export function generateName(withExt) {
    return nameGenerator.generate(withExt ? 'txt' : '');
}

const text = readFileSync(process.cwd() + '\\lorem.txt', 'utf-8').split(/\r?\n/).filter(Boolean);
export function getLoremLine(amount?) {
    if (amount) {
        let arr = [];
        for (let i = 0; i < amount; i++) {
            arr.push(text[random(text.length)]);
        }
        return arr.join('\r\n');
    }
    return text[random(text.length)];
}


