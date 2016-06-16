var {Router, static} = require('express');
var workspaceRouter = Router();
var path = require('path');
var publicPath = path.join(__dirname, '../../public');

workspaceRouter.param('username', function(req, res, next, id){
  req.username = id;
  next();
});

workspaceRouter.param('projectname', function(req, res, next, id){
  req.projectname = id;
  next();
});
workspaceRouter.use('/:username/:projectname', function(req, res, next){
  console.log(req.projectname)
  next();
});

workspaceRouter.get('/:username/:projectname', function(req, res){
  res.sendFile(publicPath + '/index.html');
});



module.exports = workspaceRouter;
