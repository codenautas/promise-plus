"use strict";

var Promises = require('best-promise');

Promises.plus = function plus(returningClass, promise){
    if(!returningClass){
        return promise;
    }
    var promisePlusObject={__isPromisePlus:true};
    var proto=returningClass.prototype;
    Object.keys(proto).forEach(function(name){
        if(proto[name] && proto[name] instanceof Function){
            promisePlusObject[name]=function(){
                var args=arguments;
                return promise.then(function(returnedObject){
                    return returnedObject[name].apply(returnedObject, args);
                });
            }
        }
    });
    function add(name){
        if(promise[name] && promise[name] instanceof Function){
            promisePlusObject[name]=function(){
                return promise[name].apply(promise, arguments);
            }
        }
    }
    for(var name in promise){
        add(name);
    }
    return promisePlusObject;
}

module.exports = Promises;