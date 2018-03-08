const StartStopVisitController = require('./start-stop-visit-controller');
module.exports = class StartStopVisitRoute {
    static init(router) {
        router
            .route('/api/start-visit')
            .post(StartStopVisitController.startVisit);

        router
            .route('/api/stop-visit')
            .post(StartStopVisitController.stopVisit);
    }
}