var mongoose = require('mongoose');
var Schema = mongoose.Schema,

    ExpenseSchema = new Schema({
        user_id: String,
        user_name:String,
        // item_name: String,  
        expense_amount: String,
        created_at: String,
        updated_at: String,
		description:String
    })

var Expense = mongoose.model('Expense', ExpenseSchema);
module.exports = Expense;