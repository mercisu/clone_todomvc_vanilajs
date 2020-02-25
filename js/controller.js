(function (window) {
    'use strict';

    function Controller(model, view) {
        var self = this;
        self.model = model;
        self.view = view;

        self.view.bind('newTodo', function (title) {
            self.addItem(title);
        });

        self.view.bind('itemEdit', function (item) {
            self.editItem(item.id);
        });

        self.view.bind('itemEditDone', function (item) {
            self.editItemSave(item.id, item.title);
        });

        self.view.bind('itemEditCancel', function (item) {
            self.view.editItemCancel(item.id);
        });

        self.view.bind('itemRemove', function (item) {
            self.removeItem(item.id);
        });

        self.view.bind('itemToggle',function (item) {
            self.toggleComplete(item.id, item.completed);
        });

        self.view.bind('removeCompleted', function () {
            self.removeCompletedItems();
        });

        self.view.bind('toggleAll', function (status) {
            self.toggleAll(status.completed);
        });
    }

    Controller.prototype.setView = function(locationHash) {
        var route = locationHash.split('/')[1];
        var page = route || '';
        this._updateFilterState(page);
    };

    Controller.prototype.showAll = function() {
        var self = this;
        self.model.read(function (data) {
            self.view.render('showEntries',data);
        });
    }

    Controller.prototype.showActive = function() {
        var self = this;
        self.model.read({completed:false},function (data) {
            self.view.render('showEntries', data);
        });
    }

    Controller.prototype.showCompleted = function() {
        var self = this;
        self.model.read({completed:true}, function (data) {
            self.view.render('showEntries', data);
        })
    }

    Controller.prototype._updateFilterState = function(currentPage) {
        this._activeRoute = currentPage;

        if(currentPage ==='') {
            this._activeRoute = 'All';
        }

        this._filter();
        this.view.render('setFilter', currentPage);
    };

    Controller.prototype._updateCount = function () {
        var self = this;
        self.model.getCount(function (todos) {
            self.view.render('updateElementCount', todos.active);
            self.view.render('clearCompletedButton', {
                completed: todos.completed,
                visible: todos.completed > 0
            });

            self.view.render('toggoleAll', {checked: todos.complted === todos.total});
            self.view.render('contentBlockVisiviltiy', {visible:todos.total >0})
        })
    }

    Controller.prototype._filter = function(force) {
        console.log(this,"controller this")
        var activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);
        this._updateCount();

        if(force || this._lastActiveRoute !=='All' || this._lastActiveRoute !== activeRoute) {
            this['show' + activeRoute]();
        }
        this._lastActiveRoute = activeRoute;
    };

    window.app = window.app || {};
    window.app.Controller = Controller;
})(window);