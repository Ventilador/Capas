import { exists } from "./exists";
import { promisify } from "../../utils/promisify";
import { mkdir as mkdir_ } from "fs";

export function mkdir(path) {
    return promisify(mkdir_, path);
}