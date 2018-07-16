var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var bitcoin_rpc = require('node-bitcoin-rpc');
const config = require('../config/config.json');
//var db = require('../models');

router.get('/:txID', function(req, res, next) {
	bitcoin_rpc.init(config.btc.host, config.btc.port, config.btc.username, config.btc.password)
    bitcoin_rpc.call('getrawtransaction', [req.params.txID], function (err, resp) {
        if (err !== null) {
            res.send({"success": false, "error": err});
        } else {
            raw_tx = resp.result
            bitcoin_rpc.call('decoderawtransaction', [raw_tx], function (err, resp) {
		        if (err !== null) {
		            res.send({"success": false, "error": err});
		        } else {
		        	tx = resp.result
		        	tx['raw'] = raw_tx;
		            res.send({"success": true, "result": tx})
		        }
		    });
        }
    });
});
 
module.exports = router;