const momentTimezone = require('moment-timezone');
module.exports = class Utils {
    static getIndianDayStartTimeInIsoFormat(){
        let indianDate = momentTimezone().tz('Asia/Kolkata');
        indianDate.set('hour', 0);
        indianDate.set('minute',0);
        indianDate.set('second', 0);
        indianDate.set('millisecond', 0);
        indianDate = indianDate.toISOString();
        // indianDate.set("");
        return indianDate;
    }
}