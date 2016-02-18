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
var watch = require('watch-property');

var byId = document.getElementById.bind(document),
    container = byId('container'),
    pressedDisplay = byId('pressed-display'),
    nameDisplay = byId('name-display'),
    clickDisplay = byId('click-display'),
    btn = byId('click-button'),
    nameInput = byId('name-input');


var parameters = {
    pressed: false,
    numClicks: 0,
    name: 'kyle'
};

var clicksChanged = watch(parameters, 'numClicks'),
    btnIsPressed = watch(parameters, 'pressed', true),
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



btn.addEventListener('mousedown', function(){
    parameters.pressed = true;
});

btn.addEventListener('mouseup', function(){
    parameters.pressed = false;
});

btn.addEventListener('click', function(){ 
    parameters.numClicks++;
});

nameInput.addEventListener('change', function(){
    parameters.name = nameInput.value;
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

