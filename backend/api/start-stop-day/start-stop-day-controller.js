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
                fs.mkdir(_qroot + '/public/' + userId);F
            }
        });
        
        fs.writeFile(_qroot + '/public/' + userId + "/out.jpg", base64Data, 'base64', function (err) {
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
    }
}