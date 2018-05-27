
export function menuDirective() {
    return {
        template: require('./menu.template.html'),
        scope: {},
        controller: menuController,
        controllerAs: 'ctrl'
    };
}
class menuController {
    menuItems: Pages.IPageConfig[] = [
        {
            state: 'mode-selector',
            displayName: 'Async/Await'
        }
    ];
    constructor(private $state: ng.ui.IStateService) { }
    goTo(menuItem: Pages.IPageConfig): void {
        this.$state.go(menuItem.state);
    }
}