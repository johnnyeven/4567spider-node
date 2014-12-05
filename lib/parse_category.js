var needle = require('needle');
var log4js = require('log4js');
var logger = log4js.getLogger('request');
var container = [];
var categories = [];
var pics = [];
var index = 0;
function do_cat() {
    if(index < categories.length) {
        item = categories[index];
        logger.info('开始获取 ' + item.name);
        parse(item.url, item.id, function(err, info) {
            if(err) {
                logger.error(err.message);
            }
            ep.emit('got_categories', info);
        });
        ++index;
    }
}

var parse = function(url, cid, callback) {
    needle.get(url, function(err, res, body) {
        if(err) {
            return callback(err, null);
        }
        if(res.statusCode == 200) {
            var cheerio = require('cheerio');
            $ = cheerio.load(body);

            $('div.movielist > ul.img-list > li').each(function() {
                var a = $(this).find('a');
                var img = a.find('img');
                var item = {
                    href: a.attr('href'),
                    img: img.attr('src')
                };
                container.push(item);
            });

            var last_page = $('#pages > a').last();
            last_page = last_page.attr('href').match(/\d+\./g)[0];
            last_page = parseInt(last_page.slice(0, last_page.length - 1));
            if(last_page > 0) {
                var EventProxy = require('eventproxy');
                var ep = new EventProxy();
                var timer;
                ep.after('got_page', last_page - 1, function(results) {
                    logger.info('Total movies: ' + container.length);
                    var parser = require('./parse_movie');
                    clearInterval(timer);
                    parser(container, cid, function(pic) {
                        pics = pics.concat(pic);
                        do_cat();
                    });
                });

                var page_url, i = 2;
                timer = setInterval(function() {
                    if(i <= last_page) {
                        page_url = url.replace(/(\d+).html/, '$1_' + i + '.html');
                        needle.get(page_url, function(err, res, body) {
                            if(err) {
                                logger.error(err.message);
                                return ep.emit('got_page', null);
                            }
                            if(res.statusCode == 200) {
                                $ = cheerio.load(body);
                                $('div.movielist > ul.img-list > li').each(function() {
                                    var a = $(this).find('a');
                                    var img = a.find('img');
                                    var item = {
                                        href: a.attr('href'),
                                        img: img.attr('src')
                                    };
                                    container.push(item);
                                });
                                ep.emit('got_page', null);
                            }
                        });
                        ++i;
                    }
                }, 100);
            }
        }
    });
};

module.exports = function(container) {
    categories = container;
    var EventProxy = require('eventproxy');
    var ep = new EventProxy();
    ep.after('got_categories', categories.length, function(results) {
        logger.info('all done');

        for(var i = 0; i < pics.length; ++i) {
            needle.get(pics[i], {output: 'pic/' + pics[i].match(/\d+\.jpg/g)[0]})
        }

        process.exit(0);
    });

    do_cat();
};