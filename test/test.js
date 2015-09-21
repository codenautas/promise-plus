"use strict";
var Promises = require('../');

var expect = require('expect.js');

function Person(name){
    var self = this;
    this.name=name;
    this.getParent = function(){
        return Promises.plus(Person, Promises.sleep(50).then(function(){ 
            if(!self.parent){
                throw new Error('He is Adan or root');
            }
            return self.parent;
        }));
    }
    this.getParentName = function(){
        return this.parent.name;
    }
}
Person.exposes={};

Person.prototype.haveChild = function(name){
    var self = this;
    return Promises.plus(Person, Person.create(name).then(function(child){
        child.parent = self;
        self.childs = self.childs || [];
        self.childs.push(child);
        return child;
    }));
}

Person.prototype.haveChild.returns = Person;

Person.prototype.otherMember = null;

Person.prototype.getName = function(){
    return this.name;
};

Person.create = function create(name){
    return Promises.plus(Person, Promises.sleep(50).then(function(){ return new Person(name);}));
}
Person.create.returns = Person;
Person.exposes.getParent = {returns: Person};
Person.exposes.getParentName = {returns: String};


describe('Promises', function(){
    it('unabreviated use',function(done){
        Person.create('Susan').then(function(susan){
            expect(susan.name).to.be('Susan');
            return susan.haveChild('Tom').then(function(tom){
                expect(tom.name).to.be('Tom');
                expect(tom.parent.name).to.be('Susan');
                expect(susan.childs[0].name).to.be('Tom');
            });
        }).then(done,done);
    });
    it('abreviated use',function(done){
        Person.create('Susan').haveChild('Tom').then(function(tom){
            expect(tom.name).to.be('Tom');
            expect(tom.parent.name).to.be('Susan');
            var susan=tom.parent;
            expect(susan.childs[0].name).to.be('Tom');
        }).then(done,done);
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
    it('abreviated use multiple chain',function(done){
        var saveSusan;
        Person.create('Susan').haveChild('Tom').getParent().haveChild('Bety').getParent().then(function(susan){
            expect(susan.childs.length).to.be(2);
            saveSusan=susan;
            return susan.haveChild('Smechy').getName();
        }).then(function(name){
            expect(name).to.be('Smechy');
            return saveSusan.haveChild('Pedro').getParentName();
        }).then(function(name){
            expect(name).to.be('Susan');
            return saveSusan.getParent();
        }).then(function(noFather){
            console.log('noFather',noFather);
            throw new Error('fail to detect noFather');
        },function(errOk){
            expect(errOk.message).to.match(/Adan/);
        }).then(done,done);
    });
});

