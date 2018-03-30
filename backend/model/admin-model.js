var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    // ObjectId = Schema.ObjectId;

 AdminSchema = new Schema({
    email: String,
    password:String,
    first_name:String,
    last_name:String,
    updated_at:String,
})

var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
