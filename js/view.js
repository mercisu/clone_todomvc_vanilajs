(function (window) {
    'use strict';

    function View(template) {
       this.template = template;

       this.ENTER_KEY = 13;
       this.ESCAPE_KEY = 27;

       this.$todoList = qs('.todo-list');
       this.$todoItemCounter = qs('.todo-count');
       this.$clearCompleted = qs('.clear-completed');
       this.$main = qs('.main');
       this.$footer = qs('.footer');
       this.$toggleAll = qs('.toggle-all');
       this.$newTodo = qs('.new-todo');
    }

    View.prototype._elementComplete = function(id, completed) {
        var listItem = qs('[data-id="'+id+'"]');
        if(!listItem) {
            return;
        }
        listItem.className = completed? 'completed':'';
        qs('input', listItem).checked = completed;
    }

    View.prototype._editItem = function(id, title) {
        var listItem = qs('[data-id"' + id +'"]');
        if(!listItem) {
            return;
        }

        listItem.className = listItem.className + ' editing';
    }

    View.prototype.render = function(viewCmd, parameter) {
        var self = this;
        var viewCommands = {
            showEntries: function () {
                self.$todoList.innerHTML = self.template.show(parameter);
            },
            // removeItem: function () {
            //     self._removeItem(parameter);
            // },
            updateElementCount: function () {
                self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
            },
            // clearCompletedButton: function () {
            //     self._clearCompletedButton(parameter.completed, parameter.visible);
            // },
            // contentBlockVisibility: function () {
            //
            // },
            // toggleAll: function () {
            //
            // },
            // setFilter: function () {
            //
            // },
            clearNewTodo:function () {
                self.$newTodo.value= '';
            },
            elementComplete: function () {
                self._elementComplete(parameter.id, parameter.completed);
            },
            // editItem:function () {
            //
            // },
            // editItemDone: function () {
            //
            // }
        }
    }

    View.prototype._itemId = function(element) {
        var li = $parent(element, 'li');
        return parseInt(li.dataset.id, 10);
    }

    View.prototype._bindItemEditDone = function(handler) {
        var self = this;
        $delegate(self.$todoList, 'li .edit', 'blur', function () {
            if(!this.dataset.iscanceled) {
                handler({
                    id:self._itemId(this),
                    title:this.value
                });
            }
        });

        $delegate(self.$todoList)
    }

    View.prototype._bindItemEditCancel = function(handler) {
        var self = this;
        $delegate(self.$todoList, 'li .edit', 'keyup', function (event) {
            if (event.keyCode === self.ESCAPE_KEY) {
                this.dataset.iscanceled = true;
                this.blur();

                handler({id:self._itemId(this)});
            }
        });
    }

    View.prototype.bind = function(event, handler) {
        var self = this;
        if(event ==='newTodo') {
            $on(self.$newTodo, 'change', function () {
                handler(self.$newTodo.value);
            });
        } else if(event ==='removeCompleted') {
            $on(self.$clearCompleted, 'click', function () {
                handler();
            });
        } else if(event ==='toggleAll') {
            $on(self.$toggleAll, 'click', function () {
                handler({complted:this.checked});
            });
        } else if(event ==='itemEdit') {
            $delegate(self.$todoList, 'li label', 'dblclick', function () {
                handler({id:self._itemId(this)});
            })
        } else if(event ==='itemRemove') {
            $delegate(self.$todoList, '.destroy', 'click', function () {
                handler({id:self._itemId(this)});
            });
        } else if(event === 'itemToggle') {
            $delegate(self.$todoList, '.toggle', 'click', function () {
                handler({
                    id:self._itemId(this),
                    completed:this.checked
                });
            });
        } else if(event ==='itemEditDone') {
            self._bindItemEditDone(handler);
        } else if(event ==='itemEditCancel') {
            self._bindItemEditCancel(handler);
        }
    }

    window.app = window.app || {};
    window.app.View = View;
})(window);