const StartStopDayController = require('./start-stop-day-controller');
module.exports = class StartStopDayRoute {
    static init(router) {
        router
            .route('/api/start-day')
            .post(StartStopDayController.startDay);

        router
            .route('/api/stop-day')
            .post(StartStopDayController.stopDay);

        router
            .route('/api/get-start-day-details/:userId')
            .get(StartStopDayController.getTodayStartDayDetails);

        router
            .route('/api/get-start-day-details/:userId')
            .get(StartStopDayController.getTodayStartDayDetails);
    }

}