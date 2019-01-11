var mongoose = require('mongoose');
var Schema = mongoose.Schema,

    MeetingSchema = new Schema({
        user_id: String,
        user_name:String,
        start_time: String,
        org_image: String,
        org_name: String,
        org_location: {
            latitude:Number,
            longitude:Number
        },
        end_time: String,
        remarks:String,
        created_at: String,
        updated_at: String
    })

var Meeting = mongoose.model('Meeting', MeetingSchema);
module.exports = Meeting;