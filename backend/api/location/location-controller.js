const Location = require('../../model/location-model');
const logger = require('../../config/winston');
module.exports = class LocationController {

    static addOrUpdateUserLocation(req, res) {
        let body = req.body;
        let userId = body.userId;
        let userName = body.userName;
        let location = body.location;
        let currentLocation = body.currentLocation;
        let id = body.id;
        console.log("id ------------> ", id);
        let obj = new Location();
        if (id) {
            obj._id = id;
        }
        obj.user_id = userId;
        obj.user_name = userName;
        obj.location = location;
        obj.current_location = currentLocation;
        obj.created_at = new Date().toISOString();
        obj.updated_at = new Date().toISOString();

        if (id) {
            let obj = {};
            if (id) {
                obj._id = id;
            }
            obj.user_id = userId;
            obj.location = location;
            obj.current_location = currentLocation;
            obj.created_at = new Date().toISOString();
            obj.updated_at = new Date().toISOString();
            Location.findOneAndUpdate({ _id: id }, obj, { new: true })
                .then(data => {
                    // console.log(data);
                    res.status(200).send({ success: true, data: data, message: "location updated successfully" });
                })
                .catch(e => {
                    logger.error(e.stack);
                    console.log("e", e);
                    res.status(500).send({ success: false, data: e, message: "internal server error" });
                })
        } else {
            let obj = new Location();

            obj.user_id = userId;
            obj.user_name = userName;
            obj.location = location;
            obj.current_location = currentLocation;
            obj.created_at = new Date().toISOString();
            obj.updated_at = new Date().toISOString();
            obj.save()
                .then(data => {
                    res.status(200).send({ success: true, data: data, message: "location created successfully" });
                })
                .catch(e => {
                    logger.error(e.stack);
                    console.log("error", e);
                    res.status(500).send({ success: false, data: e, message: "internal server error" });
                })
        }

    }
    static getCurrentLocation(req, res) {
        Location.find().then(data => {
            var arr = [];
            console.log(new Date().toLocaleDateString());
            for (var i in data) {
                if (new Date(data[i].created_at).toLocaleDateString() == new Date().toLocaleDateString()) {
                    arr.push(data[i]);
                }
            }
            console.log(arr);
            return res.status(200).json({ success: true, data: arr, message: "location fetched successfully" });
        }).catch(e => {
            console.log("e", e);
            logger.error(e.stack);
            return res.status(500).json({ success: false, data: e, message: "location fetch error" });
        })
    }
    static getLocation(req, res) {
        console.log(req.body);
        Location.find({ "user_id": req.body._id }).then(data => {
            console.log(data);
            return res.json({ "success": true, "data": data });
        }).catch(e => {
            logger.error(e.stack);
            return res.json({ success: false, data: e });
        })
    }

}
