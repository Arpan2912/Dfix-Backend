const moment = require('moment');
const bluebird = require("bluebird");
const Expense = require('../../model/expense-model');
const fs = require('fs');
const Utils = require('../../commons/utils');

module.exports = class ExpenseController {


      static addExpense(req, res) {
            let _qroot = process.cwd();
            let data = req.body;
            let userId = data.userId;
            // let itemName = data.itemName;
            let userName = data.userName;
            let description = data.description;
            let expenseAmount = data.expenseAmount;
            let base64 = data.base64;

            // console.log(err);
            let expense = new Expense();
            expense.user_id = userId;
            // expense.item_name = itemName;
            expense.user_name = userName;

            expense.description = description;
            expense.expense_amount = expenseAmount;
            expense.created_at = new Date().toISOString();
            expense.updated_at = new Date().toISOString();

            let date = new Date().toISOString();
            let newDate = moment(date).format("DDMMYYYYHHMMSS");
            var base64Data = base64.replace(/^data:image\/jpg;base64,/, "");
            console.log(req.body);
            fs.exists(_qroot + '/public/' + userId, (data) => {
                  if (data === true) {
                        console.log("folder already exist");
                  } else {
                        fs.mkdir(_qroot + '/public/' + userId);
                  }
            });

            fs.writeFile(_qroot + '/public/' + userId + '/' + newDate + "ex.jpg", base64Data, 'base64', function (err) {
                  if (err) {
                        return res.json({ success: false, error: err });
                  }
                  expense.image_url = userId + '/' + newDate + "ex.jpg";
                  expense.save()
                        .then(data => {
                              return res.json({ success: true, data: data })
                        }).catch(e => {
                              return res.json({ success: false, error: e });
                        })
            })
      }

      static updateExpense(req, res) {
            // let userId = req.body.userId;
            let body = req.body;
            let userName = body.userName;
            let itemName = body.itemName;
            let description = body.description;
            let expenseAmount = body.expenseAmount;
            let expenseId = body._id;
            let updatedObj = {
                  user_name: userName,
                  expense_amount: expenseAmount,
                  description: req.body.description,
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
            let date = Utils.getIndianDayStartTimeInIsoFormat();
            let userId = req.body.userId;
            let finalObj = [];
            console.log("user id", userId);
            Expense.find({ user_id: userId, created_at: { $gt: date } })
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
