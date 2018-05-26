
export function menuDirective() {
    return {
        template: require('./menu.template.html'),
        scope: {},
        controller: menuController,
        controllerAs: 'ctrl'
    };
}
class menuController {
    menuItems: Pages.IPageConfig[];
    constructor($attrs: any, mw: any, private registry: Pages.IRegistry, $templateCache: ng.ITemplateCacheService) {
        mw.getMenu($attrs.menu).then((menuItems) => {
            (this.menuItems = menuItems).forEach(function (item) {
                item.template = $templateCache.get(item.templateUrl);
            });
        });
    }
    goTo(menuItem: any): void {
        this.registry.emit(0, menuItem);
    }
}