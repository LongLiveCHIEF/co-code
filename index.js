var express = require('express');
var app = express();
var serveStatic = require('serve-static');

app.use("/vendor", serveStatic("node_modules"));

var http = require('http').Server(app);
var io = require('socket.io')(http);

var fileContents = "This is a file\nWe should change it";


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
    
    socket.on('incoming change', function(msg) {
        console.log(msg);
        // Update the file here
        //io.emit('outgoing change', fileContents);
    });
});

setInterval(function() {
    io.emit('outgoing change', fileContents);
}, 3000);

http.listen(8080, function() {
    console.log("On 8080...");
});