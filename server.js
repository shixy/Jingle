/**
 * 使用nodejs来实现本地开发环境的跨域请求转发，发布为手机应用后通过phonegap的白名单机制来实现跨域
 * User: walker
 * Date: 12-8-29
 * Time: 上午9:44
 */
var http = require('http');
var path = require('path');
var urlparse = require('url').parse;
var connect = require('connect');

var app = connect();
app.use("/proxy", function (req, res) {
    var url = req.url.substr(5);
    var target = urlparse(url);
    var headers = {};
    for (var k in req.headers) {
        if (k === 'host' || k === 'connection') {
            continue;
        }
        headers[k] = req.headers[k];
    }
    console.log(url);
    console.log(target.path);
    var options = {
        host: target.hostname,
        port: target.port || 80,
        path: target.path,
        method: req.method,
        headers: headers
    };

    var proxyReq = http.request(options, function (response) {
        res.writeHead(response.statusCode, response.headers);
        response.on('data', function (chunk) {
            res.write(chunk);
        });
        response.on('end', function () {
            res.end();
        });
    });

    proxyReq.on('error', function (err) {
        proxyReq.abort();
        res.writeHead(500);
        res.end(url + ' error: ' + err.message);
    });

    req.on('data', function (chunk) {
        proxyReq.write(chunk);
    });
    req.on('end', function () {
        proxyReq.end();
    });
});

app.use(connect.static(path.join(__dirname, "demo"), { maxAge: 0 }));


app.listen(3000);
console.log("Server is launching at http://localhost:3000");