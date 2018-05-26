const getThread = require('./getThread');
module.exports = function configThreads(app) {
    getThread.calibrate(function (error, result) {
        if (error) {
            console.error(error.toString());
            process.exit(1);
        } else {
            app.get('/thread', createThread);
            app.get('/thread/calibrations', function (_, res) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).json(result);
            });
            app.post('/thread/:threadId/optimize', optimizeThread)
            app.post('/thread/:threadId', runThread);
            app.delete('/thread/:threadId', deleteThread);
        }
    });


    function deleteThread(req, res, next) {
        const id = req.params.threadId;
        getThread(id).kill();
    }

    function runThread() {

    }

    function optimizeThread(req, res, next) {
        const id = req.params.threadId;
        getThread(id).optimize(function (err) {
            if (err) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(503).json({
                    error: err.toString()
                });
            } else {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).json({
                    optimized: true
                });
            }
        });
    }

    function createThread(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(getThread());
    }

    function menuService(req, res, next) {
        const query = req.query;
        const menuId = query.id;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(menus[menuId]);
    }
}