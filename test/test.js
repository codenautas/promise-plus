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

Person.create = function create(name){
    return Promises.plus(Person, Promises.sleep(50).then(function(){ return new Person(name);}));
}
Person.create.returns = Person;
Person.exposes.getParent = {returns: Person};


describe('Promises', function(){
    it('unabreviated use',function(done){
        Person.create('Susan').then(function(susan){
            expect(susan.name).to.be('Susan');
            //console.log('0a',susan.haveChild);
            //console.log('0b',susan.haveChild('Peggy'));
            //console.log('0',susan.haveChild('Tomy').then);
            return susan.haveChild('Tom').then(function(tom){
                expect(tom.name).to.be('Tom');
                expect(tom.parent.name).to.be('Susan');
                expect(susan.childs[0].name).to.be('Tom');
            });
        }).then(done,done);
    });
    it('abreviated use',function(done){
        console.log('1',Person.create('Susan 1'));
        console.log('2',Person.create('Susan 2').haveChild('Tom 2'));
        Person.create('Susan').haveChild('Tom').then(function(tom){
            console.log('tom',tom);
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
        Person.create('Susan').haveChild('Tom').getParent().haveChild('Bety').getParent().then(function(susan){
            expect(susan.childs.length).to.be(2);
            return susan.getParent;
        }).then(function(noFather){
            console.log('noFather',noFather);
            throw new Error('fail to detect noFather');
        },function(errOk){
            expect(errOk.message).to.match(/Adan/);
        }).then(done,done);
    });
});

