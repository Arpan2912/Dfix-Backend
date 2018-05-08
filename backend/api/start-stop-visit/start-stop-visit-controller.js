const Meeting = require('../../model/start-end-visit-model');
const Order = require('../../model/order-model');
const Attandance = require('../../model/attandance-model');
const fs = require('fs');
const moment = require('moment');
const bluebird = require("bluebird");
const momentTimezone = require('moment-timezone');
const Utils = require("../../commons/utils");

module.exports = class StartStopVisitController {
      static startVisit(req, res) {
            let data = req.body;
            console.log(data);
            let _qroot = process.cwd();
            let base64 = data.base64;
            let location = data.location;
            let userId = data.userId;
            let userName = data.userName;
            let orgName = data.orgName;
            let date = new Date().toISOString();
            let newDate = moment(date).format("DDMMYYYYHHMM");
            var base64Data = base64.replace(/^data:image\/jpg;base64,/, "");
            console.log(req.body);
            fs.exists(_qroot + '/public/' + userId, (data) => {
                  if (data === true) {
                        console.log("folder already exist");
                  } else {
                        fs.mkdir(_qroot + '/public/' + userId);
                  }


                  fs.writeFile(_qroot + '/public/' + userId + '/' + newDate + "startVisit.jpg", base64Data, 'base64', function (err) {
                        console.log(err);

                        /**
                         *  user_id: String,
                    start_time: String,
                    org_image: String,
                    org_location: String,
                    end_time: String,
                    created_at: String,
                    updated_at: String
                         */
                        let meeting = new Meeting();
                        meeting.user_id = userId;
                        meeting.user_name = userName;
                        meeting.start_time = date;
                        meeting.org_image = `${userId}/${newDate}startVisit.jpg`;
                        meeting.org_name = orgName;
                        meeting.org_location = location;
                        meeting.end_time = null;
                        meeting.created_at = date;
                        meeting.updated_at = date;

                        meeting.save()
                              .then((data => {
                                    res.json({ success: true, data: data });
                              }))
                              .catch((e => {
                                    res.json({ success: false, error: e })
                              }))
                  });
            });

      }

      static stopVisit(req, res) {
            let data = req.body;
            let orderArray = data.orderArray;
            let userId = data.userId;
            let meetingId = data.id;
            let stopDayResult = null;

            // console.log(err);
            let endMeeting = {};
            endMeeting.user_id = userId;
            endMeeting.end_time = new Date().toISOString();
            endMeeting.updated_at = new Date().toISOString();
            console.log(endMeeting);
            console.log("id is ", meetingId);

            Meeting
                  .findOneAndUpdate({ _id: meetingId }, endMeeting, { new: true })
                  .then(data => {
                        let finalOrderArray = [];
                        bluebird.mapSeries(orderArray, function (orderData) {
                              return new Promise((resolve, reject) => {
                                    let obj = {};
                                    if (orderData && orderData.itemName && orderData.itemPrice && orderData.itemQuantity) {
                                          obj.user_id = userId;
                                          obj.item_name = orderData.itemName || null;
                                          obj.item_quantity = orderData.itemQuantity || null;
                                          obj.item_price = orderData.itemPrice || null;
                                          obj.meeting_id = meetingId;
                                          obj.created_at = new Date().toISOString();
                                          obj.updated_at = new Date().toISOString();
                                          finalOrderArray.push(obj);
                                          return resolve(true);
                                    } else {
                                          console.log("Proper data not exist");
                                          return resolve(false);
                                    }
                              })
                        }).then(data => {
                              console.log(data);
                              return Order.insertMany(finalOrderArray);
                        }).then(data => {
                              console.log(data);
                              res.json({ success: true });
                        }).catch(e => {
                              res.json({ success: false, error: e });
                        })

                  })
                  .catch(e => {
                        return res.json({ success: false, error: e });
                  })
      }

      static getTodayVisit(req, res) {
            //@NOTE:Query to be update to get only today visits
            let userId = req.body.userId;
            let finalObj = [];

            let date = Utils.getIndianDayStartTimeInIsoFormat();

            console.log("user id", userId, "date", date);
            Meeting.find({ user_id: userId, created_at: { $gt: date } })
                  .then(todayMeetings => {
                        // console.log("data", todayMeetings);
                        bluebird.map(todayMeetings, function (todayMeeting) {
                              return new Promise((resolve, reject) => {
                                    Order.find({ meeting_id: todayMeeting._id })
                                          .then(orders => {
                                                todayMeeting.orders = orders;
                                                console.log("orders", todayMeeting);
                                                let orderAmount = 0;
                                                let numberOfOrders = orders.length;
                                                bluebird.mapSeries(orders, function (order) {

                                                      return new Promise((resolve, reject) => {
                                                            orderAmount = orderAmount + parseInt(order.item_price);

                                                            console.log("order amount", orderAmount);
                                                            return resolve(true);
                                                      }).then(data => {
                                                            console.log("data", data);
                                                            return data;
                                                      })
                                                }).then(data => {
                                                      // orderAmount = data[0];
                                                      return resolve({ todayMeeting: todayMeeting, orders: orders, orderAmount: orderAmount, numberOfOrders: numberOfOrders });
                                                      console.log("order amount =", data);
                                                })

                                                //return resolve({ todayMeeting: todayMeeting, orders: orders, orderAmount: orderAmount });
                                          })
                              })
                        }).then(data => {
                              return res.json({ success: true, data: data });
                        })
                              .catch(e => {
                                    res.json({ success: false, error: e });
                              })
                        //@NOTE:response
                        // {
                        //       "todayMeeting": {
                        //           "_id": "5aa8183f018c4120845ad102",
                        //           "user_id": "5a8da717c283f71ec44f41e2",
                        //           "start_time": "2018-03-13T18:28:15.687Z",
                        //           "org_image": "5a8da717c283f71ec44f41e2/startVisit.jpg",
                        //           "org_name": " hello",
                        //           "org_location": {
                        //               "latitude": 23.006486,
                        //               "longitude": 72.5621458
                        //           },
                        //           "end_time": "2018-03-13T18:28:28.794Z",
                        //           "created_at": "2018-03-13T18:28:15.687Z",
                        //           "updated_at": "2018-03-13T18:28:28.794Z",
                        //           "__v": 0
                        //       },
                        //       "orders": [
                        //           {
                        //               "_id": "5aa8184c018c4120845ad103",
                        //               "user_id": "5a8da717c283f71ec44f41e2",
                        //               "item_name": "pencil",
                        //               "item_quantity": "100",
                        //               "item_price": "10000",
                        //               "meeting_id": "5aa8183f018c4120845ad102",
                        //               "created_at": "2018-03-13T18:28:28.804Z",
                        //               "updated_at": "2018-03-13T18:28:28.804Z",
                        //               "__v": 0
                        //           }
                        //       ]

                  })
                  .catch(e => {
                        res.json({ success: false, error: e });
                  })
      }

      static updateOrder(req, res) {
            // let userId = req.body.userId;
            let body = req.body;
            let itemName = body.itemName;
            let itemPrice = body.itemPrice;
            let itemQuantity = body.itemQuantity;
            let orderId = body._id;
            let updatedObj = {
                  item_name: itemName,
                  item_price: itemPrice,
                  item_quantity: itemQuantity,
                  updated_at: new Date().toISOString()
            }
            let orderObj = req.body.orderObj;
            Order.findOneAndUpdate({ _id: orderId }, updatedObj, { new: true })
                  .then(data => {
                        console.log("order updated successfully");
                        res.json({ success: true, data: data })
                  })
                  .catch(e => {
                        res.json({ success: false, error: e });
                  })
      }

      static addOrder(req, res) {
            let userId = req.body.userId;
            let body = req.body;
            let itemName = body.itemName;
            let itemPrice = body.itemPrice;
            let itemQuantity = body.itemQuantity;
            let meetingId = body.meetingId;

            let updatedObj = new Order();

            updatedObj.item_name = itemName;
            updatedObj.item_price = itemPrice;
            updatedObj.item_quantity = itemQuantity;
            updatedObj.user_id = userId;
            updatedObj.meeting_id = meetingId;
            updatedObj.created_at = new Date().toISOString();
            updatedObj.updated_at = new Date().toISOString();

            // let orderObj = req.body.orderObj;
            updatedObj.save()
                  .then(data => {
                        console.log("order added successfully");
                        res.json({ success: true, data: data })
                  })
                  .catch(e => {
                        res.json({ success: true, error: e });
                  })

      }

      static deleteOrder(req, res) {
            // let userId = req.body.userId;
            let body = req.body;
            let meetingId = body.orderId;

            Order.deleteOne({ _id: meetingId })
                  .then(data => {
                        res.json({ success: true, data: data });
                  })
                  .catch(e => {
                        res.json({ success: false, error: e });
                  })

      }

      static getTodayLastRunningVisit(req, res) {
            let userId = req.params.userId;
            console.log("userID", userId);
            let date = new Date();
            date.setHours(0, 0, 0, 0);
            date = date.toISOString();
            Meeting.find({ user_id: userId, start_time: { $gt: date }, end_time: null })
                  .then(data => {
                        console.log("data", data, "userID", userId);
                        if (data.length > 0) {
                              let lastVisit = data.length - 1;
                              res.json({ success: true, data: data[lastVisit] });
                        }
                        else
                              res.json({ success: true, data: null });
                  })
                  .catch(e => {
                        res.json({ success: false, error: 'something went wrong' });
                  })

      }

}