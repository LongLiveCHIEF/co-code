var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get("/", function (req, res) {
    res.sendfile('public/index.html');
});

io.on('connection', function(socket) {
    socket.on('disconnect', function(msg) {
        console.log("User out...");
    });
    
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
});

http.listen(8080, function() {
    console.log("On 8080...");
});