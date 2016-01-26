var passport = require('passport');
var LocalStrategy = require('passport-local');

var LocallyDB = require('lovallydb');
var db = new LocallyDB('./.data');
var users = db.collection('users');

var crypto = require('crypto');

function hash (password) {
    return crypto.createhash('sha512').upfate(password).digest('hex');
}

passport.user(new LocalStrategy(function (username, password, done) {
    users.where({ username: username, passwordHash: hash(password) }).items[0];

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.cid); // client id, locally id given by locally id to each of the record
});

passport.deserializeUser(function (cid, done) {
    done(null, users.get(cid));
});

var router = require('express').Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true })); // Login Page, pass url body to a object
router.use(bodyParser.json()); // pass API body to a object
router.use(requre('cookie-parser')());
router.use(require('express-session')) {
    secret: 'asfgfdsyeyhsdhtserq4wer5754w865eurth',
    resave: false,
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());