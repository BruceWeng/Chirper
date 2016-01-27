var passport = require('passport');
var LocalStrategy = require('passport-local');

var LocallyDB = require('locallydb');
var db = new LocallyDB('./.data');
var users = db.collection('users');

var crypto = require('crypto');

function hash (password) {
    return crypto.createHash('sha512').update(password).digest('hex');
}

passport.use(new LocalStrategy(function (username, password, done) {
    var user = users.where({ username: username, passwordHash: hash(password) }).items[0];

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
router.use(require('cookie-parser')());
router.use(require('express-session')({
    secret: 'asfgfdsyeyhsdhtserq4wer5754w865eurth',
    resave: false,
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());

router.get('/login', function (request, response) {
    response.render('login');
});

router.post('/signup', function (request, response, next) {
    if (users.where({ username: request.body.username }).items.length === 0) {
        //no user
        var user = {
            fullname: request.body.fullname,
            email: request.body.email,
            username: request.body.username,
            passwordHash: hash(request.body.password),
            following: []
        };

        var userId = users.insert(user);

        request.login(users.get(userId), function (err) {
            if (err) return next(err);
            response.redirect('/');
        });
    } else {
        response.redirect('/login');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/logout', function (request, response) {
    request.logout();
    response.redirect('/login');
});

function loginRequired (request, response, next) {
    if (request.isAuthenticated()) {
        next();
    } else {
        response.redirect('/login');
    }
}

function makeUserSafe (user) {
    var safeUser = {};

    var safeKeys = ['cid', 'fullname', 'email', 'username', 'following']; // white list

    safeKeys.forEach(function (key) {
        safeUser[key] = user[key];
    });
    return safeUser;
}

exports.routes = router;
exports.required = loginRequired;
exports.safe = makeUserSafe;