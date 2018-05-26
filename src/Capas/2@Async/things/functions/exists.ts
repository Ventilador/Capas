import { stat, Stats } from 'fs';
import { promisify } from './../../utils/promisify'
export function exists(path): Promise<Stats> {
    return promisify(stat, path)
        .then(toTrue, toFalse);
}

function toTrue() {
    return true;
}
function toFalse() {
    return false;
}