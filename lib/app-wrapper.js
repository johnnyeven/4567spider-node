var log4js = require('log4js');
log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'file',
        filename: 'logs/request.log',
        category: 'request',
        maxLogSize: 512000000,
        backups:0
    }]
});
var logger = log4js.getLogger('request');
var config = require('../config/app');
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.host + '/' + config.database);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

var needle = require('needle');
needle.get(config.url, function(err, res, body) {
    if(err) {
        logger.error(err.message);
    }
    if(res.statusCode == 200) {
        var cheerio = require('cheerio');
        var $ = cheerio.load(body);
        var id = 1;
        var Category = require('../models/category');
        var EventProxy = require('eventproxy');
        var ep = new EventProxy();
        ep.after('got_category', $("#menu > p.s > a").length, function(results) {
            var parse = require('./parse_category');
            parse(results);
        });
        $("#menu > p.s > a").each(function() {
            var category = new Category({
                id: id,
                url: config.url + $(this).attr('href'),
                name: $(this).text()
            });
            category.save(function(err, doc) {
                if(err) {
                    doc = null;
                    logger.error("写入分类出错(" + $(this).attr('href') + '): ' + err.message);
                }
                ep.emit('got_category', doc);
            });
            ++id;
        });
        //获取分类
    } else {
        logger.warn(config.url + '收到非200响应码 ' + res.statusCode);
    }
});