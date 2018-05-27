import 'jasmine';
import 'jasmine-core';
import { sleep } from './utils/Sleep';
import { CustomPromise } from './utils/Promise';
// declare var Promise: typeof Node.Promise & {};
interface Promise<T> {
    finally(onDone: () => void): Promise<T>;
}
describe('Promises', function () {

    it('pipes through returned values', function (done: Function) {
        const value = {};
        Promise.resolve(value)
            .then((val => val))
            .then(function (val) {
                expect(val).toBe(value);
                done();
            });
    });

    it('pipes through returned promises', function (done: Function) {
        const value = {};
        Promise.resolve(value)
            .then((val => Promise.resolve(val)))
            .then(function (val) {
                expect(val).toBe(value);
                done();
            });
    });

    it('supports error handling', function (done: Function) {
        Promise.resolve()
            .then((_ => { throw 'Error' }))
            .catch((err) => {
                expect(err).toBe('Error');
                done();
            });
    });

    it('doesnt support finally', function () {
        expect(() => {
            (Promise.resolve() as any).finally();
        }).toThrow();
    });

    describe('catch', function () {
        it('continues the pipe', function (done: Function) {
            const value = {};
            Promise.resolve()
                .then((_ => { throw 'Error' }))
                .catch(err => value)
                .then((val) => {
                    expect(val).toBe(value);
                    done();
                });
        });
    });

    describe('catch', function () {
        it('jumps if rethrow', function (done: Function) {
            const thenSpy = jasmine.createSpy();
            Promise.resolve()
                .then((_ => { throw 'Error' }))
                .catch(err => { throw err })
                .then(thenSpy)
                .catch((err) => {
                    expect(err).toBe('Error');
                    expect(thenSpy).not.toHaveBeenCalled();
                    done();
                });;
        });
    });

    describe('finally implementation', function () {
        const Promise = CustomPromise;
        it('pipes through then', function (done) {
            const spy = jasmine.createSpy();
            Promise.resolve('Something')
                .finally(spy)
                .then((value) => {
                    expect(value).toBe('Something');
                    expect(spy).toHaveBeenCalled();
                    done();
                });
        });
    });

    describe('finally implementation', function () {
        const Promise = CustomPromise;
        it('pipes through catch', function (done) {
            const spy = jasmine.createSpy();
            Promise.resolve('Something')
                .then(val => { throw val; })
                .finally(spy)
                .catch((value) => {
                    expect(value).toBe('Something');
                    expect(spy).toHaveBeenCalled();
                    done();
                });
        });
    });

    describe('all', function () {
        const Promise = CustomPromise;
        it('waits till all resolve', function (done) {
            Promise
                .all([
                    sleep(800).then(_ => 1),
                    sleep(500).then(_ => 2),
                    sleep(200).then(_ => 3)
                ])
                .then((values: any) => {
                    expect(values).toEqual([1, 2, 3]);
                    done();
                });
        });
    });


    describe('all', function () {
        const Promise = CustomPromise;
        it('fails on first fail', function (done) {
            const spy = jasmine.createSpy();
            const time = Date.now();
            Promise
                .all([
                    sleep(200).then(_ => { throw 'Error'; }),
                    sleep(500).then(_ => 2),
                    sleep(800).then(_ => 3)
                ])
                .then(spy)
                .catch(function (err) {
                    expect(spy).not.toHaveBeenCalled();
                    expect(err).toBe('Error');
                    const now = Date.now() - time;
                    expect(now).toBeLessThan(300);
                    expect(now).toBeGreaterThan(100);
                    done();
                });
        });
    });

    describe('all', function () {
        const Promise = CustomPromise;
        it('implementation', function (done) {
            const arr = []; // temp array to return
            function push(val) {
                arr.push(val); // push to the array the value
                return arr; // return the array, so the tailing promise returns it
            }
            const all = [
                sleep(800).then(_ => 1),
                sleep(500).then(_ => 2),
                sleep(200).then(_ => 3)
            ].reduce((prev, cur) => {
                return prev // keep track of promise order by using lastProm.then
                    .then(_ => cur) // queue cur promise
                    .then(push); // add result to array
            }, Promise.resolve(undefined));

            all.then((values: any) => {
                expect(values).toEqual([1, 2, 3]);
                done();
            });

        });
    });

    describe('all', function () {
        const Promise = CustomPromise;
        it('fails on first fail', function (done) {
            const spy = jasmine.createSpy();
            const time = Date.now();
            const arr = []; // temp array to return
            function push(val) {
                arr.push(val); // push to the array the value
                return arr; // return the array, so the tailing promise returns it
            }
            const all = [
                sleep(200).then(_ => { throw 'Error'; }),
                sleep(500).then(_ => 2),
                sleep(800).then(_ => 3)
            ].reduce((prev, cur) => {
                return prev // keep track of promise order by using lastProm.then
                    .then(_ => cur) // queue cur promise
                    .then(push); // add result to array
            }, Promise.resolve(undefined));
            all.then(spy)
                .catch(function (err) {
                    expect(spy).not.toHaveBeenCalled();
                    expect(err).toBe('Error');
                    const now = Date.now() - time;
                    expect(now).toBeLessThan(300);
                    expect(now).toBeGreaterThan(100);
                    done();
                });
        });
    });

    describe('race', function () {
        it('resolves the first one that resolve', function (done) {
            const spy = jasmine.createSpy();
            Promise.race([
                sleep(800).then(_ => 1),
                sleep(500).then(_ => 2),
                sleep(200).then(_ => 3)
            ]).then((value: any) => {
                expect(value).toBe(3);
            })
                .then(spy);
            sleep(1000).then(() => {
                expect(spy.calls.count()).toBe(1);
                done();
            });
        });
    });

    describe('race', function () {
        it('implementation', function (done) {
            const spy = jasmine.createSpy();
            race([
                sleep(800).then(_ => 1),
                sleep(500).then(_ => 2),
                sleep(200).then(_ => 3)
            ]).then((value) => {
                expect(value).toBe(3);
            })
                .then(spy);
            sleep(1000).then(() => {
                expect(spy.calls.count()).toBe(1);
                done();
            });

            function race(promises) {
                return new Promise(function (res, rej) {
                    let resolved = false;
                    promises.forEach(function (prom) {
                        prom.then(resolve.bind(null, null), resolve);
                    });
                    function resolve(err, result) {
                        if (resolved) {
                            return;
                        }
                        if (err) {
                            rej(err);
                        } else {
                            res(result);
                        }
                        resolved = true;
                    }
                });
            }
        });
    });

    describe('race', function () {
        it('implementation - sketchy', function (done) {
            const spy = jasmine.createSpy();
            race([
                sleep(800).then(_ => 1),
                sleep(500).then(_ => 2),
                sleep(200).then(_ => 3)
            ]).then((value) => {
                expect(value).toBe(3);
            })
                .then(spy);
            sleep(1000).then(() => {
                expect(spy.calls.count()).toBe(1);
                done();
            });
            function race(promises) {
                return new Promise(function (res, rej) {
                    promises.forEach(function (prom) {
                        prom.then(res, rej);
                    });
                });
            }
        });
    });

});