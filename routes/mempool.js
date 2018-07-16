var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var bitcoin_rpc = require('node-bitcoin-rpc');
const config = require('../config/config.json');
//var db = require('../models');

router.get('/', function(req, res, next) {

    bitcoin_rpc.init(config.btc.host, config.btc.port, config.btc.username, config.btc.password)
    var result = {};

    bitcoin_rpc.call('getmempoolinfo', [], function (err, resp) {
        if (err !== null) {
            res.send({"success": false, "error": err});
        } else {
            result = resp.result
            bitcoin_rpc.call('getrawmempool', [], function (err, resp) {
                if (err !== null) {
                    res.send({"success": false, "error": err});
                } else {
                    result['txs'] = resp.result
                    res.json({"success": true, "result": result})
                }
            });
        }
    });

})

module.exports = router;