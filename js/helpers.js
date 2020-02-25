(function (window) {
    'use strict';

    window.qs = function(selector, scope) {
        return (scope || document).querySelector(selector);
    };
    window.qsa = function(selector, scope) {
        return (scope || document).querySelectorAll(selector);
    }

    window.$on = function (target, type, callback, useCapture) {
        target.addEventListener(type, callback, !!useCapture);
    };

    window.$delegate = function () {

    };

    window.$parent = function (element, tagName) {
        if(!element.parentNode) {
            return;
        }
        if(element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
            return element.parentNode;
        }
        return window.$parent(element.parentNode, tagName);
    }
})(window);