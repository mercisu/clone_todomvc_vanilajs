(function (window) {
    'use strict';

    function Store(name, callback) {
        callback = callback || function () {};

        this._dbName = name;
        if(!localStorage.getItem(name)) {
            var todos = [];
            localStorage.setItem(name, JSON.stringify(todos));
        }

        //Q
        callback.call(this, (JSON.parse(localStorage.getItem(name))));
    }

    Store.prototype.find = function(query, callback) {
        if(!callback) { return;}

        var todos = JSON.parse(localStorage.getItem(this._dbName));
        callback.call(this, todos.filter(function (todo) {
            for(var q in query) {
                if(query[q] !== todo[q]) {
                    return false;
                }
            }
            return true;
        }));
    }

    Store.prototype.findAll = function(callback) {
        callback = callback || function () {};
        callback.call(this, JSON.parse(localStorage.getItem(this._dbName)));
    }

    window.app = window.app || {};
    window.app.Store = Store;
})(window);