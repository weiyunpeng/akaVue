var express = require("express");
var controller = require('./crowd.controller');
var router = express.Router();

router.all('/get_appinfo', controller.get_appinfo);

router.all('/addCrowd', controller.addCrowd);

module.exports = router;