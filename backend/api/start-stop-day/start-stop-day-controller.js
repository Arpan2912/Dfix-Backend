const DaySummary = require('../../model/start-stop-day-model');
const Attandance = require('../../model/attandance-model');
const fs = require('fs');
const moment = require('moment');

module.exports = class StartStopDayController {
    static startDay(req, res) {
        let data = req.body;
        let _qroot = process.cwd();
        let base64 = data.base64;
        let km = data.km;
        let userId = data.userId;
        var base64Data = base64.replace(/^data:image\/jpg;base64,/, "");
        console.log(req.body);
        fs.exists(_qroot + '/public/' + userId, (data) => {
            if (data === true) {
                console.log("folder already exist");
            } else {
                fs.mkdir(_qroot + '/public/' + userId);
            }
        });

        fs.writeFile(_qroot + '/public/' + userId + "/start.jpg", base64Data, 'base64', function (err) {
            console.log(err);
            let daySummary = new DaySummary();
            daySummary.user_id = userId;
            daySummary.start_time = new Date().toISOString();
            daySummary.start_image = `${userId}/start.jpg`;
            daySummary.start_km = km;
            daySummary.start_location = null;
            daySummary.end_time = null;
            daySummary.end_image = null;
            daySummary.end_km = null;
            daySummary.end_location = null;
            daySummary.created_at = new Date().toISOString();
            daySummary.updated_at = new Date().toISOString();

            daySummary.save()
                .then((data => {
                    res.json({ success: true, data: data });
                }))
                .catch((e => {
                    res.json({ success: false, error: e })
                }))
        });

    }

    static stopDay(req, res) {
        let data = req.body;
        let _qroot = process.cwd();
        let base64 = data.base64;
        let km = data.km;
        let userId = data.userId;
        let _id = data.id;
        let stopDayResult = null;
        var base64Data = base64.replace(/^data:image\/jpg;base64,/, "");
        console.log(req.body);
        fs.exists(_qroot + '/public/' + userId, (data) => {
            if (data === true) {
                console.log("folder already exist");
            } else {
                fs.mkdir(_qroot + '/public/' + userId);
            }
        });

        fs.writeFile(_qroot + '/public/' + userId + "/stop.jpg", base64Data, 'base64', function (err) {
            console.log(err);
            let daySummary = {};
            daySummary.user_id = userId;
            daySummary.end_time = new Date().toISOString();
            daySummary.end_image = `${userId}/stop.jpg`;
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
                    /*
                 data=   _id: 5a96cdc985dc5e1978af3f03,
  user_id: '5a8810ab52841cd399c5ac52',
  start_time: '2018-02-28T15:42:01.579Z',
  start_image: '5a8810ab52841cd399c5ac52/start.jpg',
  start_km: ' 10',
  start_location: null,
  end_time: '2018-02-28T15:42:18.448Z',
  end_image: '5a8810ab52841cd399c5ac52/stop.jpg',
  end_km: ' 25',
  end_location: null,
  created_at: '2018-02-28T15:42:01.580Z',
  updated_at: '2018-02-28T15:42:18.448Z',
                    */
                    // let startTime = data.start_time;
                    // let endTime = data.end_time;
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
                    res.json({ success: true, data: stopDayResult });
                })
                .catch(e => {
                    res.json({ success: false, error: e })
                })
        });

    }

}