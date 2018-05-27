declare namespace Pages {
    export interface IPageConfig {
        state: string;
        displayName: string
    }

}

interface Dictionary<T> {
    [key: string]: T;
    [key: number]: T;
}