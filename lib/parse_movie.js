var parse = function(url, callback) {
    var needle = require('needle');
    needle.get(url, function(err, res, body) {
        if(err) {
            return callback(err);
        }
        if(res.statusCode == 200) {
            var cheerio = require('cheerio');
            var $ = cheerio.load(body);
            var info = {};
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
            count++;
            console.log(count);
            return callback(null, info);
        }
        count++;
        console.log(count);
        return callback(null, null);
    });
};
var count = 0;
module.exports = function(container) {
    var EventProxy = require('eventproxy');
    var ep = new EventProxy();
    ep.after('got_movie', container.length, function(results) {
        console.log('done');
    });

    for(var i = 0; i<container.length; ++i) {
        var item = container[i];
        console.log('http://www.4567.tv' + item.href);
        parse('http://www.4567.tv' + item.href, function(err, info) {
            ep.emit('got_movie', info);
        });
    }
};

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
};