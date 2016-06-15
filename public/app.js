var socket = io();

var serverUpdate = false;
var beforeChange = "";

var myCodeMirror = CodeMirror(document.getElementById("editor"), {
    value: "",
    lineNumbers: true,
    mode: "javascript"
});

var luma = function(c) {
    if (!c) {
        return 100;
    }
    var c = c.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return luma;
}

var stringToColour = function(str) {

    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 20) & 0xFF).toString(16)).slice(-2));

    return colour;
}

var user = {
    name: "",
    color: "#ffff80"
}

socket.on("connect", function() {
//    user.name = socket.id;
//    console.log(socket.id);
});

$("#userName").change(function() {
    user.name = $( this ).val();
    console.log(stringToColour(user.name));
    user.color = stringToColour(user.name);
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
        labelNode.style.color = buildNiceStyle(position.user.color).foreColor;
        labelNode.style.backgroundColor = buildNiceStyle(position.user.color).backColor;
        
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
    socket.emit('chat message', {
        user: user,
        message: $('#m').val()
    });
    
    $('#m').val('');

    return false;
});

function buildNiceStyle(backColor) {
    var foreColor = "#000";
    if (luma(backColor) < 50) {
        foreColor = "#fff";
    }
    
    return {
        style: "color: " + foreColor + "; background-color: " + backColor,
        foreColor: foreColor,
        backColor: backColor
    };
}

socket.on('chat message', function (msg) {
    var li = $('<li>');
    
    li.append($('<span>').attr("style", buildNiceStyle(msg.user.color).style + "; padding: 5px;").text(msg.user.name));
    li.append($('<span>').text(" " + msg.message));
    
    $('#messages').append(li);
});
