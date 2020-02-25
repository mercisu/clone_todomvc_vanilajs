(function (window) {
    'use strict';

    function Model(storage) {
        this.storage = storage;
    }

    Model.prototype.read = function(query, callback) {
        var queryType = typeof query;
        callback = callback || function () {}

        if(queryType === 'function') {
            callback = query;
            return this.storage.findAll(callback);
        } else if(queryType ==='string' || queryType ==='number') {
            query = parseInt(query,10);
            this.storage.find({id:query}, callback);
        } else {
            this.storage.find(query,callback);
        }
    }

    Model.prototype.getCount = function(callback) {
        var todos = {
            active:0,
            complted:0,
            total:0
        };

        this.storage.findAll(function (data) {
            data.forEach(function (todo) {
                if(todo.completed) {
                    todos.complted++;
                } else {
                    todos.active++;
                }
                todos.total++;
            });
            callback(todos);
        });
    }

    window.app = window.app || {};
    window.app.Model = Model;
})(window);