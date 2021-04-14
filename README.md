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
