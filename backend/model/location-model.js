var mongoose = require('mongoose');
var Schema = mongoose.Schema,

    LocationSchema = new Schema({
        user_id: String,
        date: String,
        location: Object,
        created_at: String,
        updated_at: String,
        current_location:Object
    })

var Location = mongoose.model('location', LocationSchema);
module.exports = Location;