const models = require('../models');
const Account = models.Account;

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// set of 3 functions for rendering the handlebars pages with the csrf token.
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const accountSettingsPage = (req, res) => {
  res.render('accountSettings', { csrfToken: req.csrfToken() });
};

const friendTasksPage = (req, res) => {
  res.render('friendTasks', { csrfToken: req.csrfToken() });
};

// Login method to access the app. Redirects to main app page on success.
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// Method to create an account.
// Has to make sure to encrypt the password that the user provides for safety.
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.email = `${req.body.email}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.email || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      email: req.body.email,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

// Method to change an account's password.
// Checks if the provided parameters are valid, then sends to model to set the new password.
const passwordChange = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.oldPass = `${req.body.oldPass}`;
  req.body.pass1 = `${req.body.pass1}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.oldPass || !req.body.pass1 || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  if (req.body.pass1 !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match!' });
  }

  const username = `${req.body.username}`;
  const oldPass = `${req.body.oldPass}`;
  const newPass = `${req.body.pass1}`;

  return Account.AccountModel.changePassword(username, oldPass, newPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    return res.json({ redirect: '/accountSettings' });
  });
};

// Method to find another person's task list.
// Provides username, then sends to account model to return listing.
const friendSearch = (request, response) => {
  const req = request;
  const res = response;

  req.body.friendSearchName = `${req.body.friendSearchName}`;

  if (!req.body.friendSearchName) {
    return res.status(400).json({ error: 'RAWR! Enter an account name!' });
  }

  return Account.AccountModel.findByUsername(req.body.friendSearchName, (err, doc) => {
    if (err || !doc) {
      return res.status(401).json({ error: 'Invalid username!' });
    }
    return res.json({ user: doc });
  });
};

// Method to add a friend to an account's friends list.
const addFriend = (request, response) => {
  const req = request;
  const res = response;

  req.body.addFriendName = `${req.body.addFriendName}`;

  if (!req.body.addFriendName) {
    return res.status(400).json({ error: 'RAWR! Enter a friend account name!' });
  }

  return Account.AccountModel.addFriend(req.session.account._id,
                                        req.body.addFriendName, (err, doc) => {
                                          if (err || !doc) {
                                            return res.status(401).json(
                                                { error: 'Something went wrong!' });
                                          }
                                          return res.json({ redirect: '/friendTasks' });
                                        });
};

// Method to set an account to premium and adds an email to their account.
const setPremium = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.setPremium(req.session.account._id, (err, doc) => {
    if (err || !doc) {
      return res.status(401).json({ error: 'Something went wrong!' });
    }
    return res.json({ redirect: '/accountSettings' });
  });
};

// Method to get an account's friends list.
const getFriendsList = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findByID(req.session.account._id, (err, doc) => {
    if (err || !doc) {
      return res.status(401).json({ error: 'Something went wrong!' });
    }
    return res.json({ friends: doc.friendsList });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.passwordChange = passwordChange;
module.exports.accountSettingsPage = accountSettingsPage;
module.exports.setPremium = setPremium;
module.exports.friendTasksPage = friendTasksPage;
module.exports.friendSearch = friendSearch;
module.exports.addFriend = addFriend;
module.exports.getFriendsList = getFriendsList;

