module.exports = function(url, callback) {
    var request = require('request');
    request(url, function(err, res, body) {
        if(err) {
            return callback(err);
        }
        if(res.statusCode == 200) {
            var Buffer = require('buffer').Buffer;
            var iconv = require('iconv-lite');
            iconv.extendNodeEncodings();
            var cheerio = require('cheerio');
            body = iconv.decode(new Buffer(body, 'gbk'), 'utf-8');
            var $ = cheerio.load(body);
            var info = {};
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
            return callback(null, info);
        }
        return callback(null, null);
    });
};