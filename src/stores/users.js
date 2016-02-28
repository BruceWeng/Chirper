var constants = require('../constants');

var UserStore = module.exports = require('./store').extend({
  init: function () {
    this.bind(constants.GOT_USERS, this.set);
    this.bind(constants.FOLLOWED, this.updateUser);
  },
  currentUser: USER,
  updateUser: function (data) {
    this.currentUser = data;
  }
});