import { jest, expect, test } from '@jest/globals'

import Emitter from '../src/Emitter.js'

const INVALID_INPUT_TYPES = [
  '',
  {},
  [],
  NaN,
  false,
  null
]

describe('Constructor', () => {
  test('Given that we want to instantiate the object with an invalid argument', () => {
    INVALID_INPUT_TYPES.concat(-1, () => {}).forEach(input => expect(() => new Emitter(input)).toThrowError())
  })
  test('Given that we want to instantiate the object with a valid argument', () => {
    expect(() => new Emitter()).not.toThrow()
    expect(new Emitter().maxListeners).toBe(10)

    const emitter = new Emitter(15)

    expect(emitter.maxListeners).toBe(15)

    emitter.maxListeners = 5
    expect(emitter.maxListeners).toBe(5)

    emitter.maxListeners = undefined
    expect(emitter.maxListeners).toBe(10)

    expect(emitter.eventNames.length).toBe(0)
  })
})

describe('Methods', () => {
  test('Given that we want to append a listener', () => {
    const emitter = new Emitter()

    const eventName = 'test'
    const listener = () => {}

    INVALID_INPUT_TYPES.concat(0, Infinity, () => {}, undefined).forEach(input => {
      expect(() => emitter.addListener(input, listener)).toThrowError(new TypeError('Invalid eventName'))
      expect(() => emitter.on(input, listener)).toThrowError(new TypeError('Invalid eventName'))
    })
    INVALID_INPUT_TYPES.concat(0, Infinity, undefined).forEach(input => {
      expect(() => emitter.addListener(eventName, input)).toThrowError(new TypeError('Invalid listener'))
      expect(() => emitter.on(eventName, input)).toThrowError(new TypeError('Invalid listener'))
    })

    expect(emitter
      .addListener(eventName, listener)
      .on(eventName, listener)).toBeInstanceOf(Emitter)
    expect(emitter.eventNames).toEqual([eventName])

    expect(() => {
      emitter.maxListeners = 1
    }).toThrowError(new Error('Memory leak detected'))

    emitter.maxListeners = 2

    expect(() => emitter.addListener(eventName, listener)).toThrowError(new Error('Memory leak detected'))
  })
  test('Given that we want to get the raw listeners', () => {
    const emitter = new Emitter()

    const eventName = 'test'
    const listener1 = () => {}
    const listener2 = () => {}

    INVALID_INPUT_TYPES.concat(0, Infinity, () => {}, undefined).forEach(input => {
      expect(() => emitter.rawListeners(input)).toThrowError(new TypeError('Invalid eventName'))
    })

    expect(emitter.rawListeners(eventName)).toEqual([])

    expect(emitter
      .on(eventName, listener1)
      .on(eventName, listener2)).toBeInstanceOf(Emitter)

    expect(emitter.rawListeners(eventName)).toEqual([listener1, listener2])
  })
  test('Given that we want to prepend a listener', () => {
    const emitter = new Emitter()

    const eventName = 'test'
    const listener1 = () => {}
    const listener2 = () => {}

    INVALID_INPUT_TYPES.concat(0, Infinity, () => {}, undefined).forEach(input => {
      expect(() => emitter.prependListener(input, listener1)).toThrowError(new TypeError('Invalid eventName'))
    })
    INVALID_INPUT_TYPES.concat(0, Infinity, undefined).forEach(input => {
      expect(() => emitter.prependListener(eventName, input)).toThrowError(new TypeError('Invalid listener'))
    })

    expect(emitter
      .on(eventName, listener1)
      .prependListener(eventName, listener2)).toBeInstanceOf(Emitter)

    expect(emitter.rawListeners(eventName)).toEqual([listener2, listener1])
  })
  test('Given that we want to emit an event', async () => {
    const emitter = new Emitter()

    const eventName = 'test'
    const listener = jest.fn()

    emitter.on(eventName, listener)

    for (const input of INVALID_INPUT_TYPES.concat(0, Infinity, () => {}, undefined)) {
      await expect(() => emitter.emit(input, 'arg')).rejects.toThrowError(new TypeError('Invalid eventName'))
    }

    await expect(emitter.emit('foo', 'bar')).resolves.toBeFalsy()
    expect(listener).not.toHaveBeenCalled()
    await expect(emitter.emit(eventName, 'arg')).resolves.toBeTruthy()
    expect(listener).toHaveBeenCalled()
  })
  test('Given that we want to count the listeners', async () => {
    const emitter = new Emitter()

    const eventName = 'test'
    const listener1 = () => {}
    const listener2 = () => {}

    INVALID_INPUT_TYPES.concat(0, Infinity, () => {}, undefined).forEach(input => {
      expect(() => emitter.listenerCount(input, listener1)).toThrowError(new TypeError('Invalid eventName'))
    })
    INVALID_INPUT_TYPES.concat(0, Infinity).forEach(input => {
      expect(() => emitter.listenerCount(eventName, input)).toThrowError(new TypeError('Invalid listener'))
    })

    expect(emitter
      .on(eventName, listener1)
      .on(eventName, listener2)).toBeInstanceOf(Emitter)

    expect(emitter.listenerCount(eventName)).toBe(2)
    expect(emitter.listenerCount(eventName, listener1)).toBe(1)
    expect(emitter.listenerCount(eventName, listener2)).toBe(1)
  })
  test('Given that we want to push a once listener', async () => {
    const emitter = new Emitter()

    const eventName = 'test'
    const listener1 = () => {}
    const listener2 = () => {}
    const listener3 = () => {}

    INVALID_INPUT_TYPES.concat(0, Infinity, () => {}, undefined).forEach(input => {
      expect(() => emitter.once(input, listener1)).toThrowError(new TypeError('Invalid eventName'))
      expect(() => emitter.prependOnceListener(input, listener1)).toThrowError(new TypeError('Invalid eventName'))
    })
    INVALID_INPUT_TYPES.concat(0, Infinity, undefined).forEach(input => {
      expect(() => emitter.once(eventName, input)).toThrowError(new TypeError('Invalid listener'))
      expect(() => emitter.prependOnceListener(eventName, input)).toThrowError(new TypeError('Invalid listener'))
    })

    expect(emitter
      .on(eventName, listener1)
      .once(eventName, listener2)
      .prependOnceListener(eventName, listener3)).toBeInstanceOf(Emitter)
    expect(emitter.listenerCount(eventName)).toBe(3)
    expect(emitter.rawListeners(eventName)).toEqual([listener3, listener1, listener2])

    await expect(emitter.emit(eventName, 'arg')).resolves.toBeTruthy()

    expect(emitter.listenerCount(eventName)).toBe(1)
    expect(emitter.listenerCount(eventName, listener1)).toBe(1)
  })
  test('Given that we want to get the listener count', () => {
    const emitter = new Emitter()

    const eventName = 'test'
    const listener1 = () => {}
    const listener2 = () => {}

    expect(emitter
      .addListener(eventName, listener1)
      .on(eventName, listener1)
      .addListener(eventName, listener2)).toBeInstanceOf(Emitter)

    expect(emitter.eventNames).toEqual([eventName])
    expect(emitter.listenerCount(eventName)).toBe(3)
    expect(emitter.listenerCount(eventName, listener1)).toBe(2)
    expect(emitter.listenerCount(eventName, listener2)).toBe(1)
  })
  test('Given that we want to remove listener', () => {
    const emitter = new Emitter()

    const eventName = 'test'
    const listener1 = () => {}
    const listener2 = () => {}

    INVALID_INPUT_TYPES.concat(0, Infinity, () => {}, undefined).forEach(input => {
      expect(() => emitter.removeListener(input, listener1)).toThrowError(new TypeError('Invalid eventName'))
      expect(() => emitter.off(input, listener1)).toThrowError(new TypeError('Invalid eventName'))
    })
    INVALID_INPUT_TYPES.concat(0, Infinity, undefined).forEach(input => {
      expect(() => emitter.removeListener(eventName, input)).toThrowError(new TypeError('Invalid listener'))
      expect(() => emitter.off(eventName, input)).toThrowError(new TypeError('Invalid listener'))
    })

    expect(emitter
      .on(eventName, listener1)
      .on(eventName, listener2)).toBeInstanceOf(Emitter)

    expect(emitter.listenerCount(eventName)).toBe(2)

    expect(emitter.removeListener(eventName, () => {})).toBeInstanceOf(Emitter)
    expect(emitter.removeListener(eventName, listener1)).toBeInstanceOf(Emitter)

    expect(emitter.listenerCount(eventName, listener1)).toBe(0)
    expect(emitter.listenerCount(eventName, listener2)).toBe(1)

    expect(emitter.on(eventName, listener1)).toBeInstanceOf(Emitter)

    expect(emitter.listenerCount(eventName)).toBe(2)

    expect(emitter.off(eventName, listener1)).toBeInstanceOf(Emitter)

    expect(emitter.listenerCount(eventName, listener1)).toBe(0)
    expect(emitter.listenerCount(eventName, listener2)).toBe(1)

    expect(emitter.off(eventName, listener2)).toBeInstanceOf(Emitter)

    expect(emitter.listenerCount(eventName)).toBe(0)

    expect(emitter.removeListener(eventName, listener1)).toBeInstanceOf(Emitter)
  })
  test('Given that we want to remove all listeners', () => {
    const emitter = new Emitter()

    const eventName1 = 'test1'
    const eventName2 = 'test2'
    const listener1 = () => {}
    const listener2 = () => {}

    INVALID_INPUT_TYPES.concat(0, Infinity, () => {}).forEach(input => {
      expect(() => emitter.removeAllListeners(input)).toThrowError(new TypeError('Invalid eventName'))
    })

    expect(emitter
      .on(eventName1, listener1)
      .on(eventName1, listener2)).toBeInstanceOf(Emitter)

    expect(emitter
      .on(eventName2, listener1)
      .on(eventName2, listener2)).toBeInstanceOf(Emitter)

    expect(emitter.listenerCount(eventName1)).toBe(2)
    expect(emitter.listenerCount(eventName2)).toBe(2)

    expect(emitter.removeAllListeners(eventName1)).toBeInstanceOf(Emitter)

    expect(emitter.listenerCount(eventName1)).toBe(0)
    expect(emitter.listenerCount(eventName2)).toBe(2)

    expect(emitter.removeAllListeners()).toBeInstanceOf(Emitter)

    expect(emitter.listenerCount(eventName2)).toBe(0)
    expect(emitter.eventNames.length).toBe(0)

    expect(emitter.removeAllListeners(eventName1)).toBeInstanceOf(Emitter)
  })
  test('Given that we want to get the listeners', () => {
    const emitter = new Emitter()

    const eventName = 'test'
    const listener1 = () => {}
    const listener2 = () => {}
    const listener3 = () => {}
    const listener4 = () => {}

    INVALID_INPUT_TYPES.concat(0, Infinity, () => {}, undefined).forEach(input => {
      expect(() => emitter.listeners(input)).toThrowError(new TypeError('Invalid eventName'))
    })

    expect(emitter.listeners(eventName)).toEqual([])

    expect(emitter
      .on(eventName, listener1)
      .once(eventName, listener2)
      .prependOnceListener(eventName, listener3)
      .on(eventName, listener4)).toBeInstanceOf(Emitter)

    expect(emitter.listeners(eventName)).toEqual([listener1, listener4])
  })
})
