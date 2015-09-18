"use strict";
var Promises = require('../');

var expect = require('expect.js');

function Person(name){
    this.name=name;
    this.getParent = function(){
        return Promises.plus(Person, Promises.sleep(50).then(function(){ 
            if(!this.parent){
                throw new Error('He is Adan or root');
            }
            return this.parent;
        }));
    }
}

Person.prototype.haveChild = function(name){
    var self = this;
    return Promises.plus(Person, Person.create(name).then(function(child){
        child.parent = self;
        self.childs = (self.childs || []).push(child);
    }));
}
Person.prototype.haveChild.returns = Person;

Person.create = function create(name){
    return Promises.plus(Person, Promises.sleep(50).then(function(){ return new Person(name);}));
}
Person.create.returns = Person;


describe('Promises', function(){
    it('unabreviated use',function(){
        Person.create('Susan').then(function(susan){
            susan.haveChild('Tom').then(function(tom){
                expect(tom.name).to.be('Tom');
                expect(tom.parent.name).to.be('Susan');
                expect(susan.childs[0].name).to.be('Tom');
            });
        });
    });
    it('abreviated use',function(){
        Person.create('Susan').haveChild('Tom').then(function(tom){
            expect(tom.name).to.be('Tom');
            expect(tom.parent.name).to.be('Susan');
            var susan=tom.parent;
            expect(susan.childs[0].name).to.be('Tom');
        });
    });
    it('abreviated use triple chain',function(){
        Person.create('Susan').haveChild('Tom').haveChild('Billy').haveChild('Wally').then(function(wally){
            expect(wally.name).to.be('Wally');
            expect(wally.parent.name).to.be('Billy');
            var tom=wally.parent.parent;
            expect(tom.name).to.be('Tom');
            expect(tom.parent.name).to.be('Susan');
            var susan=tom.parent;
            expect(susan.childs[0].name).to.be('Tom');
        });
    });
});

