const User = require('../../model/user-model');
const Admin= require('../../model/admin-model');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const key = require('../../config/secret.conf');
module.exports = class AuthenticationController {
  static authenticateUser(req, res) {
    console.log("body", req.body)
    let email = req.body.email;
    let phone = req.body.phone;
    let password = CryptoJS.MD5(req.body.password).toString();
    User.find({
      phone: phone,
        password: password
      })
      .then((user) => {
        let data;
        if (user.length > 0) {
          let token = jwt.sign({
            userId: user[0]._id
          }, key.secret)
          data = {
            userId: user[0]._id,
            userName: user[0].first_name +" "+ user[0].last_name,
            token: token
          }
          res.json({
            "success": true,
            data: data
          });
        } else {
          res.json({
            "success": false,
            data: "username or password may be incorrect"
          });
        }
      })
    // .catch(e => {
    //     res.json({"success":false,data:"Please try again later",error:e});
    // })
  }
  static authenticateAdmin(req, res) {
    let phone = req.body.phone;
    let password = CryptoJS.MD5(req.body.password).toString();
    Admin.find({
      phone: phone,
      password: password
    }).
    then((user) =>{
      let adminDetails;
      if (user.length > 0) {
        let token = jwt.sign({
          userId: user[0]._id
        }, key.secret)
        adminDetails = {
          userId: user[0]._id,
          userName: user[0].first_name+" " + user[0].last_name,
          token: token
        }
        res.json({
          "success": true,
          data: adminDetails
        });
      } else {
        res.json({
          "success": false,
          data: "username or password may be incorrect"
        });
      }
    })
  }
}
