var assgin = require('object-assign');
var EventEmitterProto = require('event').EventEmitter.prototype;
var CHANGE_EVENT = 'CHANGE';

var storeMethods = {
    // Methods that every sotres need to have
    init: function () {},
    set: function (arr) {
        // set arr to _data an no dulplicates
        var currIDs = this._data.map(function (m) {
            return m.cid;
        });
        arr.filter(function (item) {
            return currIDs.indexOf(item.cid) === -1;
        }).forEach(this.add.bind(this));
    },
    add: function (item) {
        this._data.push(item);
    },
    all: function () {
        return this._data;
    },
    get: function () {
        return this._data.filter(function (item) {
            return item.cid === id;
        })[0];
    },
    addChangeListener: function (fn) {
        this.on(CHANGE_EVENT, fn);
    },
    removeChangeListener: function (fn) {
        this.removeListener(CHANGE_EVENT, fn);
    },
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },
    bind: function (actionType, actionFn) {
        if (this.actions[actionType]) {
            this.actions[actionType].push(actionFn);
        } else {
            this.actions[actionType] = [actionFn];
        }
    }
};

exports.extend = function (methods) {
    // Create stores by combinding lots of objects
    var store = {
        _data: [],
        actions: {}
    };
    //all functions in EventEmitterProto object and storeMethods properties will be copied to store objects
    assign(store, EventEmitterProto, storeMethods, methods);

    store.init();

    require('../dispatcher'.register(function (action) {
        if (store.actions[action.actionType]) {
            store.actions[action.actionType].forEach(function (fn) {
                fn.call(null, action.data);
            });
        }
    });

    return store;
};