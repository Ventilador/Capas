import { stats } from './stats';
import { readFile as read_ } from 'fs';
import { promisify } from './../../utils/promisify';
import { valueFn } from '../../utils/valueFn';
export function readFile(file) {
    return promisify(read_, file, 'utf8');
}



