var connect = require('connect');
var app = connect().use(connect.static('sample')).listen(3000);
console.log("Jingle is running at http://localhost:3000")