declare namespace Pages {
    export interface IPageConfig {
        state: string;
        displayName: string
    }

}
declare var nextModule: () => string;

interface IPoint {
    readonly x: number;
    readonly y: number;
}

interface Dictionary<T> {
    [key: string]: T;
    [key: number]: T;
}