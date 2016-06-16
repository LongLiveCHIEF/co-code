var express = require('express');
var app = express();
var diff = require('diff');
var router = require('./router');
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var fileContents = "This is a file\nWe should change it\nThis is a third line";

app.use("/", router);

app.use('/vendor', express.static('./node_modules'));
app.use('/mdl', express.static('./node_modules/material-design-lite'));

io.on('connection', function (socket) {
    console.log("User in...");
    io.emit('server change', fileContents);

    socket.on('disconnect', function (msg) {
        console.log("User out...");
    });

    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });

    socket.on('clientDiff', function (msg) {
        fileContents = diff.applyPatch(fileContents, msg.diff);
    });

    socket.on('clientPosition', function (msg) {
        io.emit('clientPosition', msg);
    });
});

setInterval(function () {
    io.emit('server change', fileContents);
}, 5000);

module.exports.http = http;
module.exports.app = app;
