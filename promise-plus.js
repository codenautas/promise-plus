"use strict";

var Promises = require('best-promise');

Promises.plus = function plus(directNames, promise){
    var promisePlusObject={};
    directNames.forEach(function(name){
        console.log('desde lista agrego',name);
        promisePlusObject[name]=function(){
            var args=arguments;
            return promise.then(function(returnedObject){
                returnedObject[name].apply(returnedObject, args);
            });
        }
    });
    function add(name){
        if(promise[name] && promise[name] instanceof Function){
            console.log('desde promesa agrego',name);
            promisePlusObject[name]=function(){
                return promise[name].apply(promise, arguments);
            }
        }
    }
    for(var name in promise){
        add(name);
    }
    /*
    Object.keys(promise).forEach(function(name){
        add(name, arguments);
    });
    */
    return promisePlusObject;
}

module.exports = Promises;