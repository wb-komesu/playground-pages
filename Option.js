/**
 * @module Option
 * @example
 *  const { Option, None } = require('Option');
 *  const optionalValue = option(nullable());
 *  const processed =
 *  optionalValue
 *    .map(function(value){ return nullable(value); })
 *    .map(function(value){ return nullable(value); })
 *    .flatMap(function(value) {
 *      if (condition) {
 *        return option(someFn(value));
 *      }
 *      return none();
 *    })
 *    .getOr(defaultValue);
 *  const valueByMatch = optionalValue.match({
 *    Some: function(value){ return someFn(value); },
 *    None: function(){ throw new Error('must not be null!') }
 *  });
 */

/**
 * @callback MapFn
 * @template T, R
 * @param {T} value
 * @return {R}
 */

/**
 * @typedef Matcher
 * @template T, R
 * @property {function(T): R} Some
 * @property {function(): R} None
 */

/**
 * @template T
 * @constructor
 */
function None() {}

/**
 * @param {T} defaultValue
 * @return {T}
 */
None.prototype.getOr = function getOr(defaultValue) {
  return defaultValue;
};
/**
 * @param {function(): T} callback
 * @return {T}
 */
None.prototype.getOrElse = function getOrElse(callback) {
  return callback();
};
/**
 * @param  {function(): Some<T>|None<T>} callback
 * @return {Some<T>|None<T>}
 */
None.prototype.orElse = function orElse(callback) {
  return callback();
};
/**
 * @param _
 * @return {None<T>}
 */
None.prototype.map = function map(_) {
  return this;
};

/**
 * @return {None<T>}
 */
None.prototype.flatten = function flatten() {
  return this;
};

/**
 * @param _
 * @return {None<T>}
 */
None.prototype.flatMap = function flatMap(_) {
  return this;
};

/**
 * @template R
 * @param {Matcher} matcher
 * @return {R}
 */
None.prototype.match = function match(matcher) {
  return matcher.None();
};

/**
 * @param _
 * @return {None<T>}
 */
None.prototype.tap = function tap(_) {
  return this;
};

/**
 * @template T
 * @param {T} value
 * @constructor
 */
function Some(value) {
  this.value = value;
}

/**
 * @param _
 * @return {T}
 */
Some.prototype.getOr = function(_) {
  return this.value;
};

/**
 * @param _
 * @return {T}
 */
Some.prototype.getOrElse = function(_) {
  return this.value;
};

/**
 * @param _
 * @return {Some<T>}
 */
Some.prototype.orElse = function(_) {
  return this;
};

/**
 * @template T, R
 * @this {Some<T>}
 * @param {function(T): R} transformer
 * @return {Some<R>|None<R>}
 */
Some.prototype.map = function(transformer) {
  return option(transformer(this.value));
};

/**
 * @template R
 * @this {Some<Some<R>>|Some<R>}
 * @return {Some<R>}
 */
Some.prototype.flatten = function() {
  if (this.value instanceof Some) {
    return this.value;
  }
  return this;
};

/**
 * @template T, R
 * @this {Some<T>}
 * @param {function(T): Some<R>|None<R>} transformer
 * @return {Some<R>|None<R>}
 */
Some.prototype.flatMap = function(transformer) {
  return this.map(transformer).flatten();
};

/**
 * @template T, R
 * @this {Some<T>}
 * @param {Matcher<T, R>} matcher
 * @return {R}
 */
Some.prototype.match = function(matcher) {
  return matcher.Some(this.value);
};

/**
 * @param callback
 * @return {Some<T>}
 */
Some.prototype.tap = function(callback) {
  callback(this.value);
  return this;
};

/**
 * @template T
 * @return {None<T>}
 */
const none = function() {
  return new None();
};

/**
 * @template T
 * @param {T} value
 * @return {Some<T>|None<T>}
 */
function option(value) {
  if (value === undefined || value === null) {
    return new None();
  }
  return new Some(value);
}

module.exports = {
  Option: option,
  None: none
};
