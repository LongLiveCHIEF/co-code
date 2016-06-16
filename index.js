var {http, app} = require('./server/server');
var socketAPI = require('./server/socket')(http);

http.listen(8080, function () {
    console.log("On 8080...");
});
