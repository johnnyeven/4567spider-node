var log4js = require('log4js');
var logger = log4js.getLogger('request');
var count = 0;
var parse = function(url, cid, callback) {
    var needle = require('needle');
    needle.get(url, function(err, res, body) {
        if(err) {
            return callback(err);
        }
        if(res.statusCode == 200) {
            var cheerio = require('cheerio');
            var $ = cheerio.load(body);
            var info = {};
            info.category = cid;
            info.url = url;
            info.pic = $('div.pic > img').attr('src');
            info.pic_name = info.pic.match(/\d+\.jpg/);
            info.id = url.match(/\d+\.html/)[0];
            info.id = info.id.slice(0, info.id.length - 5);
            info.name = $('div.info > h1').text();
            var infos = $('div.info > ul > li');
            info.types = [];
            infos.eq(1).find('a').each(function() {
                info.types.push($(this).text());
            });
            info.performers = [];
            infos.eq(2).find('a').each(function() {
                info.performers.push($(this).text());
            });
            info.area = infos.eq(3).text();
            info.update = infos.eq(4).text();
            info.content = $('#main div.mox').last().find('div.endtext').text();

            //获取下载地址
            info.downlist = [];
            var GvodUrls;
            eval($('#main div.mox').find('div.downlist > script').eq(1).html());
            if(GvodUrls) {
                var GvodUrlArray = GvodUrls.split("###");
                var inc = require('./inc');
                info.downlist = inc.get_movie_info(GvodUrlArray);
            }
            var Movie = require('../models/movie');
            var movie = new Movie(info);
            movie.save(function(err) {
                if(err) {
                    logger.error(err.message);
                } else {
                    logger.info(++count + ' - ' + movie.name);
                }
            });
            return callback(null, info.pic);
        }
        return callback(null, null);
    });
};

module.exports = function(container, cid, callback) {
    var EventProxy = require('eventproxy');
    var ep = new EventProxy();
    var timer;
    ep.after('got_movie', container.length, function(results) {
        logger.info('got_movie done');
        callback(results);
        count = 0;
        container.splice(0, container.length);
        clearInterval(timer);
    });

    var i = 0;
    timer = setInterval(function() {
        if(i < container.length) {
            var item = container[i];
            parse('http://www.4567.tv' + item.href, cid, function(err, info) {
                if(err) {
                    logger.error(err.message);
                }
                ep.emit('got_movie', info);
            });
            ++i
        }
    }, 150);
};