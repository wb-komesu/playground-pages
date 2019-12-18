/**
 * @module Option
 * @example
 *  const { option, none } = require('Option');
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
 * @typedef OptionMatcher
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
 * @param {OptionMatcher} matcher
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
 * @return {boolean}
 */
None.prototype.isNone = function isNone() {
  return true;
};

/**
 * @return {boolean}
 */
None.prototype.isSome = function isSome() {
  return false;
};

/**
 * @template T
 * @param {T} value
 * @constructor
 */
function Some(value) {
  this.__value__ = value;
}

/**
 * @param _
 * @return {T}
 */
Some.prototype.getOr = function(_) {
  return this.__value__;
};

/**
 * @param _
 * @return {T}
 */
Some.prototype.getOrElse = function(_) {
  return this.__value__;
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
  return option(transformer(this.__value__));
};

/**
 * @template R
 * @this {Some<Some<R>>|Some<R>}
 * @return {Some<R>}
 */
Some.prototype.flatten = function() {
  const isOption =
    this.__value__ instanceof Some || this.__value__ instanceof None;
  if (isOption) {
    return this.__value__;
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
 * @param {OptionMatcher<T, R>} matcher
 * @return {R}
 */
Some.prototype.match = function(matcher) {
  return matcher.Some(this.__value__);
};

/**
 * @param {function(T): void} callback
 * @return {Some<T>}
 */
Some.prototype.tap = function(callback) {
  callback(this.__value__);
  return this;
};

/**
 * @return {boolean}
 */
Some.prototype.isNone = function isNone() {
  return false;
};

/**
 * @return {boolean}
 */
Some.prototype.isSome = function isSome() {
  return true;
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
