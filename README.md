# watch-property

Monitor a property, or multiple properties, on an object and return true when the value has changed between invocations. 


[![NPM](https://nodei.co/npm/watch-property.png)](https://npmjs.org/package/watch-property)


## What is this useful for?
This module has many use-cases, one of which would be for help with an Immediate-Mode GUI or updating expensive attributes in a render loop.



## Install
```
npm install watch-property --save
```



## Basic Example

```js
var object = {
    string: 'foo'
};

var stringChanged = watch(object, 'string');

stringChanged(); //false
object.string = 'bar';
stringChanged(); //true
stringChanged(); //false
```

## API

### watch(object, key [, predicateFn, retainInitValue])
Provide an object and a key to watch. Optionally you can provide a `predicateFn(value, oldValue):Boolean` function to determine if changed, or set `retainInitValue` to true if you would like to consider any value except the first as a changed value.

### watch.any(object, keysArray [, predicateFn, retainInitValue])
The same as `watchProperty` except receives an array of keys to watch and if any have changed values the function returns true.
_alias: watch.some_

### watch.all(object, keysArray [, predicateFn, retainInitValue])
The same as `watchProperty` except receives an array of keys to watch and only returns true if all of the values have changed.
_alias: watch.every_

## Web Example

```js
var watch = require('watch-property'),
    eventMap = require('event-map');
    
var byId = document.getElementById.bind(document),
    container = byId('container'),
    pressedDisplay = byId('pressed-display'),
    nameDisplay = byId('name-display'),
    clickDisplay = byId('click-display');


var parameters = {
    pressed: false,
    numClicks: 0,
    name: 'kyle'
};

var clicksChanged = watch(parameters, 'numClicks'),
    btnIsPressed = watch(parameters, 'pressed', true), //retainInitValue is 3rd parameter
    nameChanged = watch(parameters, 'name');
    
function onRender(){
    pressedDisplay.innerHTML = btnIsPressed() ? 'Pressed' : 'Released';
        
    if(clicksChanged()){
        clickDisplay.innerHTML = parameters.numClicks;
    }
    if(nameChanged()){
        nameDisplay.innerHTML = parameters.name;
    }
    
    window.requestAnimationFrame(onRender);
}

onRender();


eventMap({
    'mousedown #button': ()=> parameters.pressed = true,
    'mouseup #button': ()=> parameters.pressed = false,
    'click #button': ()=> parameters.numClicks++,
    'change #name-input': (event)=> parameters.name = event.target.value
});

```

## Example using watchProperty.any _(alias `some`)_


```js
var watch = require('watch-property');
var el = document.getElementById('moving-element');

var position = {
    top: 0,
    left: 0
};

var positionChanged = watch.any(position, ['top', 'left']);

function updatePosition(){
    el.style.top = position.top + 'px';
    el.style.left = position.left + 'px';
}

updatePosition();

function onRender(){
    if(positionChanged()){
        updatedPosition();
    }
    
    window.requestAnimationFrame(onRender);
}

onRender();

//do anything to be modifying the position (a tween or a user action)
```

## License

MIT, see [LICENSE.md](http://github.com/hapticdata/event-map/blob/master/LICENSE.md) for details. 

