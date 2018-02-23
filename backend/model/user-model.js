var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    // ObjectId = Schema.ObjectId;

 UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    password:String,
    phone:String,
    address:String,
    created_at:String,
    updated_at:String
})

var User = mongoose.model('User', UserSchema);
module.exports = User;