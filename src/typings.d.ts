declare namespace Pages {
    export interface IPageConfig {
        template: string;
        controller: any;
        data: any;
        controllerAs: string;
    }
    export interface IRegistry {
        emit(depth: number, newConfig: IPageConfig);
        subscribe(scope: ng.IScope, depth: number, render: (config: IPageConfig) => void): void;
    }
}