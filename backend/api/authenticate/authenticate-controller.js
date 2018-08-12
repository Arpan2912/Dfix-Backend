const User = require('../../model/user-model');
const Admin = require('../../model/admin-model');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const key = require('../../config/secret.conf');
const logger = require('../../config/winston');

module.exports = class AuthenticationController {
  static authenticateUser(req, res) {
    console.log("body", req.body)
    let email = req.body.email;
    let phone = req.body.phone;
    let password = CryptoJS.MD5(req.body.password).toString();
    User.find({
      phone: phone,
      password: password
    }).then((user) => {
        let data;
        if (user.length > 0) {
          let token = jwt.sign({
            userId: user[0]._id
          }, key.secret)
          data = {
            userId: user[0]._id,
            userName: user[0].first_name + " " + user[0].last_name,
            token: token
          }
          res.status(200).json({
            "success": true,
            data: data,
            msg: "user verified"
          });
        } else {
          res.status(409).json({
            "success": false,
            data: "username or password may be incorrect",
            message: "username or password may be incorrect"
          });
        }
      }).catch(e=>{
        console.log("e", e);
        logger.error(e.stack);
        res.status(500).json({
          success: false,
          data: "internal server error",
          message: "internal server error"
        });
      })
    // .catch(e => {
    //     res.json({"success":false,data:"Please try again later",error:e});
    // })
  }
  static authenticateAdmin(req, res) {
    let email = req.body.email;
    let password = CryptoJS.MD5(req.body.password).toString();
    Admin.find({
      email: email,
      password: password
    }).then((user) => {
      let adminDetails;
      if (user.length > 0) {
        let token = jwt.sign({
          userId: user[0]._id
        }, key.secret)
        adminDetails = {
          userId: user[0]._id,
          userName: user[0].first_name + " " + user[0].last_name,
          token: token
        }
        res.json({
          success: true,
          data: adminDetails,
          message: "admin logged successfully"
        });
      } else {
        res.status(409).json({
          success: false,
          data: "username or password may be incorrect",
          message: "username or password may be incorrect"
        });
      }
    }).catch(e => {
      logger.error(e.stack);
      console.log("e", e);
      res.status(500).json({
        success: false,
        data: "internal server error",
        message: "internal server error"
      });
    })
  }
}
