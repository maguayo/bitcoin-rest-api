var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const config = require('../config/config.json');
//var db = require('../models');

router.get('/:addressHash', function(req, res, next) {
	res.send({})
});

module.exports = router;