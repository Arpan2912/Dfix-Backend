const DaySummary = require('../../model/start-stop-day-model');
const Attandance = require('../../model/attandance-model');
const fs = require('fs');
const moment = require('moment');
const Utils = require("../../commons/utils");
const logger = require("../../config/winston");
const config = require(`../../constants/${process.env.NODE_ENV}.json`);
let s3Url = `${config.s3.url}${config.s3.bucketName}/`
module.exports = class StartStopDayController {

    //code without s3
    static startDay1(req, res) {
        console.log("--------------------------");
        console.log(req.body);
        let data = req.body;
        let _qroot = process.cwd();
        let base64 = data.base64;
        let km = data.km;
        let name = data.user_name;
        let userId = data.userId;
        let date = new Date().toISOString();
        let newDate = moment(date).format("DDMMYYYYHHMM");
        var base64Data = base64.replace(/^data:image\/jpg;base64,/, "");
        console.log(_qroot);
        fs.exists(_qroot + '/public/' + userId, (data) => {
            if (data === true) {
                console.log("folder already exist");
            } else {
                console.log("here");
                fs.mkdir(_qroot + '/public/' + userId);
            }


            fs.writeFile(_qroot + '/public/' + userId + '/' + newDate + "start.jpg", base64Data, 'base64', function (err) {
                console.log(err);
                logger.error(err.stack);
                let daySummary = new DaySummary();
                daySummary.user_id = userId;
                daySummary.start_time = date;
                daySummary.start_image = `${userId}/${newDate}start.jpg`;
                daySummary.start_km = km;
                daySummary.start_location = null;
                daySummary.user_name = name;
                daySummary.end_time = null;
                daySummary.end_image = null;
                daySummary.end_km = null;
                daySummary.end_location = null;
                daySummary.created_at = date;
                daySummary.updated_at = date;

                daySummary.save()
                    .then((data => {
                        res.status(200).json({ success: true, data: data, message: "start day successfully" });
                    }))
                    .catch((e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        res.status(500).json({ success: false, error: e, message: "start day error" });
                    }))
            });
        });

    }

    //code with s3
    static startDay(req, res) {
        console.log("--------------------------");
        console.log(req.body);
        let data = req.body;
        let _qroot = process.cwd();
        let base64 = data.base64;
        let km = data.km;
        let name = data.user_name;
        let userId = data.userId;
        let date = new Date().toISOString();
        let newDate = moment(date).format("DDMMYYYYHHMM");
        let imageType = Utils.extractExtension(base64);
        var base64Data = base64.replace(/^data:image\/jpg;base64,/, "");
        let imgData = new Buffer(base64Data, 'base64');
        console.log(_qroot);

        Utils.uploadImageOnAmazonS3('d-fix', `${userId}/${newDate}start.jpg`, imgData, imageType, userId)
            .then(data => {
                // let resObj =
                //     {
                //         ETag: '"bb0cd586e3c8b0bffcaf0637cbe28421"',
                //         Location: 'https://liit-staging-nikunj.s3.amazonaws.com/1/product/product2',
                //         key: '1/product/product2',
                //         Key: '1/product/product2',
                //         Bucket: 'liit-staging-nikunj'
                //     }
                let daySummary = new DaySummary();
                daySummary.user_id = userId;
                daySummary.start_time = date;
                daySummary.start_image = data.key;
                daySummary.start_km = km;
                daySummary.start_location = null;
                daySummary.user_name = name;
                daySummary.end_time = null;
                daySummary.end_image = null;
                daySummary.end_km = null;
                daySummary.end_location = null;
                daySummary.created_at = date;
                daySummary.updated_at = date;

                return daySummary.save()
            })
            .then((data) => {
                res.status(200).json({ success: true, data: data, message: "start day successfully" });
            }).catch(e => {
                logger.error(err.stack);
                res.status(500).json({ success: false, error: e, message: "start day error" });
            })

    }

    //code without s3
    static stopDay1(req, res) {
        let data = req.body;
        let _qroot = process.cwd();
        let base64 = data.base64;
        let km = data.km;
        let userId = data.userId;
        let _id = data.id;
        let date = new Date().toISOString();
        let newDate = moment(date).format("DDMMYYYYHHMM");
        // let newDate = moment(date).format("DD/MM/YYYY:HH:MM");
        let stopDayResult = null;
        var base64Data = base64.replace(/^data:image\/jpg;base64,/, "");
        fs.exists(_qroot + '/public/' + userId, (data) => {
            if (data === true) {
                console.log("folder already exist");
            } else {
                fs.mkdir(_qroot + '/public/' + userId);
            }

            fs.writeFile(_qroot + '/public/' + userId + "/" + newDate + "stop.jpg", base64Data, 'base64', function (err) {
                console.log(err);
                logger.error(err.stack);
                let daySummary = {};
                daySummary.user_id = userId;
                daySummary.end_time = date;
                daySummary.end_image = `${userId}/${newDate}stop.jpg`;
                daySummary.end_km = km;
                daySummary.end_location = null;
                daySummary.updated_at = new Date().toISOString();
                console.log(daySummary);
                console.log("id is ", _id);

                DaySummary
                    .findOneAndUpdate({ _id: _id }, daySummary, { new: true })
                    .then(data => {
                        stopDayResult = data;
                        console.log("data", data);

                        var startTime = moment(data.start_time);
                        var endTime = moment(data.end_time);
                        let diff = endTime.diff(startTime, 'minutes') // 86400000
                        console.log(diff);
                        let attandance;
                        if (diff >= 480) {
                            attandance = 'P'
                        } else if (diff >= 240) {
                            attandance = 'HL'
                        } else {
                            attandance = 'A'
                        }

                        let attandanceObj = new Attandance();
                        attandanceObj.user_id = userId;
                        attandanceObj.attandance = attandance;
                        attandanceObj.date = new Date().toISOString();
                        attandanceObj.created_at = new Date().toISOString();
                        attandanceObj.updated_at = new Date().toISOString();

                        return attandanceObj.save()

                    })
                    .then(result => {
                        console.log("data", result);
                        console.log('attandance updated');
                        res.status(200).json({ success: true, data: stopDayResult, message: "day stopped successfully" });
                    })
                    .catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        res.status(500).json({ success: false, error: e, message: "day stop error" });
                    })
            });
        });

    }

    //code with s3
    static stopDay(req, res) {
        let data = req.body;
        let _qroot = process.cwd();
        let base64 = data.base64;
        let km = data.km;
        let userId = data.userId;
        let _id = data.id;
        let date = new Date().toISOString();
        let newDate = moment(date).format("DDMMYYYYHHMM");
        let imageType = Utils.extractExtension(base64);
        let stopDayResult = null;
        var base64Data = base64.replace(/^data:image\/jpg;base64,/, "");
        let imgData = new Buffer(base64Data, 'base64');

        Utils.uploadImageOnAmazonS3('d-fix', `${userId}/${newDate}stop.jpg`, imgData, imageType, userId)
            .then(data => {
                // let resObj =
                //     {
                //         ETag: '"bb0cd586e3c8b0bffcaf0637cbe28421"',
                //         Location: 'https://liit-staging-nikunj.s3.amazonaws.com/1/product/product2',
                //         key: '1/product/product2',
                //         Key: '1/product/product2',
                //         Bucket: 'liit-staging-nikunj'
                //     }
                let daySummary = {};
                daySummary.user_id = userId;
                daySummary.end_time = date;
                daySummary.end_image = data.key;
                daySummary.end_km = km;
                daySummary.end_location = null;
                daySummary.updated_at = new Date().toISOString();
                console.log(daySummary);
                console.log("id is ", _id);

                return DaySummary.findOneAndUpdate({ _id: _id }, daySummary, { new: true })
            })
            .then(data => {
                stopDayResult = data;
                console.log("data", data);
                return res.status(200).send({ success: true, data: stopDayResult, message: "day stopped successfully" });
            })
            .catch(e => {
                logger.error(e.stack);
                return res.status(500).send({ success: false, error: e, message: "day stop error" });
            })
    }

    static resetEndTime(req, res) {
        let _id = req.body._id;
        DaySummary.findById(_id)
            .then(day => {
                console.log(day);
                day.end_time = null;
                day.end_image = null;
                day.end_km = null;
                //user.nhsSys = nhsSys;
                return day.save()
                    .then((day) => {
                        res.status(200).json(day);
                    })
                    .catch(e => {

                    })
            });
    }
    static getTodayStartDayDetails(req, res) {
        let userId = req.params.userId;
        console.log("userID", userId);
        // let date = new Date();
        let date = Utils.getIndianDayStartTimeInIsoFormat();
        // date.setHours(0, 0, 0, 0);
        // date = date.toISOString();
        DaySummary.find({ user_id: userId, start_time: { $gt: date } })
            .then(data => {
                console.log("data", data, "userID", userId);
                if (data.length > 0)
                    res.status(200).json({ success: true, data: data[0], message: "get today day detail successfully" });
                else
                    res.status(200).json({ success: true, data: null, message: "no today detail found" });
            })
            .catch(e => {
                console.log("e", e);
                logger.error(e.stack);
                res.status(500).json({ success: false, error: 'something went wrong' });
            })

    }
    static getDaySummary(req, res) {
        DaySummary
            .find()
            .then(data => {
                data.forEach(function(element) {
                   element.start_image = s3Url+element.start_image;
                   element.end_image = s3Url+element.end_image; 
                }, this);
                return res.status(200).json({ success: true, data: data, message: "get today summary" });
            }).catch(e => {
                console.log("e", e);
                logger.error(e.stack);
                return res.status(500).json({ success: false, error: e, message: "internal server error" });
            })
    }

}
