var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appInfoSchema = new Schema({
	ObjectId:{
		type: Schema.Types.ObjectId,
		ref:'appinfo'
	},
	description: String,
	name: String,
	crowd: {
        type:Array
    },
	status:{ type :Number, default:0 },
	created: { type: Date, default: Date.now }
});

var Appinfo = mongoose.model('Appinfo', appInfoSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Appinfo);
Promise.promisifyAll(Appinfo.prototype);

module.exports = Appinfo;