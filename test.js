var needle = require('needle');
var url = 'http://183.60.255.75:8088/UserAgent_zhanshen/websrv/servers/server_list';

var count = 0;
var result = 0;
var timer = setInterval(function() {
    needle.post(url, null, function(err, res, body) {
        if(err) {
            return console.log(err.message);
        }
        if(res.statusCode == 200) {
            result++;
            console.log("发送 " + count + ' 次，接收 ' + result + ' 次');
        }
    });
    count++;
}, 1000);