const menus = {
    stressTest: [{
        controller: 'stressTest',
        controllerAs: 'ctrl',
        templateUrl: 'async/stressTest',
        name: 'Stress Test'
    }]
}
module.exports = function configMenu(app) {
    app.get('/menu', menuService);

    function menuService(req, res, next) {
        const query = req.query;
        const menuId = query.id;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(menus[menuId]);
    };
}


