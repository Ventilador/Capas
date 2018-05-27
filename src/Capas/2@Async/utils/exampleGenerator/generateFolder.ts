import { mkdir } from "../../things/functions/mkdir";
import { random, flipCoin, generateName } from "../random";
import { generateFile } from "./generateFile";
import { resolve } from "path";

export function generateFolder(path: string, options: IExample, depth: number) {
    path = resolve(path, generateName(false));
    return mkdir(path)
        .then(function () {
            const maxDepth = options.depth[1];
            const force = depth < options.depth[0];
            const thingsToCreate = random(options.size[0], options.size[1]);
            const promises = [];
            if (depth < maxDepth && (force || flipCoin())) {
                if (!thingsToCreate) {
                    console.log('what');
                }
                for (let i = 0; i < thingsToCreate; i++) {
                    if (flipCoin()) {
                        promises.push(generateFile(path, options));
                    } else {
                        promises.push(generateFolder(path, options, depth + 1));
                    }
                }

            } else {
                for (let i = 0; i < thingsToCreate; i++) {
                    promises.push(generateFile(path, options));
                }
            }
            return Promise.all(promises);
        });
}