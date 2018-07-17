var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
//var db = require('../models');
var moment = require('moment');
var bitcoin_rpc = require('node-bitcoin-rpc');
var async = require('async');
const config = require('../config/config.json');

router.get('/', function(req, res, next) {

	bitcoin_rpc.init(config.btc.host, config.btc.port, config.btc.username, config.btc.password)

	bitcoin_rpc.call('getchaintips', [], function (err, resp) {
		if (err !== null) {
			res.send({"success": false, "error": err});
		} else {

			var actual_height = resp.result[0].height;
			var blocks_per_page = 10;
			var page = 1;
			var blocks = [];
			var list_elems = [
				actual_height,
				actual_height-1,
				actual_height-2,
				actual_height-3,
				actual_height-4,
				actual_height-5,
				actual_height-6,
				actual_height-7,
				actual_height-8,
				actual_height-9,
			]

			if(req.query.page){
				page = parseInt(req.query.page)
			}

			get_latest_hashes(bitcoin_rpc, list_elems).then(function(result) {
				console.log("====")
				console.log(result)
				console.log("====")
				console.log("")
				get_latest_block_info(bitcoin_rpc, result).then(function(result){
					console.log("----")
					console.log(result)
					res.send({"success": true, "result": result})
					console.log("====")
				}).catch(function(err){
					console.log(err);
				});
			}).catch(function(err){
				console.log(err);
			});

		}
	})
});


function get_latest_hashes(bitcoin_rpc, list_elems){
    return new Promise(function(resolve, reject) {
    	// Do async job
        var blocks = [];
		for(var i = 0; i<list_elems.length; i++){
			bitcoin_rpc.call('getblockhash', [list_elems[i]], function (err, resp) {
				if (err) {
					reject(err);
				} else {
					blocks.push(resp.result);
					if(blocks.length == list_elems.length){
						resolve(blocks);
					}
				}
			})
		}
    })
}


function get_latest_block_info(bitcoin_rpc, list_hashes){
	return new Promise(function(resolve, reject) {
    	// Do async job
        var blocks = [];
		for(var i = 0; i<list_hashes.length; i++){
			bitcoin_rpc.call('getblock', [list_hashes[i]], function (err, resp) {
				if (err) {
					reject(err);
				} else {
					elem = resp.result;
					elem['tx_num'] = resp.result.tx.length;
					delete elem['tx'];
					blocks.push(elem);
					if(blocks.length == list_hashes.length){
						resolve(blocks);
					}
				}
			})
		}
    })
}




router.get('/:hashOrHeigth', function(req, res, next) {

	var hashOrHeigth = req.params.hashOrHeigth;
	var is_heigth = !isNaN(hashOrHeigth);

	bitcoin_rpc.init(config.btc.host, config.btc.port, config.btc.username, config.btc.password)

	if(hashOrHeigth.length == 64){
		is_heigth = false;
	}

	if(!is_heigth && hashOrHeigth.length != 64){
		res.send({"success": false, "msg": "Invalid block hash."})
	}

	if(is_heigth){
		bitcoin_rpc.call('getblockhash', [parseInt(hashOrHeigth)], function (err, resp) {
			if (err) {
				res.send({"success": false, "msg": "Can't get the block hash.", "err": err})
			} else {
				console.log(resp.result)
				bitcoin_rpc.call('getblock', [resp.result], function (err, resp) {
					if (err) {
						res.send({"success": false, "msg": "Can't get the block info.", "err": err})
					} else {
						console.log(resp)
						res.send({"success": true, "result": resp.result})
					}
				})
			}
		})
	}else{
		bitcoin_rpc.call('getblock', [hashOrHeigth], function (err, resp) {
			if (err) {
				res.send({"success": false, "msg": "Can't get the block info.", "err": err})
			} else {
				console.log(resp)
				res.send({"success": true, "result": resp.result})
			}
		})
	}

});

module.exports = router;