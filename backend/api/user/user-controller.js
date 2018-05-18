const User = require('../../model/user-model');
const CryptoJS = require("crypto-js");
const key = require("../../config/secret.conf");

module.exports = class UserController {
    static addUser(req, res) {
        console.log("key", key);
        let body = req.body;
        let email = req.body.email;
        let user = new User();
        user.email = email;
        user.first_name = body.firstName;
        user.last_name = body.lastName;
        user.password = null;
        user.address = null;
        user.phone = body.phone;
        user.is_deleted = false;
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
        console.log("req body", data);
        let user = {};
        //user._id = data._id;
        user.phone = data.phone;
        user.first_name = (!!data.firstName) ? data.firstName : null;
        user.last_name = (!!data.lastName) ? data.lastName : null;
        user.password = (!!data.password) ? CryptoJS.MD5(data.password).toString() : null;
        user.email = (!!data.email) ? data.email : null;
        user.address = (!!data.address) ? data.address : null;
        user.updated_at = new Date().toISOString();
        console.log('user', user);
        User.find({ _id: data.userId })
            .update(user)
            .then((result) => {
                console.log(result);
                res.json({ success: true, data: data, error: {} })
            })
            .catch(e => {
                console.log(e);
                res.json({ success: false, error: e, data: {} })
            })
    }

    static getAllUser(req, res) {
        User.find()
            .then(data => {
                res.json([{ data: data }])
            })
            .catch(e => {
                res.json({ error: e })
            })
    }

    static deleteUser(req, res) {
        User.findOneAndUpdate({ _id: req.body.user._id }, { 'is_deleted': true })
            .then(data => {
                console.log("-----------------", data);
                res.json({ success: true, data: data });
            })
            .catch(e => {
                res.json({ success: false, error: e })
            })
    }

    static getUserByEmailId(req, res) {
        let email = req.body.email;
        console.log(email);
        User.find({ email: email })
            .then((data) => {
                console.log(data);
                if (data.length === 0) {
                    res.json({ success: false, message: 'you are not allowed to Use this App' });
                } else {
                    res.json({ success: true, data: data[0] })
                }
            })
            .catch(e => {
                res.json({ success: false, error: e });
            })
    }
    static getUserByPhone(req, res) {
        let phone = req.body.phone;
        console.log(phone);
        User.find({ phone: phone })
            .then((data) => {
                console.log(data);
                if (data.length === 0) {
                    res.json({ success: false, message: 'you are not allowed to Use this App' });
                } else {
                    res.json({ success: true, data: data[0] })
                }
            })
            .catch(e => {
                res.json({ success: false, error: e });
            })
    }

}
