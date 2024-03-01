'use strict'

/**
 * @class
 * @classdesc Using the observer pattern, define listeners in your class
 */
class Emitter {
  #events
  #maxListeners

  /**
   * @constructor
   * @param {number} [maxListeners=10] - This is a useful default that helps finding memory leaks. The value must be contained in [0,+∞) and can be set to Infinity (or 0) to indicate an unlimited number of listeners. {@link https://nodejs.org/api/events.html#emittersetmaxlistenersn maxlisteners}
   *
   * @throws {TypeError} Invalid maxListeners
   */
  constructor (maxListeners) {
    this.#events = {}
    this.maxListeners = maxListeners
  }

  /**
   * @return {string[]}
   */
  get eventNames () {
    return Object.keys(this.#events)
  }

  /**
   * @return {number}
   */
  get maxListeners () {
    return this.#maxListeners
  }

  /**
   * This is a useful default that helps finding memory leaks. The value must be contained in [0,+∞) and can be set to Infinity (or 0) to indicate an unlimited number of listeners
   * @type {number}
   * @default 10
   *
   * @throws {TypeError} Invalid maxListeners
   *
   * @see https://nodejs.org/api/events.html#emittersetmaxlistenersn
   */
  set maxListeners (maxListeners = 10) {
    if (
      (
        !Number.isInteger(maxListeners) &&
        maxListeners !== Infinity
      ) ||
      maxListeners < 0
    ) {
      throw new TypeError('Invalid maxListeners')
    }

    if (Object.keys(this.#events).some(eventName => maxListeners < this.#events[eventName].length)) {
      throw new Error('Memory leak detected')
    }

    this.#maxListeners = maxListeners
  }

  /**
   * @method
   * @param {string} eventName
   * @param {...*} args
   *
   * @throws {TypeError} Invalid eventName
   *
   * @return {Promise<boolean>}
   */
  async emit (eventName, ...args) {
    if (
      typeof eventName !== 'string' ||
      !eventName.trim()
    ) {
      throw new TypeError('Invalid eventName')
    }

    if (eventName in this.#events) {
      await Promise.allSettled(this.#events[eventName].map(event => event.listener(...args)))

      this.#events[eventName].forEach((event, index) => {
        if (event.isOnce) {
          this.#removeEventListener(eventName, index)
        }
      })

      return true
    }

    return false
  }

  /**
   * @method
   * @param {string} eventName
   * @param {Function} listener
   *
   * @throws {TypeError} Invalid eventName
   * @throws {TypeError} Invalid listener
   * @throws {Error} Memory leak detected
   *
   * @return {Emitter}
   */
  addListener (eventName, listener) {
    return this.#addEventListener(eventName, listener)
  }

  /**
   * @method
   * @param {string} eventName
   * @param {Function} [listener]
   *
   * @throws {TypeError} Invalid eventName
   * @throws {TypeError} Invalid listener
   *
   * @return {number}
   */
  listenerCount (eventName, listener) {
    if (
      typeof eventName !== 'string' ||
      !eventName.trim()
    ) {
      throw new TypeError('Invalid eventName')
    }
    if (
      typeof listener !== 'undefined' &&
      typeof listener !== 'function'
    ) {
      throw new TypeError('Invalid listener')
    }

    if (!(eventName in this.#events)) {
      return 0
    }

    if (listener) {
      return this.#events[eventName].filter(event => event.listener === listener).length
    }

    return this.#events[eventName].length
  }

  /**
   * @method
   * @param {string} eventName
   *
   * @throws {TypeError} Invalid eventName
   *
   * @return {Function[]}
   */
  listeners (eventName) {
    if (
      typeof eventName !== 'string' ||
      !eventName.trim()
    ) {
      throw new TypeError('Invalid eventName')
    } else if (!(eventName in this.#events)) {
      return []
    }

    return this.#events[eventName].filter(event => !event.isOnce).map(event => event.listener)
  }

  /**
   * @method
   * @param {string} eventName
   * @param {Function} listener
   *
   * @throws {TypeError} Invalid eventName
   * @throws {TypeError} Invalid listener
   *
   * @return {Emitter}
   */
  off (eventName, listener) {
    return this.removeListener(eventName, listener)
  }

  /**
   * @method
   * @param {string} eventName
   * @param {Function} listener
   *
   * @throws {TypeError} Invalid eventName
   * @throws {TypeError} Invalid listener
   * @throws {Error} Memory leak detected
   *
   * @return {Emitter}
   */
  on (eventName, listener) {
    return this.addListener(eventName, listener)
  }

  /**
   * @method
   * @param {string} eventName
   * @param {Function} listener
   *
   * @throws {TypeError} Invalid eventName
   * @throws {TypeError} Invalid listener
   * @throws {Error} Memory leak detected
   *
   * @return {Emitter}
   */
  once (eventName, listener) {
    return this.#addEventListener(eventName, listener, {
      isOnce: true
    })
  }

  /**
   * @method
   * @param {string} eventName
   * @param {Function} listener
   *
   * @throws {TypeError} Invalid eventName
   * @throws {TypeError} Invalid listener
   * @throws {Error} Memory leak detected
   *
   * @return {Emitter}
   */
  prependListener (eventName, listener) {
    return this.#addEventListener(eventName, listener, {
      isPrepend: true
    })
  }

  /**
   * @method
   * @param {string} eventName
   * @param {Function} listener
   *
   * @throws {TypeError} Invalid eventName
   * @throws {TypeError} Invalid listener
   * @throws {Error} Memory leak detected
   *
   * @return {Emitter}
   */
  prependOnceListener (eventName, listener) {
    return this.#addEventListener(eventName, listener, {
      isOnce: true,
      isPrepend: true
    })
  }

  /**
   * @method
   * @param {string} [eventName]
   *
   * @throws {TypeError} Invalid eventName
   *
   * @return {Emitter}
   */
  removeAllListeners (eventName) {
    if (
      typeof eventName !== 'undefined' && (
        typeof eventName !== 'string' ||
        !eventName.trim()
      )
    ) {
      throw new TypeError('Invalid eventName')
    }

    if (!eventName) {
      this.#events = {}
    } else if (eventName in this.#events) {
      delete this.#events[eventName]
    }

    return this
  }

  /**
   * @method
   * @param {string} eventName
   * @param {Function} listener
   *
   * @throws {TypeError} Invalid eventName
   * @throws {TypeError} Invalid listener
   *
   * @return {Emitter}
   */
  removeListener (eventName, listener) {
    if (
      typeof eventName !== 'string' ||
      !eventName.trim()
    ) {
      throw new TypeError('Invalid eventName')
    }
    if (typeof listener !== 'function') {
      throw new TypeError('Invalid listener')
    }

    if (eventName in this.#events) {
      const index = this.#events[eventName].findIndex(event => event.listener === listener)

      if (index > -1) {
        this.#removeEventListener(eventName, index)
      }
    }

    return this
  }

  /**
   * @method
   * @param {string} eventName
   *
   * @throws {TypeError} Invalid eventName
   *
   * @return {Function[]}
   */
  rawListeners (eventName) {
    if (
      typeof eventName !== 'string' ||
      !eventName.trim()
    ) {
      throw new TypeError('Invalid eventName')
    } else if (!(eventName in this.#events)) {
      return []
    }

    return this.#events[eventName].map(event => event.listener)
  }

  #addEventListener (eventName, listener, {
    isPrepend = false,
    isOnce = false
  } = {}) {
    if (
      typeof eventName !== 'string' ||
      !eventName.trim()
    ) {
      throw new TypeError('Invalid eventName')
    }
    if (typeof listener !== 'function') {
      throw new TypeError('Invalid listener')
    }

    eventName = eventName.trim()

    if (!(eventName in this.#events)) {
      this.#events[eventName] = []
    }

    if (this.#events[eventName].length + 1 > this.#maxListeners) {
      throw new Error('Memory leak detected')
    }

    if (isPrepend) {
      this.#events[eventName].unshift({
        isOnce,
        listener
      })
    } else {
      this.#events[eventName].push({
        isOnce,
        listener
      })
    }

    return this
  }

  #removeEventListener (eventName, index) {
    this.#events[eventName].splice(index, 1)

    if (this.#events[eventName].length === 0) {
      delete this.#events[eventName]
    }
  }
}

export default Emitter
