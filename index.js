module.exports = exports = watchProperty;
exports.some = exports.any = some;
exports.every = exports.all = every;
exports.notEqual = notEqual;

/**
 * equivalent to the default predicate
 * @param {*} a,
 * @param {*} b
 * @returns true if strictly not-equal
 */
function notEqual(a,b){
    return a !== b;
}

/**
 * create a function that will return true once any time the value changes
 * @param {Object} object
 * @param {String} key
 * @param {Function(value, prevValue):Boolean)} [predicate] should return true if the value should be considered changed
 * @param {Boolean} [retainInitializationValue] if set to true, watch-property will continue to report a change unless
 * the value is equal to the first one set.
 * @returns {Function():Boolean} returns true if value changed since last invocation
 */
 function watchProperty(object, key, predicate, retainInitializationValue){

    var value = object[key];

    //allow params (object, key, retainInitializationValue)
    if(typeof arguments[2] === 'boolean'){
        retainInitializationValue = predicate;
        predicate = undefined;
    }

    retainInitializationValue = !!retainInitializationValue;

    if(typeof predicate === 'function'){
        return function watchWithPredicate(){
            var changed = predicate(object[key], value);
            if(changed && !retainInitializationValue){
                value = object[key];
            }

            return changed;
        };
    }

    //if a predicate function wasn't provided,
    //save a call on the stack and return a different function
    return function watchStrict(){
        var changed = value !== object[key];
        if(changed && !retainInitializationValue){
            value = object[key];
        }

        return changed;
    };
}


/**
 * watch an array of properties on an object
 * if any of the values have changed return true
 * @param {Object} object to watch
 * @param {Array<String>} array of keys to watch
 * @param {Function(value, prevValue):Boolean} [predicate] optional function that evaluates the change
 * @returns true if any of the values have changed
 */
function some(object, keys, predicate, retainInitializationValue){
    var fns = keys.map(function(key){
        return watchProperty(object, key, predicate, retainInitializationValue);
    });


    return function(){
        for(var i=0; i<fns.length; i++){
            if( fns[i]() ){
                return true;
            }
        }
        return false;
    };
}


/**
 * watch an array of properties on an object
 * if all of them have changed return true
 * @param {Object} object to watch
 * @param {Array<String>} array of keys to watch
 * @param {Function(value, prevValue):Boolean} [predicate] optional function that evaluates the change
 * @returns true if all objects have changed value
 */
function every(object, keys, predicate, retainInitializationValue){

    var fns = keys.map(function(key){
        return watchProperty(object, key, predicate, retainInitializationValue);
    });


    return function(){
        var success = true;
        for(var i=0; i<fns.length; i++){
            if( !fns[i]() ){
                //no break, must go through all values to ensure they get updated
                success = false;
            }
        }
        return success;
    };
}

