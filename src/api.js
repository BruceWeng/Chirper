var actions = require('./actions');
var dispatcher = require('./dispatcher');
var constants = require('./constants');

var API = module.exports = {
    fetchChirps: function () {
        get('/api/chirps').then(actions.gotChirps.bind(actions));
    },
    fetchUsers: function () {
        get('/api/users').then(actions.gotUsers.bind(actions));
    },
    saveChirp: function (text) {
        text = text.trim();
        if(text === '') return;

        post('/api/chirps', { text: text}).then(actions.chirped.bind(actions));
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

function post (url, body) {
    return fetch(url, {
        method:'POST',
        credentials: 'include',
        body: JSON.stringify(body || {}),
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        }
    }).then(function (response) {
        return response.json();
    });
}

dispatcher.register(function (action) {
    switch (action.actionType) {
      case constants.CHIRP:
          API.saveChirp(action.data);
          break;

    }
});