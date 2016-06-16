var {Router, static} = require('express');
var router = Router();
var path = require('path');
var publicPath= path.join(__dirname, '../../public');
console.log(`public path: ${publicPath}`);

router.use('/css', static(publicPath));
router.use('/js', static(publicPath));
router.use(require('./workspaceRouter'));
router.get('/', static(publicPath + '/index.html'));


module.exports = router;
