import { CustomPromise } from './Promise';
const Promise = CustomPromise;
export function sleep(timeOut: number): CustomPromise<any> {
    return new CustomPromise<any>(function (res) {
        setTimeout(res, timeOut);
    });
}













