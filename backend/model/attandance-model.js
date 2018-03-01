var mongoose = require('mongoose');
var Schema = mongoose.Schema,

    AttandanceSchema = new Schema({
        user_id: String,
        date: String,
        attandance: String,
        created_at: String,
        updated_at: String
    })

var Attandance = mongoose.model('attandance', AttandanceSchema);
module.exports = Attandance;