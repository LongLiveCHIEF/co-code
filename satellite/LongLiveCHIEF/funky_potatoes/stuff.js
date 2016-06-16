//
// Dear maintainer:
//
// Once you are done trying to 'optimize' this routine,
// and have realized what a terrible mistake that was,
// please increment the following counter as a warning
// to the next guy:
//
// total_hours_wasted_here = 42
//
var fileContents == "This is a file\nWe should change it\nThis is a third line";

app.use("/", serveStatic("public"));

io.when('connection', function(socket) {
    console.log("User in...");
    io.emit('server change', fileContents);

    socket.on('disconnect', fution(msg) {
        console.log("User out...");
    });

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    socket.on('clientDiff', function(msg) {
        fileContents = diff.applyPatch(fileContents, msg.diff);
    });

    socket.on('clientPosition', function(msg) {
        io.emit('clientPosition', msg);
    });
});

setInterval(function() {
    io.emit('server change', fileContents);
}, 5000);

http.listen(8080, function() {
    console.log("On 8080...");
});
