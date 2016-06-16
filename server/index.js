var express = require('express');
var app = express();
var static = express.static;
var http = require('http').Server(app);


app.use('/vendor', static('./node_modules'));
app.use('/mdl', static('./node_modules/material-design-lite'));
app.use(static('public'));

app.use('/', require('./router'));
app.use('/', require('./router/workspaceRouter'));

exports.http = http;
exports.app = app;
