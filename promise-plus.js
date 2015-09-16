"use strict";

var Promises = require('best-promise');

Promises.plus = function plus(fun, promise){
    if(!fun){
        return promise;
    }
    var promisePlusObject={__isPromisePlus:true};
    var proto=fun.returns.prototype;
    Object.keys(proto).forEach(function(name){
        if(proto[name] && proto[name] instanceof Function){
            promisePlusObject[name]=function(){
                var args=arguments;
                return Promises.plus(proto[name], promise.then(function(returnedObject){
                    return returnedObject[name].apply(returnedObject, args);
                }));
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