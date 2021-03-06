var fs = require("fs");
var diff = require("diff");

var fileContents = fs.readFileSync('./satellite/LongLiveCHIEF/funky_potatoes/stuff.js', 'utf8');
var socketAPI = function socketAPI(io) {
    io.on('connection', function (socket) {
        console.log(`new client connection: ${socket.client.conn.id}`);
        socket.emit('server change', fileContents);

        socket.on('disconnect', function (msg) {
            console.log("User out...");
        });

        socket.on('chat message', function (msg) {
            io.emit('chat message', msg);
        });

        socket.on('clientDiff', function (msg) {
            try {
                fileContents = diff.applyPatch(fileContents, msg.diff);
            } catch (e) {
                console.log(e);
            }

            io.emit('server change', fileContents);
        });

        socket.on('clientPosition', function (msg) {
            io.emit('clientPosition', msg);
        });
    });

    return io;

}

module.exports = socketAPI;