var socketAPI = function socketAPI(io) {
var fileContents = "stuff";
    io.on('connection', function (socket) {
        console.log(`new client connection: ${socket.client.conn.id}`);
        socket.emit('server change', fileContents);

        socket.on('disconnect', function (msg) {
            console.log("User out...");
        });

        socket.on('chat message', function (msg) {
            socket.emit('chat message', msg);
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
<<<<<<< b33e63d668aa426a09687aefb52e7afb71cf5b22
=======

        setInterval(function () {
            socket.emit('server change', fileContents);
        }, 5000);
>>>>>>> restructure io.Manager
    });

    return io;

}

module.exports = socketAPI;
