# Emitter
Using the observer pattern, define listeners in your class.


## Which is?
The Observer is a behavioral design pattern that allows you to define a signature mechanism to notify multiple objects about any events that happen to the object they are watching.


## Interfaces
```javascript
// Constructor
Emitter(): Emitter
```

```javascript
// Methods
_emit(name: string, ...args: any[]): void
```

```javascript
// Listeners
addEventListener(name: string, callback: (...args: any[]) => void): void

removeEventListener(name: string, callback: (...args: any[]) => void): void

on(name: string, callback: (...args: any[]) => void): void // Alias for addEventListener

off(name: string, callback: (...args: any[]) => void): void // Alias for removeEventListener
```


## How to use
```javascript
import Emitter from './Emitter.js';

class Test extends Emitter {

    constructor() {

        super();

        window.onmousemove = e => super._emit('mousemove', e.x, e.y);

        window.onclick = e => super._emit('click', e.x, e.y);

        window.onkeypress = e => super._emit('keypress', e.key);

        setInterval(() => {

            super._emit('setInterval', new Date().getTime());

        }, 3000);

    }

}

var test = new Test();

test.on('mousemove', (x, y) => console.log('mousemove', x, y));
test.on('click', (x, y) => console.log('click', x, y));
test.on('keypress', key => console.log('keypress', key));

let fun = timestamp => console.log('setInterval', timestamp);
test.on('setInterval', fun);
setTimeout(() => test.off('setInterval', fun), 9000);
```

> The super class Emitter is a module. Therefore, it must be imported and extended.