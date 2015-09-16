"use strict";
var Promises = require('../');

var expect = require('expect.js');

var factory={
    createPerson: function(name){
        return Promises.plus(
            ['haveChild'],
            Promises.sleep(50).then(function(){ return {   
                person: name,
                haveChild: function(name){
                    var self;
                    return createPerson(name).then(function(person){
                        person.parent=self;
                        self.childs=(self.childs||[]).push(person);
                    });
                }
            }; })
        );
    }
};

describe('Promises', function(){
    it('un abreviated use',function(){
        factory.createPerson('Susan').then(function(susan){
            susan.haveChild('Tom').then(function(tom){
                expect(tom.name).to.be('Tom');
                expect(tom.parent.name).to.be('Susan');
                expect(susan.childs[0].name).to.be('Tom');
            });
        });
    });
    it('abreviated use',function(){
        factory.createPerson('Susan').haveChild('Tom').then(function(tom){
            expect(tom.name).to.be('Tom');
            expect(tom.parent.name).to.be('Susan');
            var susan=tom.parent;
            expect(susan.childs[0].name).to.be('Tom');
        });
    });
});

