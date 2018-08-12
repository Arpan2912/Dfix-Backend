const moment = require('moment');
const bluebird = require("bluebird");
const Expense = require('../../model/expense-model');
const fs = require('fs');
const Utils = require('../../commons/utils');
const logger = require('../../config/winston');
const config = require(`../../constants/${process.env.NODE_ENV}.json`);
let s3Url = `${config.s3.url}${config.s3.bucketName}/`

module.exports = class ExpenseController {

      //without s3
      static addExpense1(req, res) {
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
            //console.log(req.body);
            fs.exists(_qroot + '/public/' + userId, (data) => {
                  if (data === true) {
                        console.log("folder already exist");
                  } else {
                        fs.mkdir(_qroot + '/public/' + userId);
                  }
            });

            fs.writeFile(_qroot + '/public/' + userId + '/' + newDate + "ex.jpg", base64Data, 'base64', function (err) {
                  if (err) {
                        logger.error(err.stack);
                        console.log("err", err);
                        return res.status(500).json({ success: false, error: err, message: "internal server error" });
                  }
                  expense.image_url = userId + '/' + newDate + "ex.jpg";
                  expense.save()
                        .then(data => {
                              return res.status(200).json({ success: true, data: data })
                        }).catch(e => {
                              logger.error(e.stack);
                              console.log("e", e);
                              return res.status(500).json({ success: false, error: e, message: "internal server error" });
                        })
            })
      }

      // with s3
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
            let imageType = Utils.extractExtension(base64);
            var base64Data = base64.replace(/^data:image\/jpg;base64,/, "");
            let imgData = new Buffer(base64Data, 'base64');
            //console.log(req.body);

            Utils.uploadImageOnAmazonS3('d-fix', `${userId}/${newDate}ex.jpg`, imgData, imageType, userId)
                  .then(data => {
                        // let resObj =
                        //     {
                        //         ETag: '"bb0cd586e3c8b0bffcaf0637cbe28421"',
                        //         Location: 'https://liit-staging-nikunj.s3.amazonaws.com/1/product/product2',
                        //         key: '1/product/product2',
                        //         Key: '1/product/product2',
                        //         Bucket: 'liit-staging-nikunj'
                        //     }
                        expense.image_url = data.key;
                        return expense.save()
                  })
                  .then(data => {
                        return res.status(200).json({ success: true, data: data })
                  }).catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        return res.status(500).json({ success: false, error: e, message: "internal server error" });
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
                  // user_name: userName,
                  expense_amount: expenseAmount,
                  description: req.body.description,
                  updated_at: new Date().toISOString()
            }
            let orderObj = req.body.orderObj;
            Expense.findOneAndUpdate({ _id: expenseId }, updatedObj, { new: true })
                  .then(data => {
                        console.log("order updated successfully");
                        return res.status(200).json({ success: true, data: data, message: "get expense successfully" })
                  })
                  .catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        return res.status(500).json({ success: false, error: e, message: "internal server error" });
                  })
      }

      static deleteExpense(req, res) {
            // let userId = req.body.userId;
            let body = req.body;
            let expenseId = body.expenseId;

            Expense.deleteOne({ _id: expenseId })
                  .then(data => {
                        return res.status(200).json({ success: true, data: data, message: "expense deleted successfully" });
                  })
                  .catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        return res.status(500).json({ success: false, error: e, message: "internal server error" });
                  })

      }
      static getTodayExpense(req, res) {
            //@NOTE:Query to be update to get only today visits
            let date = Utils.getIndianDayStartTimeInIsoFormat();
            let userId = req.body.userId;
            let finalObj = [];
            console.log("user id", userId);
            Expense
                  .find({ user_id: userId, created_at: { $gt: date } })
                  .then(data => {
                        return res.status(200).json({ success: true, data: data, message: "get expense successfully" });
                  }).catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        return res.status(500).json({ success: false, error: e, message: "internal server error" });
                  })
      }
      static getExpense(req, res) {
            Expense
                  .find()
                  .then(data => {
                        data.forEach(function(element) {
                              element.image_url = s3Url+element.image_url;
                           }, this);
                        return res.status(200).json({ success: true, data: data, message: "get expense successfully" });
                  }).catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        return res.status(500).json({ success: false, error: e, message: "internal server error" });
                  })
      }

}
