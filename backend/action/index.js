const actions = {
    bothLong: [{
        action: 'loop',
        args: [100, 100],
        next: 'both long-1'
    }]
};
loop(11, function (item) {
    if (item === 10) {
        actions.bothLong.push(function () {

        });
        return;
    }
    actions.bothLong.push(function (res) {
        setTimeout(function () {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json({
                action: 'loop',
                args: [100, 100],
                next: 'both long-' + (item + 1)
            });
        }, 1000);
    });
});

function loop(times, cb) {
    for (let i = 0; i < times; i++) {
        cb(i);
    }
}
const map = {
    'both long': 'bothLong-0'
}


const regExp = /(\w+)(?:\-(\d+))?/
module.exports = function next(req, res, next) {
    const query = req.query;
    const result = regExp.exec(map[query.id] || query.id);
    const actionName = result[1];
    const item = result[2] || 0;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(actions[actionName][item]);
}