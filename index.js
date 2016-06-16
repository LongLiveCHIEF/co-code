var {http, app} = require('./server');
var socketAPI = require('./server/socket');
var io = require('socket.io')(http);
var homeRouter = require('./server/router');
socketAPI(io);


http.listen(8080, function () {
    console.log("On 8080...");
});
