var mongoose = require('mongoose');
var Schema = mongoose.Schema,

    StartStopDaySchema = new Schema({
        user_id: String,
        start_time: String,
        start_image: String,
        start_km: String,
        start_location: String,
        end_time: String,
        end_image: String,
        end_km: String,
        end_location: String,
        created_at: String,
        updated_at: String
    })

var DaySummary = mongoose.model('DaySummary', StartStopDaySchema);
module.exports = DaySummary;