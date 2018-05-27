import 'jasmine';
import 'jasmine-core';
import { sleep as sleep_ } from './utils/Sleep';
import { CustomPromise } from './utils/Promise';
const sleep = sleep_ as (timeout: number) => Promise<void>;

describe('Async/Await', function () {

    describe('basics', () => {
        it('doesnt actually need a promise to work', async () => {
            const value = await null;
            expect(value).toBe(null);
        });
    });

    describe('basics', () => {
        it('doesnt actually need a promise to work 2', async () => {
            const otherValue = {};
            const value = await otherValue;
            expect(value).toBe(otherValue);
        });
    });

    describe('concurrency', () => {
        it('supports paralelism', async () => {
            const pre = Date.now();
            const values = await Promise.all([
                sleep(800).then(_ => 1),
                sleep(500).then(_ => 2),
                sleep(200).then(_ => 3)
            ]);
            expect(values).toEqual([1, 2, 3]);
            const now = Date.now() - pre;
            expect(now).toBeGreaterThanOrEqual(800);
            expect(now).toBeLessThanOrEqual(820);
        });
    });

    describe('serialization', () => {
        it('supports linear resolution', async () => {
            const pre = Date.now();
            const values = [
                await sleep(800).then(_ => 1),
                await sleep(500).then(_ => 2),
                await sleep(200).then(_ => 3)
            ];
            expect(values).toEqual([1, 2, 3]);
            const now = Date.now() - pre;
            expect(now).toBeGreaterThanOrEqual(1500);
            expect(now).toBeLessThanOrEqual(1520);
        });
    });

    describe('using it anywhere', () => {
        it('support await as parameter', async () => {
            const spy = jasmine.createSpy();
            spy(await sleep(20).then(_ => 1), await sleep(20).then(_ => 2), await sleep(20).then(_ => 3));
            expect(spy).toHaveBeenCalledWith(1, 2, 3);
        });
    });

    describe('using it anywhere', () => {
        it('support await in for condition', async () => {
            const pre = Date.now();
            const spy = jasmine.createSpy();
            for (let i = 0; i < await sleep(20).then(_ => 3); i++) {
                spy(i);
            }
            const now = Date.now() - pre;
            expect(spy.calls.count()).toBe(3);
            // it has to await 4 times, even though the loop is 3
            // the last time it checks and it doesn't enter the loop
            expect(now).toBeGreaterThanOrEqual(80);
            expect(now).toBeLessThanOrEqual(90);
        });
    });

    describe('using it anywhere', () => {
        it('support await in for next iteration', async () => {
            const pre = Date.now();
            const spy = jasmine.createSpy();
            for (let i = 0; i < 3; i = await sleep(20).then(_ => i + 1)) {
                spy(i);
            }
            const now = Date.now() - pre;
            expect(spy.calls.count()).toBe(3);
            // this time is called only three times
            expect(now).toBeGreaterThanOrEqual(60);
            expect(now).toBeLessThanOrEqual(70);
        });
    });
});