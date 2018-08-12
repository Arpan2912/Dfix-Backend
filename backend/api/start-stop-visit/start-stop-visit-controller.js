const Meeting = require('../../model/start-end-visit-model');
const Order = require('../../model/order-model');
const Attandance = require('../../model/attandance-model');
const fs = require('fs');
const moment = require('moment');
const bluebird = require("bluebird");
const momentTimezone = require('moment-timezone');
const Utils = require("../../commons/utils");
const logger = require("../../config/winston");
const config = require(`../../constants/${process.env.NODE_ENV}.json`);
let s3Url = `${config.s3.url}${config.s3.bucketName}/`

module.exports = class StartStopVisitController {
      /**
       * store image on local machine
       * @param {*} req 
       * @param {*} res 
       */
      static startVisit1(req, res) {
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
                        logger.error(err.stack);
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
                                    data.orgName = orgName;
                                    res.json({ success: true, data: data });
                              }))
                              .catch((e => {
                                    logger.error(e.stack);
                                    res.json({ success: false, error: e })
                              }))
                  });
            });

      }

      /**
       * store image using s3
       * @param {*} req
       * @param {*} res
       */
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
            let imageType = Utils.extractExtension(base64);
            var base64Data = base64.replace(/^data:image\/jpg;base64,/, "");
            let imgData = new Buffer(base64Data, 'base64');
            Utils.uploadImageOnAmazonS3('d-fix', `${userId}/${newDate}startVisit.jpg`, imgData, imageType, userId)
                  .then(data => {
                        // let resObj =
                        //     {
                        //         ETag: '"bb0cd586e3c8b0bffcaf0637cbe28421"',
                        //         Location: 'https://liit-staging-nikunj.s3.amazonaws.com/1/product/product2',
                        //         key: '1/product/product2',
                        //         Key: '1/product/product2',
                        //         Bucket: 'liit-staging-nikunj'
                        //     }
                        console.log(req.body);
                        console.log(data);
                        // fs.exists(_qroot + '/public/' + userId, (data) => {
                        //       if (data === true) {
                        //             console.log("folder already exist");
                        //       } else {
                        //             fs.mkdir(_qroot + '/public/' + userId);
                        //       }


                        // fs.writeFile(_qroot + '/public/' + userId + '/' + newDate + "startVisit.jpg", base64Data, 'base64', function (err) {
                        // console.log(err);

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
                        meeting.org_image = data.key;
                        meeting.org_name = orgName;
                        meeting.org_location = location;
                        meeting.end_time = null;
                        meeting.created_at = date;
                        meeting.updated_at = date;

                        meeting.save()
                              .then((data) => {
                                    data.orgName = orgName;
                                    res.status(200).json({ success: true, data: data, message: "start visit success" });
                              })
                              .catch((e) => {
                                    logger.error(e.stack);
                                    console.log("e", e);
                                    res.status(500).json({ success: false, error: e, message: "start visit failed please try again" })
                              })
                  })
                  .catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        res.status(500).json({ success: false, error: e, message: "start visit failed please try again" })
                  })
            // });
            // });

      }


      static stopVisit(req, res) {
            let data = req.body;
            console.log('data', data)
            let orderArray = data.orderArray;
            let userId = data.userId;
            let meetingId = data.id;
            let stopDayResult = null;
            let orgName = data.orgName;
            let userName = data.userName;
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
                                          obj.user_name = userName;
                                          obj.org_name = orgName;
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
                              console.log("finalOrderArray", finalOrderArray);
                              return Order.insertMany(finalOrderArray);
                        }).then(data => {
                              console.log(data);
                              res.status(200).json({ success: true, data: null, message: "stop visit successfully" });
                        }).catch(e => {
                              logger.error(e.stack);
                              console.log("e", e);
                              res.status(500).json({ success: false, error: e, message: "stop visit failed" });
                        })

                  })
                  .catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        return res.status(500).json({ success: false, error: e, message: "stop visit failed" });
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
                                                }).catch(e => {
                                                      return reject(e);
                                                })

                                                //return resolve({ todayMeeting: todayMeeting, orders: orders, orderAmount: orderAmount });
                                          })
                              })
                        }).then(data => {
                              return res.status(200).json({ success: true, data: data, message: "get today visit successfully" });
                        }).catch(e => {
                              logger.error(e.stack);
                              console.log("e", e);
                              return res.status(500).json({ success: false, error: e, message: "today visit error" });
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
                        logger.error(e.stack);
                        console.log("e", e);
                        res.json({ success: false, error: e });
                  })
      }
      static getMeetings(req, res) {
            Meeting
                  .find()
                  .then(data => {
                        data.forEach(function(element) {
                              element.org_image = s3Url+element.org_image;
                           }, this);
                        return res.status(200).json({ success: true, data: data, message: "get visit successfully" });
                  }).catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        res.status(500).json({ success: false, error: e, message: "stop visit failed" });
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
                        res.status(200).json({ success: true, data: data, message: "update order successfully" })
                  })
                  .catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        res.status(500).json({ success: false, error: e, message: "update order failed" });
                  })
      }

      static getOrders(req, res) {
            Order.find()
                  .then(data => {
                        return res.status(200).json({ success: true, data: data, message: "get orders successfully" });
                  })
                  .catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        res.status(500).json({ success: false, error: e, message: "get order failed" });
                  })
      }

      static addOrder(req, res) {
            let userId = req.body.userId;
            let body = req.body;
            let itemName = body.itemName;
            let itemPrice = body.itemPrice;
            let itemQuantity = body.itemQuantity;
            let meetingId = body.meetingId;
            let userName = body.userName;
            let orgName = body.orgName;

            let updatedObj = new Order();

            updatedObj.item_name = itemName;
            updatedObj.item_price = itemPrice;
            updatedObj.item_quantity = itemQuantity;
            updatedObj.user_id = userId;
            updatedObj.meeting_id = meetingId;
            updatedObj.user_name = userName;
            updatedObj.org_name = orgName;
            updatedObj.created_at = new Date().toISOString();
            updatedObj.updated_at = new Date().toISOString();

            // let orderObj = req.body.orderObj;
            updatedObj.save()
                  .then(data => {
                        console.log("order added successfully");
                        res.status(200).json({ success: true, data: data, message: "order added successfully" })
                  })
                  .catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        res.status(500).json({ success: true, error: e, message: "order add error" });
                  })

      }
      static deleteOrder(req, res) {
            // let userId = req.body.userId;
            let body = req.body;
            let meetingId = body.orderId;

            Order.deleteOne({ _id: meetingId })
                  .then(data => {
                        res.status(200).json({ success: true, data: data, message: "order deleted successfully" });
                  })
                  .catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        res.status(500).json({ success: false, error: e, message: "order delete failed" });
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
                              res.status(200).json({ success: true, data: data[lastVisit], message: "get last running visit" });
                        }
                        else
                              res.status(200).json({ success: true, data: null, message: "get no last running visit  " });
                  })
                  .catch(e => {
                        logger.error(e.stack);
                        console.log("e", e);
                        res.status(500).json({ success: false, error: 'something went wrong', message: "get last running visit error" });
                  })

      }

}
