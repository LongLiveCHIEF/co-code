var diff = require('diff');

function socketAPI(http) {
    var fileContents = "This is a file\nWe should change it\nThis is a third line";

    var io = require('socket.io')(http);
    io.on('connection', function (socket) {
        console.log("User in...");
        socket.emit('server change', fileContents);

        socket.on('disconnect', function (msg) {
            console.log("User out...");
        });

        socket.on('chat message', function (msg) {
            socket.emit('chat message', msg);
        });

        socket.on('clientDiff', function (msg) {
            fileContents = diff.applyPatch(fileContents, msg.diff);
        });

        socket.on('clientPosition', function (msg) {
            socket.emit('clientPosition', msg);
        });
        
        setInterval(function () {
            socket.emit('server change', fileContents);
        }, 5000);
    });

}

module.exports = socketAPI;
