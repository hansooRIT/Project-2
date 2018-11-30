const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getTasks', mid.requiresLogin, controllers.Task.getTasks);
  app.get('/getCurrentTasks', mid.requiresLogin, controllers.Task.getCurrentTasks);
  app.get('/getCompletedTasks', mid.requiresLogin, controllers.Task.getCompletedTasks);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Task.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Task.make);
  app.get('/accountSettings', mid.requiresLogin, controllers.Account.accountSettingsPage);
  app.post('/premium', mid.requiresLogin, controllers.Account.setPremium);
  app.get('/friendTasks', mid.requiresLogin, controllers.Account.friendTasksPage);
  app.post('/friendSearch', mid.requiresLogin, controllers.Account.friendSearch);
  app.get('/getFriendTasks', mid.requiresLogin, controllers.Task.getFriendTasks);
  app.post('/passwordChange', mid.requiresLogin, controllers.Account.passwordChange);
  app.delete('/deleteNode', mid.requiresLogin, controllers.Task.deleteNode);
  app.post('/completeNode', mid.requiresLogin, controllers.Task.completeNode);
  app.post('/sendEmail', mid.requiresLogin, controllers.Account.sendEmail);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
