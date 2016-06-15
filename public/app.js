var socket = io();

var serverUpdate = false;
var beforeChange = "";

var myCodeMirror = CodeMirror(document.getElementById("editor"), {
    value: "",
    lineNumbers: true,
    mode: "javascript"
});

socket.on("connect", function() {
//    console.log(socket.id);
});

myCodeMirror.on("cursorActivity", function(inst) {
    socket.emit("clientPosition", {
        "user": socket.id,
        "project": "main",
        "file": "/stuff.txt",
        "line": inst.getCursor().line,
        "column": inst.getCursor().ch
    });
});

myCodeMirror.on("beforeChange", function(inst, change) {
    beforeChange = myCodeMirror.getValue();
});

myCodeMirror.on("change", function(inst, change) {
    if (serverUpdate) {
        return;
    }

    var afterChange = myCodeMirror.getValue();
    var diff = JsDiff.createPatch("stuff.txt", beforeChange, afterChange);
    socket.emit("clientDiff", {
        "user": socket.id,
        "project": "main",
        "file": "/stuff.txt",
        "diff": diff
    });
});

socket.on('server change', function (msg) {
    serverUpdate = true;
    if (myCodeMirror.getValue() !== msg) {
        var position = myCodeMirror.getCursor();
        myCodeMirror.setValue(msg);
        myCodeMirror.setCursor(position);
    }
    serverUpdate = false;
});



$('form').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');

    return false;
});
socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});
