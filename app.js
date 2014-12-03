var request = require('request');
var log4js = require('log4js');
log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'file',
        filename: 'logs/request.log',
        category: 'request'
    }],
    replaceConsole: true
});
var logger = log4js.getLogger('request');
var container = [];

//request('http://www.4567.tv/html/1.html', function(err, res, body) {
//    if(err) {
//        return console.log(err);
//    }
//    if(res.statusCode == 200) {
//        var cheerio = require('cheerio');
//        $ = cheerio.load(body);
//
//        $('div.movielist > ul.img-list > li').each(function() {
//            var a = $(this).find('a');
//            var img = a.find('img');
//            var item = {
//                href: a.attr('href'),
//                img: img.attr('src')
//            };
//            container.push(item);
//        });
//
//        var last_page = $('#pages > a').last();
//        last_page = last_page.attr('href').match(/\d+\./g)[0];
//        last_page = parseInt(last_page.slice(0, last_page.length - 1));
//        if(last_page > 0) {
//            var EventProxy = require('eventproxy');
//            var ep = new EventProxy();
//            ep.after('got_page', last_page - 1, function(results) {
//                console.log(container.length);
//            });
//
//            var url;
//            for(var i = 2; i <= last_page; ++i) {
//                url = 'http://www.4567.tv/html/1_' + i + '.html';
//                request(url, function(err, res, body) {
//                    if(res.statusCode == 200) {
//                        $ = cheerio.load(body);
//                        $('div.movielist > ul.img-list > li').each(function() {
//                            var a = $(this).find('a');
//                            var img = a.find('img');
//                            var item = {
//                                href: a.attr('href'),
//                                img: img.attr('src')
//                            };
//                            container.push(item);
//                        });
//                        ep.emit('got_page', null);
//                    }
//                });
//            }
//        }
//    }
//});

var parser = require('./lib/parse_movie');
parser('http://www.4567.tv/film/id9235.html', function(err, info) {
    console.log(info);
});