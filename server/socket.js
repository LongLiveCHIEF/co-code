var diff = require('diff');

function socketAPI(http){

  var io = require('socket.io')(http);
  var fileContents = "This is a file\nWe should change it\nThis is a third line";
    io.on('connection', function (socket) {
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
}

module.exports = socketAPI;
