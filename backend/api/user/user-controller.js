const User = require('../../model/user-model');
const CryptoJS = require("crypto-js");
const key = require("../../config/secret.conf");

module.exports = class UserController {
    static addUser(req, res) {
        let email = req.body.email;
        let user = new User();
        user.email = email;
        user.first_name = null;
        user.last_name = null;
        user.password = null;
        user.phone = null;
        user.created_at = new Date().toISOString();
        user.updated_at = new Date().toISOString();

        User.find({ email: email })
            .then((data) => {
                // console.log("data: : ::", data);
                if (data.length > 0) {
                    return false;
                } else {
                    return user.save()
                }
            })
            .then(data => {
                if (data === false)
                    res.json({ status: false, data: "user already exist" });
                else
                    res.json({ status: true, data: data })
            })
            .catch(e => {

            })
    }

    static updateUser(req, res) {
        let data = req.body;
        let user = {};
        user._id = data._id;
        user.email = data.email;
        user.first_name = (!!data.first_name) ? data.first_name : null;
        user.last_name = (!!data.first_name) ? data.last_name : null;
        user.password = (!!data.password) ? CryptoJS.MD5(data.password, key.secret) : null;
        user.phone = (!!data.password) ? data.password : null;
        user.created_at = new Date().toISOString();
        user.updated_at = new Date().toISOString();

        User.update(user)
            .then((data) => {
                res.json({ success: true, data: data, error: {} })
            })
            .catch(e => {
                res.json({ success: false, error: e, data: {} })
            })
    }

    static getAllUser(req, res) {
        User.find()
            .then(data => {
                res.json({ data: data })
            })
            .catch(e => {
                res.json({ error: e })
            })
    }

    static deleteUser(req, res) {
        User.deleteOne({ _id: req.body._id })
            .then((data) => {
                res.json({ success: true, data: data });
            })
            .catch(e => {
                res.json({success:false,error:e})
            })
    }
}

