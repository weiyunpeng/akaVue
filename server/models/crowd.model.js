var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CrowdSchema = new Schema({
	ObjectId:{
		type: Schema.Types.ObjectId,
		ref:'crowd'
	},
	crowd_name: String,
	crowd_id: String,
	people_name: String,
	people_id : String,
	tip: String,
	status:{ type :Number, default:0 },
	created: { type: Date, default: Date.now }
});

var Crowd = mongoose.model('Crowd', CrowdSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Crowd);
Promise.promisifyAll(Crowd.prototype);

module.exports = Crowd;