var mongoose = require('mongoose');
var Schema = mongoose.Schema,

    OrderSchema = new Schema({
        user_id: String,
        item_name: String,
        org_name:String,
        user_name:String,
        item_quantity: String,
        item_price: String,
        meeting_id: String,
        created_at: String,
        updated_at: String
    })

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;