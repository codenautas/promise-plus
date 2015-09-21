"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */

var PromisePlus = {};

var PromisePlus = require('best-promise');

PromisePlus.plus = function plus(returningClass, promise){
    if(!returningClass){
        return promise;
    }
    var promisePlusObject={__isPromisePlus:true};
    var protos=[returningClass.prototype, returningClass.exposes || {}];
    protos.forEach(function(proto){
        try{
            Object.keys(proto);
        }catch(err){
            console.log('********************'); 
            console.log(err,protos,proto);
        }
        Object.keys(proto).forEach(function(name){
            if(proto[name] && (proto[name] instanceof Function || proto[name].returns)){
                promisePlusObject[name]=function(){
                    var args=arguments;
                    return PromisePlus.plus(
                        proto[name].returns,
                        promise.then(function(returnedObject){
                            return returnedObject[name].apply(returnedObject, args); 
                        })
                    );
                };
            }
        });
    });
    function add(name){
        if(promise[name] && promise[name] instanceof Function){
            promisePlusObject[name]=function(){
                return promise[name].apply(promise, arguments);
            };
        }
    }
    for(var name in promise){
    /*jshint forin:false */
        add(name);
    }
    add('then');
    add('catch');
    return promisePlusObject;
    /*jshint forin:true */
};

module.exports = PromisePlus;