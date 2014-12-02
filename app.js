var request = require('request');

request('http://www.4567.tv/html/1.html', function(err, res, body) {
    if(err) {
        return console.log(err);
    }
    if(res.statusCode == 200) {
        var cheerio = require('cheerio');
        $ = cheerio.load(body);
        $('div.movielist > ul.img-list > li').each(function() {
            var a = $(this).find('a');
            var img = a.find('img');
            console.log(a.attr('href'));
            console.log(img.attr('src'));
        });
    }
});