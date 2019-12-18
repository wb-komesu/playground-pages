/**
 * @module Result
 */

/**
 * @typedef ResultMatcher
 * @template T, E, R
 * @property {function(T): R} Ok
 * @property {function(E): R} Err
 */

/**
 * @template T, E
 * @param {T} value
 * @constructor
 */
function Ok(value) {
  this.__value__ = value;
}

/**
 * @param _
 * @return {T}
 */
Ok.prototype.getOr = function getOr(_) {
  return this.__value__;
};

/**
 * @param _
 * @return {T}
 */
Ok.prototype.getOrElse = function getOrElse(_) {
  return this.__value__;
};

/**
 * @param _
 * @return {Ok<T, E>}
 */
Ok.prototype.orElse = function orElse(_) {
  return this;
};

Ok.prototype.catch = Ok.prototype.orElse;

/**
 * @template T, E, R
 * @this {Ok<T, E>}
 * @param {function(T): R} transformer
 * @return {Ok}
 */
Ok.prototype.map = function map(transformer) {
  return new Ok(transformer(this.__value__));
};

/**
 * @param _
 * @return {Ok<T, E>}
 */
Ok.prototype.mapErr = function mapError(_) {
  return this;
};

/**
 * @template R, E1, E2
 * @this {Ok<R, E1>|Ok<Ok<R, E1>, E2>}
 * @return {Ok<R, E1>|Err<R, E2>}
 */
Ok.prototype.flatten = function flatten() {
  const isOption =
    this.__value__ instanceof Ok || this.__value__ instanceof Err;
  if (isOption) {
    return this.__value__;
  }
  return this;
};

/**
 * @template T, E, R
 * @this {Ok<T, E>}
 * @param {function(T): Ok<R, E>} transformer
 * @return {Ok<R, E>}
 */
Ok.prototype.flatMap = function flatMap(transformer) {
  return transformer(this.__value__).flatten();
};

Ok.prototype.then = Ok.prototype.flatMap;

/**
 * @template T, E, R
 * @this {Ok<T, E>}
 * @param {ResultMatcher} matcher
 * @return {R}
 */
Ok.prototype.match = function match(matcher) {
  return matcher.Ok(this.__value__);
};

/**
 * @param {function(T): void} callback
 * @return {Ok<T, E>}
 */
Ok.prototype.tap = function tap(callback) {
  callback(this.__value__);
  return this;
};

/**
 * @param _
 * @return {Ok<T, E>}
 */
Ok.prototype.tapError = function tapError(_) {
  return this;
};

/**
 * @return {boolean}
 */
Ok.prototype.isOk = function isOk() {
  return true;
};

/**
 * @return {boolean}
 */
Ok.prototype.isErr = function isErr() {
  return false;
};

/**
 * @template T, E
 * @param {E} error
 * @constructor
 */
function Err(error) {
  this.__error__ = error;
}

/**
 * @param {T} defaultValue
 * @return {T}
 */
Err.prototype.getOr = function(defaultValue) {
  return defaultValue;
};

/**
 * @param {function(E): T} handler
 * @return {T}
 */
Err.prototype.getOrElse = function(handler) {
  return handler(this.__error__);
};

/**
 * @template T, E1, E2
 * @this {Err<T, E1>}
 * @param {function(E1): Ok<T, E2>|Err<T, E2>} handler
 * @return {Ok<T, E2>|Err<T, E2>}
 */
Err.prototype.orElse = function orElse(handler) {
  return handler(this.__error__);
};

Err.prototype.catch = Ok.prototype.orElse;

/**
 * @param _
 * @return {Err<T, E>}
 */
Err.prototype.map = function map(_) {
  return this;
};

/**
 * @template T, E1, E2
 * @this {Err<T, E>}
 * @param {function(E1): E2} transformer
 * @return {Err<T, E2>}
 */
Err.prototype.mapErr = function mapError(transformer) {
  return new Err(transformer(this.__value__));
};

/**
 * @return {Err<T, E>}
 */
Err.prototype.flatten = function flatten() {
  return this;
};

/**
 * @template T, E, R
 * @param {function(T): Ok<R, E>} _
 * @return {Err<R, E>}
 */
Err.prototype.flatMap = function flatMap(_) {
  return this;
};

Err.prototype.then = Err.prototype.flatMap;

/**
 * @template T, E, R
 * @param {ResultMatcher<T, E, R>} matcher
 * @return {R}
 */
Err.prototype.match = function match(matcher) {
  return matcher.Err(this.__error__);
};

/**
 * @return {Err<T, E>}
 */
Err.prototype.tap = function tap(_) {
  return this;
};

/**
 * @param {function(E): void} callback
 * @return {Err<T, E>}
 */
Err.prototype.tapError = function tapError(callback) {
  callback(this.__error__);
  return this;
};

/**
 * @return {boolean}
 */
Err.prototype.isOk = function isOk() {
  return false;
};

/**
 * @return {boolean}
 */
Err.prototype.isErr = function isErr() {
  return true;
};

/**
 * @template T, E
 * @param {T} value
 * @return {Ok<T>}
 */
function ok(value) {
  return new Ok(value);
}

/**
 * @template T, E
 * @param {E} error
 * @return {Err<T, E>}
 */
function err(error) {
  return new Err(error);
}

module.exports = {
  Ok: ok,
  Err: err
};
