var express = require('express');
var app = express();
var http = require('http').Server(app);
var router = require('./router');
var socketAPI = require('./socket')(http);
app.use("/", router);

app.use('/vendor', express.static('./node_modules'));
app.use('/mdl', express.static('./node_modules/material-design-lite'));


module.exports.http = http;
module.exports.app = app;
