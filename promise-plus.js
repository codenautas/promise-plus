"use strict";

var Promises = require('best-promise');

Promises.plus = function plus(returningClass, promise){
    if(!returningClass){
        return promise;
    }
    var promisePlusObject={__isPromisePlus:true};
    var protos=[returningClass.prototype, returningClass.exposes];
    protos.forEach(function(proto){
        Object.keys(proto).forEach(function(name){
            if(proto[name] && (proto[name] instanceof Function || proto[name].returns)){
                console.log('encadene',name);
                promisePlusObject[name]=function(){
                    var args=arguments;
                    console.log('encadenando ',name,args);
                    return Promises.plus(
                        proto[name].returns,
                        promise.then(function(returnedObject){
                        console.log('via encadenamiento',name,args,returnedObject);
                            return returnedObject[name].apply(returnedObject, args); 
                        })
                    );
                }
            }else{
                console.log('no pude encadenar',name);
            }
        });
    });
    function add(name){
        if(promise[name] && promise[name] instanceof Function){
            promisePlusObject[name]=function(){
                console.log('directa',name,arguments);
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