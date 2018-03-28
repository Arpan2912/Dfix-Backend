var mongoose = require('mongoose');
var Schema = mongoose.Schema,

    MeetingSchema = new Schema({
        user_id: String,
        user_name:String,
        start_time: String,
        org_image: String,
        org_name: String,
        org_location: Object,
        end_time: String,
        created_at: String,
        updated_at: String
    })

var Meeting = mongoose.model('Meeting', MeetingSchema);
module.exports = Meeting;