var express = require('express');
var request = require('request');
var router = express.Router();
var Sequelize = require('sequelize');
var bitcoin_rpc = require('node-bitcoin-rpc')
//var db = require('../models');
const config = require('../config/config.json');


router.get('/', function(req, res, next) {
	bitcoin_rpc.init(config.btc.host, config.btc.port, config.btc.username, config.btc.password)
	var result = {};

	bitcoin_rpc.call('getblockchaininfo', [], function (err, resp) {
		if (err !== null) {
			res.send({"success": false, "error": err});
		} else {
			result['getblockchaininfo'] = resp.result;
			bitcoin_rpc.call('getnetworkinfo', [], function (err, resp) {
				if (err !== null) {
					res.send({"success": false, "error": err});
				} else {
					result['getnetworkinfo'] = resp.result;
					bitcoin_rpc.call('getnettotals', [], function (err, resp) {
						if (err !== null) {
							res.send({"success": false, "error": err});
						} else {
							result['getnettotals'] = resp.result;
							res.send({"success": true, "result": result});
						}
					})
				}
			})
		}
	})
});


module.exports = router;