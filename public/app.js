var socket = io();

var serverUpdate = false;
var beforeChange = "";

var myCodeMirror = CodeMirror(document.getElementById("editor"), {
    value: "",
    lineNumbers: true,
    mode: "javascript"
});

var user = {
    name: "",
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
}

socket.on("connect", function() {
//    user.name = socket.id;
//    console.log(socket.id);
});

$("#userName").change(function() {
    user.name = $( this ).val();
});

myCodeMirror.on("cursorActivity", function(inst) {
    socket.emit("clientPosition", {
        "user": user,
        "project": "main",
        "file": "/stuff.txt",
        "line": inst.getCursor().line,
        "column": inst.getCursor().ch
    });
});

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

var cursors = {};
var labels = {};

socket.on("clientPosition", function(position) {
    if (position.user.name !== "" && position.user.name !== user.name) {
        if (cursors[position.user.name]) {
            cursors[position.user.name].remove();
            cursors[position.user.name] = undefined;
            labels[position.user.name].remove();
            labels[position.user.name] = undefined;
        }
        
        var cursorNode = document.createElement("div");
        cursorNode.className = "cursor";
        cursorNode.style.borderColor = position.user.color;
        
        var labelNode = document.createElement("div");
        labelNode.className = "label";
        labelNode.style.backgroundColor = position.user.color;
        
        var text = document.createTextNode(position.user.name);
        labelNode.appendChild(text);
        
        cursors[position.user.name] = cursorNode;
        labels[position.user.name] = labelNode;
        
        myCodeMirror.addWidget({
            line: position.line,
            ch: position.column
        }, cursorNode);
        
        myCodeMirror.addWidget({
            line: position.line,
            ch: position.column
        }, labelNode);
    }
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
        "user": user,
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
