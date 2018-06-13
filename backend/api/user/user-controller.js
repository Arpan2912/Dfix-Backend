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
                    res.status(409).json({ status: false, data: "user already exist",message:"user already exist" });
                else
                    res.status(200).json({ status: true, data: data ,message:"user added successfully"});
            })
            .catch(e => {
                console.log("e",e);
                res.status(409).json({ status: false, data:null,message:"add user fail" });
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
                res.status(200).json({ success: true, data: data,message:"update user success" });
            })
            .catch(e => {
                console.log(e);
                res.status(500).json({ success: false, error: e, data: null,message:"update user fail" });
            })
    }

    static getAllUser(req, res) {
        User.find()
            .then(data => {
                res.status(200).json({status:true, data: data,message:"get all user success" });
            })
            .catch(e => {
                console.log("e",e);
                res.status(500).json({status:false, error: e,message:"get all user fail"  })
            })
    }

    static deleteUser(req, res) {
        User.findOneAndUpdate({ _id: req.body.user._id }, { 'is_deleted': true })
            .then(data => {
                console.log("-----------------", data);
                res.status(200).json({ success: true, data: data,message:"delete user success"  });
            })
            .catch(e => {
                console.log("e",e);
                res.status(500).json({ success: false, error: e,message:"delete user error"  });
            })
    }

    static getUserByEmailId(req, res) {
        let email = req.body.email;
        console.log(email);
        User.find({ email: email })
            .then((data) => {
                console.log(data);
                if (data.length === 0) {
                    res.status(500).json({ success: false,data:null, message: 'you are not allowed to Use this App' });
                } else {
                    res.status(200).json({ success: true, data: data[0], message: 'user verified successfully'  });
                }
            })
            .catch(e => {
                console.log("e",e);
                res.status(500).json({ success: false, error: e , message: 'user verified fail'  });
            })
    }
    static getUserByPhone(req, res) {
        let phone = req.body.phone;
        console.log(phone);
        User.find({ phone: phone })
            .then((data) => {
                console.log(data);
                if (data.length === 0) {
                    res.status(409).json({ success: false, message: 'you are not allowed to Use this App' });
                } else {
                    res.status(200).json({ success: true, data: data[0],message:"user verified successfully" });
                }
            })
            .catch(e => {
                console.log("e",e);
                res.status(500).json({ success: false, message: e ,message:"user verificatin fail"});
            })
    }

}
