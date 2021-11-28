const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { isValidPassword } = require("./../common/password");
const { User } = require("../schema").User;

passport.use(
  new localStrategy(
    { usernameField: 'email', passwordField: 'pswd' },
    function (email, password, cb) {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return cb(null, false);
          }

          const isValid = isValidPassword(password, user.password);
          if (isValid) {
            return cb(null, user);
          } else {
            return cb(null, false);
          }
        })
        .catch((err) => {
          cb(err);
        });
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});
