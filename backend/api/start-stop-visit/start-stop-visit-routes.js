const StartStopVisitController = require('./start-stop-visit-controller');
module.exports = class StartStopVisitRoute {
    static init(router) {
        router
            .route('/api/start-visit')
            .post(StartStopVisitController.startVisit);

        router
            .route('/api/stop-visit')
            .post(StartStopVisitController.stopVisit);

        router
            .route('/api/get-today-visits')
            .post(StartStopVisitController.getTodayVisit);

        router
            .route('/api/update-order')
            .post(StartStopVisitController.updateOrder);

        router
            .route('/api/update-order-web')
            .post(StartStopVisitController.updateOrderWebApp);

        router
            .route('/api/add-order')
            .post(StartStopVisitController.addOrder);

        router
            .route('/api/delete-order')
            .post(StartStopVisitController.deleteOrder);

        router
            .route('/api/get-today-last-running-meeting/:userId')
            .get(StartStopVisitController.getTodayLastRunningVisit);

        router
            .route('/api/getMeetings')
            .get(StartStopVisitController.getMeetings)

        router
            .route('/api/getAllOrders')
            .get(StartStopVisitController.getAllOrders)

        router
            .route('/api/getOrders/:id')
            .get(StartStopVisitController.getOrders)
    }
}
