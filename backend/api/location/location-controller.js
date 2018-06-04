const Location = require('../../model/location-model');

module.exports = class LocationController {

    static addOrUpdateUserLocation(req, res) {
        let body = req.body;
        let userId = body.userId;
        let userName = body.userName;
        let location = body.location;
        let currentLocation = body.currentLocation;
        let id = body.id;
        console.log("id ------------> ",id);
        let obj = new Location();
        if (id) {
            obj._id = id;
        }
        obj.user_id = userId;
        obj.user_name = userName;
        obj.location = location;
        obj.current_location = currentLocation;
        obj.created_at = new Date().toISOString();
        obj.updated_at = new Date().toISOString();

        if (id) {
            let obj = {};
            if (id) {
                obj._id = id;
            }
            obj.user_id = userId;
            obj.location = location;
            obj.current_location = currentLocation;
            obj.created_at = new Date().toISOString();
            obj.updated_at = new Date().toISOString();
            Location.findOneAndUpdate({ _id: id }, obj,{new:true})
                .then(data => {
                    console.log(data);
                    res.send({success:true,data:data});
                })
                .catch(e => {
                    res.send({success:false,data:e});
                })
        } else {
            let obj = new Location();

            obj.user_id = userId;
            obj.user_name =userName;
            obj.location = location;
            obj.current_location = currentLocation;
            obj.created_at = new Date().toISOString();
            obj.updated_at = new Date().toISOString();
            obj.save()
                .then(data => {
                    res.send({success:true,data:data});
                })
                .catch(e => {
                    res.send({success:false,data:e});
                })
        }

    }
    static getCurrentLocation(req,res){
      Location.find().then(data=>{
        return  res.json([{"success":true,"data":data}]);
      }).catch(e=>{
        return res.json({success:false,data:e})
      })
    }
    static getLocation(req,res){
      console.log(req.body);
      Location.find({"user_id":req.body._id}).then(data=>{
        console.log(data);
        return res.json({"success":true,"data":data});
      }).catch(e=>{
        return res.json({success:false,data:e});
      })
    }

}
