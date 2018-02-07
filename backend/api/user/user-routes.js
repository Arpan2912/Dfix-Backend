
module.exports = class UserRoutes {
    static init(router) {
        router
            .route('/api/user')
            .get((req,res)=>{
                res.send("Ok");
            });
    }
}