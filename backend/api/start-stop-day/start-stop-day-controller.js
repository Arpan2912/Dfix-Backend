const DaySummary = require('../../model/start-stop-day-model');
const fs = require('fs');
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
                .update({ _id: _id }, daySummary)
                .then(data => {
                    console.log("data", data);
                    res.json({ success: true, data: data });
                })
                .catch(e => {
                    res.json({ success: false, error: e })
                })
        });

    }

}