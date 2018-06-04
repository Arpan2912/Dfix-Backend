var mongoose = require('mongoose');
var Schema = mongoose.Schema,

    LocationSchema = new Schema({
        user_id: String,
        user_name:String,
        date: String,
        location: [{
            latitude:Number,
            longitude:Number
        }],
        created_at: String,
        updated_at: String,
        current_location:{
            latitude:Number,
            longitude:Number
        }
    })

var Location = mongoose.model('location', LocationSchema);
module.exports = Location;
