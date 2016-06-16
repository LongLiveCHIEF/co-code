var {http, app} = require('./server/server');
var socketAPI = require('./server/socket');
var io = require('socket.io')(http);
socketAPI(io);

http.listen(8080, function () {
    console.log("On 8080...");
});
