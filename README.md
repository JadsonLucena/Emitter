# Emitter.mjs
Using the observer pattern, define listeners in your class


## Which is?
The Observer is a behavioral design pattern that allows you to define a signature mechanism to notify multiple objects about any events that happen to the object they are watching.


## Interfaces
```javascript
/**
 * @constructor
 * @throws {TypeError} Invalid maxListeners
 */
Emitter(maxListeners?: number = 10)
```

```javascript
// Getters
eventNames(): string[]
maxListeners(): number
```

```javascript
// Setters
/**
 * This is a useful default that helps finding memory leaks. The value must be contained in [0,+∞) and can be set to Infinity (or 0) to indicate an unlimited number of listeners.
 * @throws {TypeError} Invalid maxListeners
 */
maxListeners(maxListeners?: number = 10): void // https://nodejs.org/api/events.html#emittersetmaxlistenersn
```

```javascript
/**
 * @method
 * @throws {TypeError} Invalid eventName
 */
emit(eventName: string, ...args: any[]): Promise<boolean>

/**
 * @method
 * @throws {TypeError} Invalid eventName
 * @throws {TypeError} Invalid listener
 * @throws {Error} Memory leak detected
 */
addListener(eventName: string, callback: Function): Emitter

/**
 * @method
 * @throws {TypeError} Invalid eventName
 * @throws {TypeError} Invalid listener
 */
listenerCount(eventName: string, callback?: Function): number

/**
 * @method
 * @throws {TypeError} Invalid eventName
 */
listeners(eventName: string): Function[]

/**
 * @method
 * @throws {TypeError} Invalid eventName
 * @throws {TypeError} Invalid listener
 */
off(eventName: string, callback: Function): Emitter // Alias for removeListener

/**
 * @method
 * @throws {TypeError} Invalid eventName
 * @throws {TypeError} Invalid listener
 * @throws {Error} Memory leak detected
 */
on(eventName: string, callback: Function): Emitter // Alias for addListener

/**
 * @method
 * @throws {TypeError} Invalid eventName
 * @throws {TypeError} Invalid listener
 * @throws {Error} Memory leak detected
 */
once(eventName: string, callback: Function): Emitter

/**
 * @method
 * @throws {TypeError} Invalid eventName
 * @throws {TypeError} Invalid listener
 * @throws {Error} Memory leak detected
 */
prependListener(eventName: string, callback: Function): Emitter

/**
 * @method
 * @throws {TypeError} Invalid eventName
 * @throws {TypeError} Invalid listener
 * @throws {Error} Memory leak detected
 */
prependOnceListener(eventName: string, callback: Function): Emitter

/**
 * @method
 * @throws {TypeError} Invalid eventName
 */
removeAllListeners(eventName?: string): Emitter

/**
 * @method
 * @throws {TypeError} Invalid eventName
 * @throws {TypeError} Invalid listener
 */
removeListener(eventName: string, callback: Function): Emitter

/**
 * @method
 * @throws {TypeError} Invalid eventName
 */
rawListeners(eventName: string): Function[]
```

## Specifications
We strive to maintain complete code coverage in tests. With that, we provide all the necessary use cases for a good understanding of how this module works. See: [test/Emitter.spec.js](https://github.com/JadsonLucena/Emitter.mjs/blob/main/test/Emitter.spec.js)