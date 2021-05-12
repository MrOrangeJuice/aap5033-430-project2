const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'WAAAH! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'WAAAH! Wrong username or password' });
    }
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'WAAAH! All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'WAAAH! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      coins: 0,
      coinPower: 1,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'WAAAH! Username already in use.' });
      }

      return res.status(400).json({ error: 'WAAAH! An error occured' });
    });
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

const save = (request, response) => {
  Account.AccountModel.findByUsername(request.session.account.username, (error, doc) => {
      var userAccount = doc;
      userAccount.coins = request.body.playerCoins;

      const savePromise = userAccount.save();

      savePromise.then(() => {
          request.session.account = Account.AccountModel.toAPI(userAccount);
          return response.json({ redirect: '/maker' });
      });

      savePromise.catch((err) => {
          console.log(err);
    
          return response.status(400).json({ error: 'WAAAH! An error occured' });
        });
  });
}

const getUser = (request, response) => {
  Account.AccountModel.findByUsername(request.session.account.username, (error, doc) => {
    var userAccount = {
      username: doc.username,
      coins: doc.coins
    }

    response.status(200);
    return response.json(userAccount);
  });
}

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.save = save;
module.exports.getUser = getUser;
