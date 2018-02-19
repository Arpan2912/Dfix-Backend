const User = require('../../model/user-model');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const key = require('../../config/secret.conf');
module.exports = class AuthenticationController {
    static authenticateUser(req, res) {
        console.log("body",req.body)
        let email = req.body.email;
        let password = CryptoJS.MD5(req.body.password).toString();
        User.find({ email: email, password: password })
            .then((user) => {
                let data;
                if (user.length > 0) {
                    let token = jwt.sign({ userId: user[0]._id }, key.secret)
                    data = {
                        userId: user[0]._id,
                        token: token
                    }
                    res.json({ "success": true, data: data });
                } else {
                    res.json({ "success": false, data: "username or password may be incorrect" });
                }
            })
        // .catch(e => {
        //     res.json({"success":false,data:"Please try again later",error:e});
        // })
    }
}