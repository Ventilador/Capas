import { stat, Stats } from 'fs';
import { promisify } from './../../utils/promisify'
export function stats(path): Promise<Stats> {
    return promisify(stat, path);
}