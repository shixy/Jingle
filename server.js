var connect = require('connect');
var path = require('path');
var app = connect().use(connect.static(path.join(__dirname, "sample"))).listen(3000);
console.log("Jingle is running at http://localhost:3000")