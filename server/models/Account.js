const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const convertID = mongoose.Types.ObjectId;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  isPremium: {
    type: Boolean,
    default: false,
  },

  email: {
    type: String,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
  isPremium: doc.isPremium,
  email: doc.email,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.findByID = (id, callback) => {
  const search = {
    _id: convertID(id),
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) =>
    callback(salt, hash.toString('hex'))
  );
};

AccountSchema.statics.authenticate = (username, password, callback) =>
AccountModel.findByUsername(username, (err, doc) => {
  if (err) {
    return callback(err);
  }

  if (!doc) {
    return callback();
  }

  return validatePassword(doc, password, (result) => {
    if (result === true) {
      return callback(null, doc);
    }

    return callback();
  });
});

// Change passwords method.
// Find the account, then validate that they entered
// the correct old password, then hash the new password
// and set that value to the password field in the database entry.
AccountSchema.statics.changePassword = (username, oldPass, newPass, callback) =>
    AccountModel.findByUsername(username, (err, doc) => {
      if (err) {
        return callback(err);
      }

      if (!doc) {
        return callback();
      }

      return validatePassword(doc, oldPass, (result) => {
        if (result === true) {
          let hashedPass = '';
          return crypto.pbkdf2(newPass, doc.salt, iterations,
          keyLength, 'RSA-SHA512', (erro, hash) => {
            hashedPass = hash.toString('hex');
            doc.set({ password: hashedPass });
            return doc.save((error, document) => {
              if (error) {
                return callback(error);
              }
              return callback(null, document);
            });
          });
        }
        return callback();
      });
    });

// Method to set an email and premium status to an account.
// Finds the account by id, then adds the appropriate fields.
AccountSchema.statics.setPremium = (id, email, callback) =>
    AccountModel.findByID(id, (err, doc) => {
      if (err) {
        return callback(err);
      }

      if (!doc) {
        return callback();
      }

      doc.set({
        email,
        isPremium: true,
      });
      return doc.save((error, document) => {
        if (error) {
          return callback(error);
        }
        return callback(null, document);
      });
    });

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
