const momentTimezone = require('moment-timezone');
const aws = require('aws-sdk');
const env = require(`../constants/${process.env.NODE_ENV}.json`);

module.exports = class Utils {
    static getIndianDayStartTimeInIsoFormat() {
        let indianDate = momentTimezone().tz('Asia/Kolkata');
        indianDate.set('hour', 0);
        indianDate.set('minute', 0);
        indianDate.set('second', 0);
        indianDate.set('millisecond', 0);
        indianDate = indianDate.toISOString();
        // indianDate.set("");
        return indianDate;
    }

    static getIndianDayStartTime(date) {
        let indianDate = momentTimezone(date).tz('Asia/Kolkata');
        indianDate.set('hour', 0);
        indianDate.set('minute', 0);
        indianDate.set('second', 0);
        indianDate.set('millisecond', 0);
        indianDate = indianDate.toISOString();
        // indianDate.set("");
        return indianDate;
    }
    /* 
    let imgData = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                    let imageType = ProductController.extractExtension(image);
    */
    static uploadImageOnAmazonS3(bucketName, fileName, bufferdata, contentType, userId, module) {
        return new Promise((resolve, reject) => {
            let s3 = new aws.S3({
                accessKeyId: '',
                secretAccessKey: '',
                // region:'us-east-1',
            });

            let params = {
                ACL: 'public-read-write',
                Body: bufferdata,
                // Bucket: 'd-fix-test',
                Bucket: env.s3.bucketName,
                Key: `${fileName}`,
                // ServerSideEncryption: null,
                Tagging: "usage=byDeveloper",
                ContentEncoding: 'base64',
                ContentType: contentType,
            };

            // let bucketFolder = `${bucketName}/${userId}`;
            let bucketFolder = `${env.s3.bucketName}/${userId}`;
            let executeUploadOnAmazonS3 = () => {
                s3.upload(params, function (err, result) {
                    if (err) {
                        // throw new Error(err);
                        reject(err);
                    } else {
                        console.log('******** File upload on s3 completed ********', result);
                        resolve(result);
                    }
                });
            };
            executeUploadOnAmazonS3();
        });
    }

    /**
     * extract extension from base64 string
     * @param {string} image 
     */
    static extractExtension(image) {
        var imageString = image.slice(0, 70);
        if (imageString.match(/data:image\/png/)) {
            return "image/png";
        } else if (imageString.match(/data:image\/jpeg/)) {
            return "image/jpeg";
        } else if (imageString.match(/data:image\/gif/)) {
            return "image/gif";
        } else {
            return "image/jpeg";
        }
    }

    static removeQuotes(data) {
        let data_ = data;
        if (!!data_) {
            data_ = data_.replace(/^\'/, '');
            data_ = data_.replace(/\'$/, '');
            data_ = data_.replace(/^'/, '');
            data_ = data_.replace(/'$/, '');
            data_ = data_.replace(/^\"/, '');
            data_ = data_.replace(/\"$/, '');
            data_ = data_.replace(/^"/, '');
            data_ = data_.replace(/"$/, '');
        }
        return data_;
    };

    static prepareFullName(firstName,lastName){
        let name='';
        if(firstName && lastName){
            name = firstName +' '+lastName;
        } else if(firstName){
            name = firstName;
        } else if(lastName){
            name = lastName;
        }
        return name;
    }

}