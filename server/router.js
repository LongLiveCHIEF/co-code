var {Router, static} = require('express');
var router = Router();
var path = require('path');

router.use('/', static(path.join(__dirname, '../public')));

module.exports = router;
