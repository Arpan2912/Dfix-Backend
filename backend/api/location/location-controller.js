const Location = require('../../model/location-model');
const logger = require('../../config/winston');
const Utils = require('../../commons/utils');
const momentTimezone = require('moment-timezone');

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
        // let date = '2018-09-01T17:22:59.396Z';
        let date = req.body.date ? req.body.date : new Date().toISOString();
        let indianDate = Utils.getIndianDayStartTime(date);
        let endDate = momentTimezone(indianDate).add(24, 'hours').toISOString();
        console.log("isoDate", indianDate);
        console.log("endDate", endDate);

        Location.find({
            "user_id": req.body._id,
            "created_at": { $gt: indianDate, $lt: endDate }
        }).then(data => {
            console.log("data", data);
            // var newRes = [];
            // console.log(req.body);
            // for (var i in data) {
            //     var date = new Date(data[i].created_at).setHours(0, 0, 0) / 1000;
            //     var selectedDate = new Date(req.body.date).setHours(0, 0, 0) / 1000;
            //     // console.log(req.body.date);
            //     if (Math.floor(date) == Math.floor(selectedDate)) {
            //         newRes = data[i];
            //     }
            // }
            // console.log(newRes);
            return res.json({ "success": true, "data": data });
        }).catch(e => {
            logger.error(e.stack);
            return res.json({ success: false, data: e });
        })
    }

}
