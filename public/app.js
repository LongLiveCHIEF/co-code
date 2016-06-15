var serverUpdate = false;
var beforeChange = "";

var myCodeMirror = CodeMirror(document.getElementById("editor"), {
    value: "",
    lineNumbers: true,
    mode: "javascript"
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
    socket.emit("client change", diff);
});

var socket = io();
$('form').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');

    return false;
});
socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});
socket.on('server change', function (msg) {
    serverUpdate = true;

    myCodeMirror.setValue(msg);
    serverUpdate = false;
});
