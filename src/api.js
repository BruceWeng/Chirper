var actions = require('./actions');

var API = module.exports = {
    fetchChirps: function () {
        get('/api/chirps').then(actions.gotChirps.bind(actions));
    }
};

function get (url) {
    // fetch return a promise contains a promise with json
    return fetch(url, {
        credentials: 'same-origin' //identify login user
    }).then(function (response) {
        return response.json();
    });
}