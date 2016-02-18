var test      = require('tape'),
    deepEqual = require('deep-equal'),
    watch     = require('./');


test('should return true when a value has changed since last invocation', function(t){

    t.plan(12);

    function obj(){
        return {};
    }

    var object = {
        num: 0,
        str: 'Hello',
        bool: false,
        nested: obj()
    };


    var numChanged    = watch(object,'num'),
        strChanged    = watch(object, 'str'),
        boolChanged   = watch(object, 'bool'),
        nestedChanged = watch(object, 'nested');

    t.ok(!numChanged());
    object.num = 1;
    t.ok(numChanged());
    t.ok(!numChanged());


    t.ok(!strChanged());
    object.str = 'hello';
    t.ok(strChanged());
    t.ok(!strChanged());

    t.ok(!boolChanged());
    object.bool = !object.bool;
    t.ok(boolChanged());
    t.ok(!boolChanged());

    t.ok(!nestedChanged());
    object.nested = obj();
    t.ok(nestedChanged(), 'should be a change, its a new object');
    t.ok(!nestedChanged());


});

test('should continue to report a value as changed with `retainFirstValue` set to true', function(t){

    t.plan(4);

    var object = {
        pressed: false
    };

    //continuously report a new value as changed
    var pressedChanged = watch(object, 'pressed', true);

    t.ok(!pressedChanged());
    object.pressed = true;
    t.ok(pressedChanged());
    t.ok(pressedChanged());
    object.pressed = false;
    t.ok(!pressedChanged());

});

test('should accept custom assertion for test', function(t){

    t.plan(3);

    function obj(){
        return { a: true };
    }

    var object = {
        nested: obj()
    };


    //deepEqual is a predicate function, if the properties on the objects have the same
    //values, but are different references, it will be true, so obj() == obj() is true
    //deepEqual(a, b):Boolean
    var changed = watch(object, 'nested', function(a,b){
        return !deepEqual(a,b);
    });

    t.ok(!changed());

    object.nested = obj();
    t.ok(!changed(), 'should not be a change because the new object is deepEqual to previous');
    object.nested = { b: true };
    t.ok(changed());
});

test('any (alias some) should return true if any properties changed', function(t){

    t.plan(3);

    var object = {
        num: 0,
        bool: false,
        str: 'hello',
        notWatching: true
    };


    var anyChanged = watch.any(object, ['num', 'bool', 'str']);

    t.ok(!anyChanged());
    object.num = 1;
    t.ok(anyChanged());
    t.ok(!anyChanged());
});


test('all (alias every) should return true only if all properties changed', function(t){

    t.plan(5);

    var object = {
        num: 0,
        bool: false,
        str: 'hello',
        notWatching: true
    };

    var allChanged = watch.all(object, ['num', 'bool', 'str']);

    t.ok(!allChanged());
    object.num = 1;
    t.ok(!allChanged());

    object.bool = !object.bool;
    object.str = 'something else';
    t.ok(!allChanged(), 'false, the test has been run since `num` was changed');

    object.num = 3;
    object.bool = !object.bool;
    object.str = 'change';
    t.ok(allChanged());

    t.ok(!allChanged());

});


test('continue to report a value as changed when retainInitializationValue is true', function(t){
    t.plan(5);

    var object = {
        bool: false
    };

    //can accept 3 or 4 params
    var changed = watch(object, 'bool', true);

    t.ok(!changed());
    object.bool = !object.bool;
    t.ok(changed());
    t.ok(changed(), 'should continue to report values as changed');
    t.ok(changed());

    object.bool = !object.bool;
    t.ok(!changed(), 'should not be considered as changed as it has returned to initial value');
});

test('continue to report as changed if any values are different than initialized values when retainInitializationValue is true', function(t){

    t.plan(6);

    var object = {
        bool: false,
        num: 1,
        string: 'hello'
    };

    var changed = watch.any(object, ['bool','num','string'], true);

    t.ok(!changed());
    object.bool = !object.bool;
    t.ok(changed());
    t.ok(changed());
    object.bool = !object.bool;
    object.string = 'foo';
    t.ok(changed(), 'string value has changed');
    t.ok(changed(), 'string value remains changed');
    object.string = 'hello';
    t.ok(!changed(), 'string has returned to init value');
});

