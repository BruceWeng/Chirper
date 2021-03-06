var router = module.exports = require('express').Router();
var login = require('./login');

var db = new (require('locallydb'))('./.data');
var chirps = db.collection('chirps');

router.route('/api/chirps')
    .all(login.required)
    .get(function (request, response) {
        response.json(chirps.toArray());
    })
    .post(function (request, response) {
        var chirp = request.body;
        chirp.userId = request.user.cid;

        // TO BE REMOVED
        chirp.username = request.user.username;
        chirp.fullname = request.user.fullname;
        chirp.email = request.user.email;

        var id = chirps.insert(chirp);
        response.json(chirps.get(id));
    });