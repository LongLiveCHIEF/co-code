var {Router, static} = require('express');
var router = Router();
var path = require('path');
var publicPath= path.join(__dirname, '../../public');
console.log(`public path: ${publicPath}`);

router.use('/css', static(publicPath));
router.use('/js', static(publicPath));

router.param('username', function(req, res, next, id){
  req.username = id;
  next();
});

router.param('projectname', function(req, res, next, id){
  req.projectname = id;
  next();
});
router.get('/:username/:projectname', function(req, res){
  res.send(`${req.username}\r\n${req.projectname}`);
})


module.exports = router;
