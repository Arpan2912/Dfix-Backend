const moment = require('moment');
const bluebird = require("bluebird");
const Expense = require('../../model/expense-model');

module.exports = class ExpenseController {


      static addExpense(req, res) {
            let data = req.body;
            let userId = data.userId;
            let itemName = data.itemName;
            let userName =data.userName;
            let description = data.description;
            let expenseAmount = data.expenseAmount;

            // console.log(err);
            let expense = new Expense();
            expense.user_id = userId;
            expense.item_name = itemName;
            expense.user_name = userName;
            expense.description = description;
            expense.expense_amount = expenseAmount
            expense.created_at = new Date().toISOString();
            expense.updated_at = new Date().toISOString();

            expense.save()
                  .then(data => {
                        return res.json({ success: true, data: data })
                  }).catch(e => {
                        return res.json({ success: false, error: e });
                  })
      }

      static updateExpense(req, res) {
            // let userId = req.body.userId;
            let body = req.body;
            let userName = body.userName;
            let expenseAmount = body.expenseAmount;
            let expenseId = body._id;
            let updatedObj = {
                  user_name: userName,
                  expense_amount: expenseAmount,
                  description:req.body.description,
                  updated_at: new Date().toISOString()
            }
            let orderObj = req.body.orderObj;
            Expense.findOneAndUpdate({ _id: expenseId }, updatedObj, { new: true })
                  .then(data => {
                        console.log("order updated successfully");
                        res.json({ success: true, data: data })
                  })
                  .catch(e => {
                        res.json({ success: false, error: e });
                  })
      }

      static deleteExpense(req, res) {
            // let userId = req.body.userId;
            let body = req.body;
            let expenseId = body.expenseId;

            Expense.deleteOne({ _id: expenseId })
                  .then(data => {
                        res.json({ success: true, data: data });
                  })
                  .catch(e => {
                        res.json({ success: false, error: e });
                  })

      }
      static getTodayExpense(req, res) {
            //@NOTE:Query to be update to get only today visits
            let userId = req.body.userId;
            let finalObj = [];
            console.log("user id", userId);
            Expense.find({ user_id: userId })
                  .then(data => {
                        return res.json({ success: true, data: data });
                  }).catch(e => {
                        res.json({ success: false, error: e });
                  })
      }
      static getExpense(req, res) {
            Expense.find()
                  .then(data => {
                        return res.json({ success: true, data: data });
                  }).catch(e => {
                        res.json({ success: false, error: e });
                  })
      }

}
