var {http, app} = require('./server/server');

http.listen(8080, function () {
    console.log("On 8080...");
});
