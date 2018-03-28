const LocationController = require('./location-controller');
module.exports = class LocationRoutes {
    static init(router) {
        router
            .route('/api/add-user-location')
            .post(LocationController.addOrUpdateUserLocation);


    }
}