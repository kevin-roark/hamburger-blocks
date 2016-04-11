(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Natural Compare
 * https://github.com/woollybogger/string-natural-compare
 *
 * @version 1.1.1
 * @copyright 2015 Nathan Woltman
 * @license MIT https://github.com/woollybogger/string-natural-compare/blob/master/LICENSE.txt
 */

(function() {
  'use strict';

  var alphabet;
  var alphabetIndexMap;
  var alphabetIndexMapLength = 0;

  function isNumberCode(code) {
    return code >= 48 && code <= 57;
  }

  function naturalCompare(a, b) {
    var lengthA = (a += '').length;
    var lengthB = (b += '').length;
    var aIndex = 0;
    var bIndex = 0;
    var alphabetIndexA;
    var alphabetIndexB;

    while (aIndex < lengthA && bIndex < lengthB) {
      var charCodeA = a.charCodeAt(aIndex);
      var charCodeB = b.charCodeAt(bIndex);

      if (isNumberCode(charCodeA)) {
        if (!isNumberCode(charCodeB)) {
          return charCodeA - charCodeB;
        }

        var numStartA = aIndex;
        var numStartB = bIndex;

        while (charCodeA === 48 && ++numStartA < lengthA) {
          charCodeA = a.charCodeAt(numStartA);
        }
        while (charCodeB === 48 && ++numStartB < lengthB) {
          charCodeB = b.charCodeAt(numStartB);
        }

        var numEndA = numStartA;
        var numEndB = numStartB;

        while (numEndA < lengthA && isNumberCode(a.charCodeAt(numEndA))) {
          ++numEndA;
        }
        while (numEndB < lengthB && isNumberCode(b.charCodeAt(numEndB))) {
          ++numEndB;
        }

        var numLengthA = numEndA - numStartA;
        var numLengthB = numEndB - numStartB;

        if (numLengthA < numLengthB) {
          return -1;
        }
        if (numLengthA > numLengthB) {
          return 1;
        }

        if (numLengthA) {
          var numA = a.slice(numStartA, numEndA);
          var numB = b.slice(numStartB, numEndB);

          if (numA < numB) {
            return -1;
          }
          if (numA > numB) {
            return 1;
          }
        }

        aIndex = numEndA;
        bIndex = numEndB;
        continue;
      }

      if (charCodeA !== charCodeB) {
        if (
          alphabetIndexMapLength &&
          charCodeA < alphabetIndexMapLength &&
          charCodeB < alphabetIndexMapLength &&
          (alphabetIndexA = alphabetIndexMap[charCodeA]) !== -1 &&
          (alphabetIndexB = alphabetIndexMap[charCodeB]) !== -1
        ) {
          return alphabetIndexA - alphabetIndexB;
        }

        return charCodeA - charCodeB;
      }

      ++aIndex;
      ++bIndex;
    }

    return lengthA - lengthB;
  }

  Object.defineProperties(String, {
    alphabet: {
      get: function() {
        return alphabet;
      },
      set: function(value) {
        alphabet = value;
        alphabetIndexMap = [];
        var i = 0;
        if (alphabet) {
          for (; i < alphabet.length; i++) {
            alphabetIndexMap[alphabet.charCodeAt(i)] = i;
          }
        }
        alphabetIndexMapLength = alphabetIndexMap.length;
        for (i = 0; i < alphabetIndexMapLength; i++) {
          if (i in alphabetIndexMap) continue;
          alphabetIndexMap[i] = -1;
        }
      },
    },
    naturalCompare: {
      value: naturalCompare,
      configurable: true,
      writable: true,
    },
    naturalCaseCompare: {
      value: function(a, b) {
        return naturalCompare(('' + a).toLowerCase(), ('' + b).toLowerCase());
      },
      configurable: true,
      writable: true,
    },
  });

})();

},{}],2:[function(require,module,exports){
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Include a performance.now polyfill
(function () {

	if ('performance' in window === false) {
		window.performance = {};
	}

	// IE 8
	Date.now = (Date.now || function () {
		return new Date().getTime();
	});

	if ('now' in window.performance === false) {
		var offset = window.performance.timing && window.performance.timing.navigationStart ? window.performance.timing.navigationStart
		                                                                                    : Date.now();

		window.performance.now = function () {
			return Date.now() - offset;
		};
	}

})();

var TWEEN = TWEEN || (function () {

	var _tweens = [];

	return {

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function (tween) {

			_tweens.push(tween);

		},

		remove: function (tween) {

			var i = _tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : window.performance.now();

			while (i < _tweens.length) {

				if (_tweens[i].update(time)) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}

			}

			return true;

		}
	};

})();

TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for (var field in object) {
		_valuesStart[field] = parseFloat(object[field], 10);
	}

	this.to = function (properties, duration) {

		if (duration !== undefined) {
			_duration = duration;
		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function (time) {

		TWEEN.add(this);

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : window.performance.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			_valuesStart[property] = _object[property];

			if ((_valuesStart[property] instanceof Array) === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;

		}

		return this;

	};

	this.stop = function () {

		if (!_isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object);
		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}

	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function (times) {

		_repeat = times;
		return this;

	};

	this.yoyo = function (yoyo) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function (easing) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function (callback) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function (time) {

		var property;
		var elapsed;
		var value;

		if (time < _startTime) {
			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {
				_onStartCallback.call(_object);
			}

			_onStartCallbackFired = true;

		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.startsWith('+') || end.startsWith('-')) {
						end = start + parseFloat(end, 10);
					} else {
						end = parseFloat(end, 10);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					_object[property] = start + (end - start) * value;
				}

			}

		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof (_valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[property];

						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}

					_valuesStart[property] = _valuesStartRepeat[property];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if (_onCompleteCallback !== null) {
					_onCompleteCallback.call(_object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[i].start(_startTime + _duration);
				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));

		},

		Out: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);

		},

		InOut: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			if ((k *= 2) < 1) {
				return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
			}

			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (typeof define === 'function' && define.amd) {

		// AMD
		define([], function () {
			return TWEEN;
		});

	} else if (typeof module !== 'undefined' && typeof exports === 'object') {

		// Node.js
		module.exports = TWEEN;

	} else if (root !== undefined) {

		// Global variable
		root.TWEEN = TWEEN;

	}

})(this);

},{}],3:[function(require,module,exports){
module.exports={"path":"media/","videos":[{"filename":"appliance/appliance-1.mp4","duration":16,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"appliance/appliance-2.mp4","duration":10.304,"volumeInfo":{"mean":-91,"max":-91},"tags":[]},{"filename":"appliance/appliance-3.mp4","duration":16,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"appliance/appliance-4.mp4","duration":24.859,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-1.mp4","duration":8.342,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-2.mp4","duration":15.32,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-3.mp4","duration":28.295,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-4.mp4","duration":11.011,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-5.mp4","duration":18.227,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-6.mp4","duration":18.886,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-7.mp4","duration":15.516,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-8.mp4","duration":24.358,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-9.mp4","duration":16.934,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-10.mp4","duration":16.951,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-11.mp4","duration":24.567,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-12.mp4","duration":17.727,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-13.mp4","duration":25.234,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-14.mp4","duration":17.318,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-15.mp4","duration":16.784,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-16.mp4","duration":12.847,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"burger/burger-17.mp4","duration":16.65,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"chef/chef-1.mp4","duration":12.713,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"chef/chef-2.mp4","duration":14.059,"volumeInfo":{"mean":-30.5,"max":-2.5},"tags":[]},{"filename":"chef/chef-3.mp4","duration":15.499,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"chef/chef-4.mp4","duration":14.148,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"chef/chef-5.mp4","duration":8.142,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"chef/chef-6.mp4","duration":13.481,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-1.mp4","duration":26.944,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-2.mp4","duration":14.615,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-3.mp4","duration":10.945,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-4.mp4","duration":15.933,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-5.mp4","duration":21.272,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-6.mp4","duration":31.182,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-7.mp4","duration":12.672,"volumeInfo":{"mean":-29.6,"max":0},"tags":[]},{"filename":"cooking/cooking-8.mp4","duration":15.683,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-9.mp4","duration":13.614,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-10.mp4","duration":18.352,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-11.mp4","duration":50.926,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-12.mp4","duration":21.155,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-13.mp4","duration":18.352,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-14.mp4","duration":14.915,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-15.mp4","duration":21.272,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-16.mp4","duration":20.721,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cooking/cooking-17.mp4","duration":24.192,"volumeInfo":{"mean":-91,"max":-91},"tags":[]},{"filename":"cows/cows-1.mp4","duration":17.942,"volumeInfo":{"mean":-90.3,"max":-78.3},"tags":[]},{"filename":"cows/cows-2.mp4","duration":17.952,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cows/cows-3.mp4","duration":10.667,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cows/cows-4.mp4","duration":10.24,"volumeInfo":{"mean":-90.3,"max":-78.3},"tags":[]},{"filename":"cows/cows-5.mp4","duration":9.739,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cows/cows-6.mp4","duration":14.215,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cows/cows-7.mp4","duration":12.967,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"cows/cows-8.mp4","duration":13.974,"volumeInfo":{"mean":-38.2,"max":-15},"tags":[]},{"filename":"cows/cows-9.mp4","duration":7.908,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"eat/eat-1.mp4","duration":15.149,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"eat/eat-2.mp4","duration":15.84,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"eat/eat-3.mp4","duration":18.886,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"eat/eat-4.mp4","duration":31.966,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"eat/eat-5.mp4","duration":21.322,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"eat/eat-6.mp4","duration":24.125,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"eat/eat-7.mp4","duration":8.242,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"eat/eat-8.mp4","duration":14.39,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"eat/eat-9.mp4","duration":10.136,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"fire/fire-1.mp4","duration":16,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"fire/fire-2.mp4","duration":16,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"fire/fire-3.mp4","duration":16,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"fire/fire-4.mp4","duration":18.686,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"fire/fire-5.mp4","duration":16,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"fire/fire-6.mp4","duration":16,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"fire/fire-7.mp4","duration":13.914,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"food/food-1.mp4","duration":25.826,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"food/food-2.mp4","duration":24.384,"volumeInfo":{"mean":-91,"max":-91},"tags":[]},{"filename":"food/food-3.mp4","duration":24.256,"volumeInfo":{"mean":-91,"max":-91},"tags":[]},{"filename":"food/food-5.mp4","duration":24.492,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"food/food-6.mp4","duration":10.01,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"food/food-7.mp4","duration":10.111,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"food/food-10.mp4","duration":20.63,"volumeInfo":{"mean":-32.5,"max":-2.9},"tags":[]},{"filename":"food/food-11.mp4","duration":16.717,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"franchise/franchise-1.mp4","duration":13.948,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"franchise/franchise-2.mp4","duration":13.447,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"gold/gold-1.mp4","duration":16,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"gold/gold-2.mp4","duration":15.015,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"gold/gold-3.mp4","duration":16.684,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"gold/gold-4.mp4","duration":8,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"gold/gold-5.mp4","duration":16.484,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"gold/gold-6.mp4","duration":12.012,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"gold/gold-7.mp4","duration":15.049,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"money/money-1.mp4","duration":28.821,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"money/money-2.mp4","duration":16,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"money/money-3.mp4","duration":13.18,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"money/money-4.mp4","duration":16,"volumeInfo":{"mean":null,"max":null},"tags":[]},{"filename":"money/money-5.mp4","duration":21.387,"volumeInfo":{"mean":null,"max":null},"tags":[]}],"audio":[{"filename":"feed_the_streets.mp3","duration":130.415011,"volumeInfo":{"mean":-12.3,"max":0},"tags":[]}],"frames":[]}
},{}],4:[function(require,module,exports){
'use strict';

(function () {
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  if (!isChrome && !false) {
    console.log('only chrome is supported for now...');
    return;
  }

  var frampton = require('../../src/web-frampton');
  var mediaConfig = require('./media_config.json');

  var timing = [{
    "time": 0,
    "tag": "fire",
    "start": 0
  }, {
    "time": 3.533333333333333,
    "tag": "cows",
    "start": 0
  }, {
    "time": 5.233333333333333,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 7.333333333333333,
    "tag": "chef",
    "start": 0
  }, {
    "time": 8.166666666666666,
    "tag": "burger",
    "start": 0
  }, {
    "time": 8.533333333333333,
    "tag": "food",
    "start": 0
  }, {
    "time": 8.933333333333334,
    "tag": "eat",
    "start": 0
  }, {
    "time": 10.333333333333334,
    "tag": "appliance",
    "start": 0
  }, {
    "time": 12.266666666666667,
    "tag": "franchise",
    "start": 0
  }, {
    "time": 13.666666666666666,
    "tag": "gold",
    "start": 0
  }, {
    "time": 15.633333333333333,
    "tag": "money",
    "start": 0
  }, {
    "time": 16.333333333333332,
    "tag": "burger",
    "start": 0
  }, {
    "time": 17.166666666666668,
    "tag": "food",
    "start": 0
  }, {
    "time": 18.466666666666665,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 20.6,
    "tag": "fire",
    "start": 0
  }, {
    "time": 22.3,
    "tag": "money",
    "start": 0
  }, {
    "time": 23.633333333333333,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 24,
    "tag": "burger",
    "start": 0
  }, {
    "time": 25.333333333333332,
    "tag": "money",
    "start": 0
  }, {
    "time": 26.2,
    "tag": "cows",
    "start": 0
  }, {
    "time": 27.866666666666667,
    "tag": "cows",
    "start": 0
  }, {
    "time": 30.433333333333334,
    "tag": "burger",
    "start": 0
  }, {
    "time": 31.8,
    "tag": "burger",
    "start": 0
  }, {
    "time": 34.3,
    "tag": "eat",
    "start": 0
  }, {
    "time": 37.666666666666664,
    "tag": "money",
    "start": 0
  }, {
    "time": 39.4,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 41.1,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 42.8,
    "tag": "burger",
    "start": 0
  }, {
    "time": 43.666666666666664,
    "tag": "food",
    "start": 0
  }, {
    "time": 44.13333333333333,
    "tag": "money",
    "start": 0
  }, {
    "time": 44.56666666666667,
    "tag": "food",
    "start": 0
  }, {
    "time": 45.833333333333336,
    "tag": "burger",
    "start": 0
  }, {
    "time": 46.666666666666664,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 47.53333333333333,
    "tag": "fire",
    "start": 0
  }, {
    "time": 48.46666666666667,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 48.86666666666667,
    "tag": "cows",
    "start": 0
  }, {
    "time": 49.333333333333336,
    "tag": "money",
    "start": 0
  }, {
    "time": 50.13333333333333,
    "tag": "cows",
    "start": 0
  }, {
    "time": 51.03333333333333,
    "tag": "fire",
    "start": 0
  }, {
    "time": 51.733333333333334,
    "tag": "cows",
    "start": 0
  }, {
    "time": 53.63333333333333,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 54.46666666666667,
    "tag": "chef",
    "start": 0
  }, {
    "time": 55.333333333333336,
    "tag": "money",
    "start": 0
  }, {
    "time": 57.03333333333333,
    "tag": "eat",
    "start": 0
  }, {
    "time": 58.3,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 59.166666666666664,
    "tag": "burger",
    "start": 0
  }, {
    "time": 61.766666666666666,
    "tag": "food",
    "start": 0
  }, {
    "time": 64.33333333333333,
    "tag": "gold",
    "start": 0
  }, {
    "time": 66.1,
    "tag": "money",
    "start": 0
  }, {
    "time": 66.53333333333333,
    "tag": "fire",
    "start": 0
  }, {
    "time": 67.36666666666666,
    "tag": "cows",
    "start": 0
  }, {
    "time": 68.1,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 68.96666666666667,
    "tag": "chef",
    "start": 0
  }, {
    "time": 70.2,
    "tag": "burger",
    "start": 0
  }, {
    "time": 70.86666666666666,
    "tag": "food",
    "start": 0
  }, {
    "time": 72.13333333333334,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 73.86666666666666,
    "tag": "money",
    "start": 0
  }, {
    "time": 75.53333333333333,
    "tag": "eat",
    "start": 0
  }, {
    "time": 76.36666666666666,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 76.76666666666667,
    "tag": "burger",
    "start": 0
  }, {
    "time": 78.16666666666667,
    "tag": "food",
    "start": 0
  }, {
    "time": 78.53333333333333,
    "tag": "cows",
    "start": 0
  }, {
    "time": 80.66666666666667,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 81.5,
    "tag": "chef",
    "start": 0
  }, {
    "time": 82.23333333333333,
    "tag": "burger",
    "start": 0
  }, {
    "time": 83.2,
    "tag": "food",
    "start": 0
  }, {
    "time": 84.13333333333334,
    "tag": "eat",
    "start": 0
  }, {
    "time": 85.76666666666667,
    "tag": "appliance",
    "start": 0
  }, {
    "time": 87.5,
    "tag": "burger",
    "start": 0
  }, {
    "time": 88.33333333333333,
    "tag": "gold",
    "start": 0
  }, {
    "time": 90,
    "tag": "money",
    "start": 0
  }, {
    "time": 90.9,
    "tag": "fire",
    "start": 0
  }, {
    "time": 91.7,
    "tag": "cows",
    "start": 0
  }, {
    "time": 93.53333333333333,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 96.06666666666666,
    "tag": "chef",
    "start": 0
  }, {
    "time": 99.5,
    "tag": "burger",
    "start": 0
  }, {
    "time": 102.86666666666666,
    "tag": "food",
    "start": 0
  }, {
    "time": 105.46666666666667,
    "tag": "eat",
    "start": 0
  }, {
    "time": 105.9,
    "tag": "fire",
    "start": 0
  }, {
    "time": 107.13333333333334,
    "tag": "franchise",
    "start": 0
  }, {
    "time": 108.73333333333333,
    "tag": "gold",
    "start": 0
  }, {
    "time": 111.4,
    "tag": "money",
    "start": 0
  }, {
    "time": 113.2,
    "tag": "fire",
    "start": 0
  }, {
    "time": 116.56666666666666,
    "tag": "cows",
    "start": 0
  }, {
    "time": 120.06666666666666,
    "tag": "cooking",
    "start": 0
  }, {
    "time": 121.8,
    "tag": "chef",
    "start": 0
  }, {
    "time": 122.66666666666667,
    "tag": "burger",
    "start": 0
  }, {
    "time": 123.53333333333333,
    "tag": "food",
    "start": 0
  }, {
    "time": 125.23333333333333,
    "tag": "eat",
    "start": 0
  }, {
    "time": 126.96666666666667,
    "tag": "burger",
    "start": 0
  }];

  var renderer = new frampton.WebRenderer({
    mediaConfig: mediaConfig
  });

  var tagger = new frampton.Tagger(mediaConfig);
  var expectedTags = ['fire', 'cows', 'cooking', 'chef', 'burger', 'food', 'eat', 'appliance', 'franchise', 'gold', 'money'];
  expectedTags.forEach(function (tag) {
    tagger.tagVideosWithPattern(tag, tag);
  });

  var startDelay = 1000;

  var taggedVideos = {};
  expectedTags.forEach(function (tag) {
    taggedVideos[tag] = tagger.videosWithTag(tag, { shuffle: true });
  });

  timing.forEach(function (timingItem, idx) {
    var tag = timingItem.tag;

    var videos = taggedVideos[tag];
    var video = videos.shift();
    if (videos.length === 0) {
      taggedVideos[tag] = tagger.videosWithTag(tag, { shuffle: true });
    }

    var videoSegment = new frampton.VideoSegment(video);
    videoSegment.setVolume(0);

    if (idx + 1 < timing.length) {
      var nextItem = timing[idx + 1];
      videoSegment.setDuration(nextItem.time - timingItem.time);
    } else {
      videoSegment.setDuration(3.5);
    }

    renderer.scheduleSegmentRender(videoSegment, startDelay + timingItem.time * 1000);
  });

  // check for MP3
  var audio = document.createElement('audio');
  if (!(audio.canPlayType && (audio.canPlayType('audio/mp3') || audio.canPlayType('audio/mpeg')))) {
    alert('Please use a browser that can play MP3s (Chrome, Safari, Internet Explorer 9+)');
  }

  // create aligner
  var aligner = new window.AudioAligner(document.getElementById('target'), audio);
  aligner.align('media/feed_the_streets.mp3', 'js/feed-the-streets-visual.json');

  // play when visuals start
  setTimeout(function () {
    audio.play();
  }, startDelay);

  setTimeout(function () {
    document.querySelector('.thanks').style.display = 'block';
  }, 128000);
})();

},{"../../src/web-frampton":25,"./media_config.json":3}],5:[function(require,module,exports){
'use strict';

var util = require('./util');
require('string-natural-compare');

module.exports.frequencyWeightedMedia = function (media) {
  if (!media) return [];

  var weightedMedia = [];
  for (var i = 0; i < media.length; i++) {
    var mediaObject = media[i];
    var frequency = mediaObject.frequency !== undefined ? mediaObject.frequency : 5; // default

    for (var f = 0; f < frequency; f++) {
      weightedMedia.push(mediaObject);
    }
  }

  return util.shuffle(weightedMedia);
};

module.exports.durationSortedMedia = function (media, descending) {
  return _mediaSortedWithComparator(media, function (mediaA, mediaB) {
    var durationA = mediaA.duration || 0;
    var durationB = mediaB.duration || 0;

    return descending ? durationB - durationA : durationA - durationB;
  });
};

module.exports.volumeSortedMedia = function (media) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var descending = options.descending || false;
  var useMax = options.useMax || false;
  return _mediaSortedWithComparator(media, function (mediaA, mediaB) {
    var volumeA = mediaA.volumeInfo ? useMax ? mediaA.volumeInfo.max : mediaA.volumeInfo.mean : -20;
    var volumeB = mediaB.volumeInfo ? useMax ? mediaB.volumeInfo.max : mediaB.volumeInfo.mean : -20;

    return descending ? volumeB - volumeA : volumeA - volumeB;
  });
};

module.exports.naturalLanguageSortedMedia = function (media) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var descending = options.descending || false;
  var caseSensitive = options.caseSensitive || false;

  var comparator = caseSensitive ? String.naturalCompare : String.naturalCaseCompare;

  return _mediaSortedWithComparator(media, function (mediaA, mediaB) {
    var val = comparator(mediaA.filename, mediaB.filename);
    return descending ? -val : val;
  });
};

module.exports.mediaSortedWithComparator = _mediaSortedWithComparator;
function _mediaSortedWithComparator(media, comparator) {
  if (!media || !comparator) return [];

  var mediaCopy = copiedMedia(media);

  mediaCopy.sort(comparator);

  return mediaCopy;
}

function copiedMedia(media) {
  if (!media) return [];

  var mediaCopy = [];

  for (var i = 0; i < media.length; i++) {
    mediaCopy.push(media[i]);
  }

  return mediaCopy;
}

},{"./util":8,"string-natural-compare":1}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function MediaFinder(mediaConfig) {
    _classCallCheck(this, MediaFinder);

    this.mediaConfig = mediaConfig;
  }

  _createClass(MediaFinder, [{
    key: 'findAudioHandleForVideo',
    value: function findAudioHandleForVideo(video) {
      var strippedFilename = stripExtension(video.filename || video);

      var audio = this.mediaConfig.audio;
      if (!audio || audio.length === 0) {
        return null;
      }

      for (var i = 0; i < audio.length; i++) {
        var track = audio[i];
        if (strippedFilename === stripExtension(track.filename)) {
          return track;
        }
      }

      return null;
    }
  }]);

  return MediaFinder;
}();

function stripExtension(filename) {
  var lastDotIndex = filename.lastIndexOf('.');
  return filename.substring(0, lastDotIndex);
}

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require('./util');

module.exports = function () {
  function Tagger(mediaConfig) {
    _classCallCheck(this, Tagger);

    this.mediaConfig = mediaConfig;

    var videos = this.mediaConfig.videos;
    for (var i = 0; i < videos.length; i++) {
      var video = videos[i];
      if (!video.tags) {
        video.tags = [];
      }
    }

    this.buildTagMap();
  }

  _createClass(Tagger, [{
    key: 'buildTagMap',
    value: function buildTagMap() {
      var tagMap = {};

      var videos = this.mediaConfig.videos;
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        var tags = video.tags;
        if (!tags) {
          continue;
        }

        for (var j = 0; j < tags.length; j++) {
          var tag = tags[j];
          var videosWithTag = tagMap[tag];
          if (!videosWithTag) {
            videosWithTag = [];
            tagMap[tag] = videosWithTag;
          }

          videosWithTag.push(video);
        }
      }

      this.tagMap = tagMap;
    }
  }, {
    key: 'videosWithTag',
    value: function videosWithTag(tag, options) {
      var videos = this.tagMap[tag] || [];

      if (options && options.shuffle) {
        videos = util.shuffle(videos);
      }

      if (options && options.limit) {
        videos = videos.slice(0, options.limit);
      }

      return videos;
    }
  }, {
    key: 'videosWithoutTag',
    value: function videosWithoutTag(tag, options) {
      var videos = [];

      var allVideos = this.mediaConfig.videos;
      for (var i = 0; i < allVideos.length; i++) {
        var video = allVideos[i];
        if (!this.videoHasTag(video, tag)) {
          videos.push(tag);
        }
      }

      if (options && options.shuffle) {
        videos = util.shuffle(videos);
      }

      if (options && options.limit) {
        videos = videos.slice(0, options.limit);
      }

      return videos;
    }
  }, {
    key: 'randomVideoWithTag',
    value: function randomVideoWithTag(tag) {
      var videos = this.videosWithTag(tag);
      return util.choice(videos);
    }
  }, {
    key: 'videoSequenceFromTagSequence',
    value: function videoSequenceFromTagSequence(tagSequence) {
      var videos = [];
      for (var i = 0; i < tagSequence.length; i++) {
        var tag = tagSequence[i];
        var video = this.randomVideoWithTag(tag);
        if (video) {
          videos.push(video);
        }
      }
      return videos;
    }
  }, {
    key: 'videoHasTag',
    value: function videoHasTag(video, tag) {
      if (!video) return false;

      var filename = video.filename || video;

      var videosWithTag = this.videosWithTag(tag);

      for (var i = 0; i < videosWithTag.length; i++) {
        if (videosWithTag[i].filename === filename) {
          return true;
        }
      }

      return false;
    }

    /// Utility Taggers

  }, {
    key: 'tagVideosWithPattern',
    value: function tagVideosWithPattern(pattern, tag) {
      var videos = this.mediaConfig.videos;
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        if (video.filename.indexOf(pattern) >= 0) {
          video.tags.push(tag);
        }
      }

      this.buildTagMap();
    }
  }, {
    key: 'tagVideosWithQualitativeLength',
    value: function tagVideosWithQualitativeLength() {
      var videos = this.mediaConfig.videos;
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        var duration = video.duration;

        if (duration < 0.3) {
          video.tags.push('short');
          video.tags.push('short1');
        } else if (duration < 1.0) {
          video.tags.push('short');
          video.tags.push('short2');
        } else if (duration < 3.0) {
          video.tags.push('med');
          video.tags.push('med1');
        } else if (duration < 5.0) {
          video.tags.push('med');
          video.tags.push('med2');
        } else if (duration < 10.0) {
          video.tags.push('long');
          video.tags.push('long1');
        } else if (duration < 30.0) {
          video.tags.push('long');
          video.tags.push('long2');
        } else {
          video.tags.push('long');
          video.tags.push('long3');
        }
      }

      this.buildTagMap();
    }
  }]);

  return Tagger;
}();

},{"./util":8}],8:[function(require,module,exports){
"use strict";

module.exports = {
  choice: choice,
  shuffle: shuffle,
  randInt: randInt,
  splitArray: splitArray
};

function choice(arr) {
  var i = Math.floor(Math.random() * arr.length);
  return arr[i];
}

function shuffle(arr) {
  var newArray = new Array(arr.length);
  for (var i = 0; i < arr.length; i++) {
    newArray[i] = arr[i];
  }

  newArray.sort(function () {
    return 0.5 - Math.random();
  });
  return newArray;
}

function randInt(min, max) {
  if (!min) min = 1;
  if (!max) max = 1000;

  return Math.floor(Math.random() * (max - min)) + min;
}

function splitArray(arr, n) {
  var arrs = [];

  var currentArr = [];
  for (var i = 0; i < arr.length; i++) {
    currentArr.push(arr[i]);
    if (currentArr.length === n) {
      arrs.push(currentArr);
      currentArr = [];
    }
  }

  if (currentArr.length > 0) {
    arrs.push(currentArr);
  }

  return arrs;
}

},{}],9:[function(require,module,exports){
'use strict';

module.exports = {
  VideoSegment: require('./segment/video-segment'),
  ImageSegment: require('./segment/image-segment'),
  ColorSegment: require('./segment/color-segment'),
  AudioSegment: require('./segment/audio-segment'),

  SequencedSegment: require('./segment/sequenced-segment'),
  StackedSegment: require('./segment/stacked-segment'),
  finiteLoopingSegment: require('./segment/finite-looping-segment'),
  sequencedSegmentFromFrames: require('./segment/sequenced-segment-from-frames'),

  Renderer: require('./renderer/renderer'),

  Tagger: require('./etc/tagger'),
  MediaFinder: require('./etc/media-finder'),
  mediaArranger: require('./etc/media-arranger'),
  util: require('./etc/util')
};

},{"./etc/media-arranger":5,"./etc/media-finder":6,"./etc/tagger":7,"./etc/util":8,"./renderer/renderer":11,"./segment/audio-segment":14,"./segment/color-segment":15,"./segment/finite-looping-segment":16,"./segment/image-segment":17,"./segment/sequenced-segment":21,"./segment/sequenced-segment-from-frames":20,"./segment/stacked-segment":22,"./segment/video-segment":23}],10:[function(require,module,exports){
"use strict";

module.exports.setTransition = function (el, transition) {
  //el.style.setProperty('-moz-transition', transition);
  //el.style.setProperty('-ms-transition', transition);
  //el.style.setProperty('-o-transition', transition);

  el.style.webkitTransition = transition;
  el.style.transition = transition;
};

},{}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Renderer(options) {
    _classCallCheck(this, Renderer);

    this.mediaConfig = options.mediaConfig;
    this.outputFilepath = options.outputFilepath !== undefined ? options.outputFilepath : './out/';
    this.log = options.log || false;
    this.audioFadeDuration = options.audioFadeDuration;
    this.videoFadeDuration = options.videoFadeDuration;

    if (this.log) {
      console.log('frampton is starting now...');
    }
  }

  /// Scheduling

  _createClass(Renderer, [{
    key: 'scheduleSegmentRender',
    value: function scheduleSegmentRender(segment, delay) {
      // override to provide concrete implementation of actual scheduling

      // this handles associated segments 4 u
      var associatedSegments = segment.associatedSegments();
      if (associatedSegments) {
        for (var i = 0; i < associatedSegments.length; i++) {
          var associatedOffset = delay + associatedSegments[i].offset * 1000;
          this.scheduleSegmentRender(associatedSegments[i].segment, associatedOffset);
        }
      }
    }
  }, {
    key: 'insertScheduledUnit',
    value: function insertScheduledUnit(scheduledUnit, units) {
      var insertionIndex = getInsertionIndex(units, scheduledUnit, compareScheduledUnits);
      units.splice(insertionIndex, 0, scheduledUnit);
    }

    /// Rendering

  }, {
    key: 'renderVideoSegment',
    value: function renderVideoSegment() {}
  }, {
    key: 'renderImageSegment',
    value: function renderImageSegment() {}
  }, {
    key: 'renderColorSegment',
    value: function renderColorSegment() {}
  }, {
    key: 'renderAudioSegment',
    value: function renderAudioSegment() {}
  }, {
    key: 'renderSegment',
    value: function renderSegment(segment) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      switch (segment.segmentType) {
        case 'video':
          this.renderVideoSegment(segment, options);
          break;

        case 'image':
          this.renderImageSegment(segment, options);
          break;

        case 'color':
          this.renderColorSegment(segment, options);
          break;

        case 'audio':
          this.renderAudioSegment(segment, options);
          break;

        case 'sequence':
          this.renderSequencedSegment(segment, options);
          break;

        case 'stacked':
          this.renderStackedSegment(segment, options);
          break;

        default:
          console.log('unhandled sequence type: ' + segment.segmentType);
          break;
      }
    }
  }, {
    key: 'renderSequencedSegment',
    value: function renderSequencedSegment(sequenceSegment, _ref) {
      var _this = this;

      var _ref$offset = _ref.offset;
      var offset = _ref$offset === undefined ? 0 : _ref$offset;

      sequenceSegment.segments.forEach(function (segment, idx) {
        _this.scheduleSegmentRender(segment, offset);
        offset += segment.msDuration() + sequenceSegment.msVideoOffset();

        if (idx === 0) {
          _this.overrideOnStart(segment, function () {
            sequenceSegment.didStart();
          });
        } else if (idx === sequenceSegment.segmentCount() - 1) {
          _this.overrideOnComplete(segment, function () {
            sequenceSegment.cleanup();
          });
        }
      });
    }
  }, {
    key: 'renderStackedSegment',
    value: function renderStackedSegment(stackedSegment, _ref2) {
      var _this2 = this;

      var _ref2$offset = _ref2.offset;
      var offset = _ref2$offset === undefined ? 0 : _ref2$offset;

      stackedSegment.segments.forEach(function (segment, idx) {
        var segmentOffset = offset + stackedSegment.msSegmentOffset(idx);
        _this2.scheduleSegmentRender(segment, segmentOffset);

        if (idx === 0) {
          _this2.overrideOnStart(segment, function () {
            stackedSegment.didStart();
          });
        }
      });

      var lastSegment = stackedSegment.lastSegment();
      this.overrideOnComplete(lastSegment, function () {
        stackedSegment.cleanup();
      });
    }

    /// Utility

  }, {
    key: 'overrideOnStart',
    value: function overrideOnStart(segment, onStart) {
      var originalOnStart = segment.onStart;
      segment.onStart = function () {
        // call and reset the original
        if (originalOnStart) {
          originalOnStart();
        }
        segment.onStart = originalOnStart;

        // call the new one
        onStart();
      };
    }
  }, {
    key: 'overrideOnComplete',
    value: function overrideOnComplete(segment, onComplete) {
      var originalOnComplete = segment.onComplete;
      segment.onComplete = function () {
        // call and reset the original
        if (originalOnComplete) {
          originalOnComplete();
        }
        segment.onComplete = originalOnComplete;

        // call the new one
        onComplete();
      };
    }
  }]);

  return Renderer;
}();

function compareScheduledUnits(scheduledUnitA, scheduledUnitB) {
  var offsetA = scheduledUnitA.offset || 0;
  var offsetB = scheduledUnitB.offset || 0;

  return offsetA - offsetB;
}

// binary search baby
function getInsertionIndex(arr, element, comparator) {
  if (arr.length === 0) {
    return 0;
  }

  var low = 0;
  var high = arr.length - 1;

  while (low <= high) {
    var mid = Math.floor((low + high) / 2);
    var compareValue = comparator(arr[mid], element);
    if (compareValue < 0) {
      low = mid + 1;
    } else if (compareValue > 0) {
      high = mid - 1;
    } else {
      return mid;
    }
  }

  return low;
}

},{}],12:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function ScheduledUnit(segment, offset) {
    _classCallCheck(this, ScheduledUnit);

    this.segment = segment;
    this.offset = offset;
  }

  _createClass(ScheduledUnit, [{
    key: "toString",
    value: function toString() {
      return Math.round(this.offset * 100) / 100 + ": " + this.segment.simpleName() + " for " + this.segment.getDuration();
    }
  }]);

  return ScheduledUnit;
}();

},{}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TWEEN = require('tween.js');
var Renderer = require('./renderer');
var ScheduledUnit = require('./scheduled-unit');
var dahmer = require('./dahmer');

var TimePerFrame = 16.67;

module.exports = function (_Renderer) {
  _inherits(WebRenderer, _Renderer);

  function WebRenderer(options) {
    _classCallCheck(this, WebRenderer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebRenderer).call(this, options));

    _this.timeToLoadVideo = options.timeToLoadVideo || 4000;
    _this.startDelayCorrection = options.startDelayCorrection || 1.8; // this adapts over time
    _this.startPerceptionCorrection = options.startPerceptionCorrection || 13; // this is constant

    _this.videoSourceMaker = options.videoSourceMaker !== undefined ? options.videoSourceMaker : function (filename) {
      return _this.mediaConfig.path + filename;
    };

    _this.domContainer = document.body;
    _this.scheduledRenders = [];
    _this.updateFunctions = [];

    _this.videosPlayed = 0;
    _this.meanStartDelay = 0;

    _this.lastUpdateTime = 0;
    _this.update(); // get the loop going
    return _this;
  }

  /// Scheduling

  _createClass(WebRenderer, [{
    key: 'update',
    value: function update(totalTime) {
      window.requestAnimationFrame(this.update.bind(this));
      TWEEN.update(totalTime);

      var now = window.performance.now();
      var timeSinceLastUpdate = now - this.lastUpdateTime;
      this.lastUpdateTime = now;

      var timeToLoad = this.timeToLoadVideo + TimePerFrame;
      var scheduledRenders = this.scheduledRenders;

      var toRender = [];
      for (var i = 0; i < scheduledRenders.length; i++) {
        var scheduledRender = scheduledRenders[i];
        var timeUntilStart = scheduledRender.offset - now;

        if (timeUntilStart < timeToLoad) {
          // start to render, and mark for removal
          toRender.push({ segment: scheduledRender.segment, options: { offset: Math.max(timeUntilStart, 0) } });
        } else {
          break; // because we sort by offset, we can break early
        }
      }

      if (toRender.length > 0) {
        // remove used-up units
        scheduledRenders.splice(0, toRender.length);

        // actually perform rendering
        for (i = 0; i < toRender.length; i++) {
          var renderModel = toRender[i];
          this.renderSegment(renderModel.segment, renderModel.options);
        }
      }

      for (i = 0; i < this.updateFunctions.length; i++) {
        this.updateFunctions[i].fn(timeSinceLastUpdate);
      }
    }
  }, {
    key: 'addUpdateFunction',
    value: function addUpdateFunction(fn) {
      var identifier = '' + Math.floor(Math.random() * 1000000000);
      this.updateFunctions.push({
        identifier: identifier,
        fn: fn
      });

      return identifier;
    }
  }, {
    key: 'removeUpdateFunctionWithIdentifier',
    value: function removeUpdateFunctionWithIdentifier(identifier) {
      var indexOfIdentifier = -1;
      for (var i = 0; i < this.updateFunctions.length; i++) {
        if (this.updateFunctions[i].identifier === identifier) {
          indexOfIdentifier = i;
          break;
        }
      }

      if (indexOfIdentifier >= 0) {
        this.updateFunctions.splice(indexOfIdentifier, 1);
      }
    }
  }, {
    key: 'scheduleSegmentRender',
    value: function scheduleSegmentRender(segment, delay) {
      _get(Object.getPrototypeOf(WebRenderer.prototype), 'scheduleSegmentRender', this).call(this, segment, delay);

      var offset = window.performance.now() + delay;
      var unit = new ScheduledUnit(segment, offset);

      this.insertScheduledUnit(unit, this.scheduledRenders);
    }

    /// Rendering

  }, {
    key: 'renderVideoSegment',
    value: function renderVideoSegment(segment, _ref) {
      var _ref$offset = _ref.offset;
      var offset = _ref$offset === undefined ? 0 : _ref$offset;

      var self = this;

      var video = document.createElement('video');
      video.preload = true;
      video.className = 'frampton-video';

      var filename = video.canPlayType('video/mp4').length > 0 ? segment.filename : segment.extensionlessName() + '.webm';
      video.src = this.videoSourceMaker(filename);

      video.style.zIndex = segment.z;

      if (segment.width) {
        video.style.width = video.style.height = segment.width;
      }
      if (segment.top) {
        video.style.top = segment.top;
      }
      if (segment.left) {
        video.style.left = segment.left;
      }

      video.volume = segment.volume;
      segment.addChangeHandler('volume', function (volume) {
        video.volume = volume;
      });

      video.currentTime = segment.startTime;

      video.playbackRate = segment.playbackRate;
      segment.addChangeHandler('playbackRate', function (playbackRate) {
        video.playbackRate = playbackRate;
      });

      var displayStyle = video.style.display || 'block';
      video.style.display = 'none';
      this.domContainer.appendChild(video);

      var segmentDuration = segment.msDuration();
      var expectedStart = window.performance.now() + offset;

      video.addEventListener('playing', function () {
        var now = window.performance.now();
        var startDelay = now + self.startPerceptionCorrection - expectedStart;

        var endTimeout = segmentDuration;
        if (startDelay > self.startPerceptionCorrection) {
          endTimeout -= startDelay;
        }

        setTimeout(end, endTimeout);

        self.videosPlayed += 1;
        if (self.videosPlayed === 1) {
          self.meanStartDelay = startDelay;
        } else {
          self.meanStartDelay = (self.meanStartDelay * (self.videosPlayed - 1) + startDelay) / self.videosPlayed;

          if (Math.abs(self.meanStartDelay > 1)) {
            if (self.meanStartDelay > 0.05 && self.startDelayCorrection < 3) {
              self.startDelayCorrection += 0.05;
            } else if (self.meanStartDelay < -0.05 && self.startDelayCorrection > 0.05) {
              self.startDelayCorrection -= 0.05;
            }
          }
        }

        if (self.log) {
          console.log(now + ': start ' + filename + ' | duration ' + segmentDuration + ' | start delay ' + startDelay);
          console.log('start correction ' + self.startDelayCorrection + ' | mean delay ' + self.meanStartDelay);
        }
      }, false);

      setTimeout(start, offset - this.startDelayCorrection - this.startPerceptionCorrection);

      function start() {
        video.play();

        video.style.display = displayStyle;

        var videoFadeDuration = segment.videoFadeDuration || self.videoFadeDuration;
        if (videoFadeDuration) {
          videoFadeDuration = Math.min(videoFadeDuration, segmentDuration / 2);

          video.style.opacity = 0;
          var transition = 'opacity ' + videoFadeDuration + 'ms';
          dahmer.setTransition(video, transition);

          // fade in
          setTimeout(function () {
            video.style.opacity = segment.opacity;
          }, 1);

          // fade out
          setTimeout(function () {
            video.style.opacity = 0;
          }, segmentDuration - videoFadeDuration);
        } else {
          self.setVisualSegmentOpacity(segment, video);
        }

        var audioFadeDuration = segment.audioFadeDuration || self.audioFadeDuration;
        if (audioFadeDuration) {
          audioFadeDuration = Math.min(audioFadeDuration, segmentDuration / 2);

          // fade in
          video.volume = 0;
          new TWEEN.Tween(video).to({ volume: segment.volume }, audioFadeDuration).start();

          setTimeout(function () {
            // fade out
            new TWEEN.Tween(video).to({ volume: 0 }, audioFadeDuration).start();
          }, segmentDuration - audioFadeDuration);
        }

        segment.didStart();
      }

      function end() {
        if (self.log) {
          var now = window.performance.now();
          var expectedEnd = expectedStart + segmentDuration;
          console.log(now + ': finish ' + filename + ' | end delay: ' + (now - expectedEnd));
        }

        if (segment.loop) {
          video.pause();
          video.currentTime = segment.startTime;
          video.play();
          setTimeout(end, segmentDuration);
        } else {
          video.parentNode.removeChild(video);
          video.src = '';
          segment.cleanup();
        }
      }
    }
  }, {
    key: 'renderColorSegment',
    value: function renderColorSegment(segment, _ref2) {
      var _ref2$offset = _ref2.offset;
      var offset = _ref2$offset === undefined ? 0 : _ref2$offset;

      var self = this;

      var div = document.createElement('div');
      div.className = 'frampton-video';

      div.style.zIndex = segment.z;

      if (segment.width) {
        div.style.width = div.style.height = segment.width;
      }
      if (segment.top) {
        div.style.top = segment.top;
      }
      if (segment.left) {
        div.style.left = segment.left;
      }

      if (segment.transitionBetweenColors) {
        div.style.transition = 'background-color 5ms';
      }

      var displayStyle = div.style.display || 'block';
      div.style.display = 'none';
      this.domContainer.appendChild(div);

      var framesDataResponseCallback;
      if (!segment.framesData) {
        if (this.log) {
          console.log('loading color frames for: ' + segment.filename);
        }
        this.getJSON(this.videoSourceMaker(segment.filename), function (framesData) {
          segment.setFramesData(framesData);

          if (framesDataResponseCallback) framesDataResponseCallback();
          framesDataResponseCallback = null;
        });
      }

      if (offset > 0) {
        setTimeout(start, offset);
      } else {
        start();
      }

      function start() {
        if (!segment.framesData) {
          framesDataResponseCallback = function framesDataResponseCallback() {
            start();
          };
          return;
        }

        if (self.log) {
          console.log('displaying colors for: ' + segment.filename);
        }

        div.style.display = displayStyle;

        self.setVisualSegmentOpacity(segment, div);

        segment.didStart();

        var msPerFrame;
        var currentFrameIndex = segment.startTime === 0 ? 0 : Math.floor(segment.startTime * 1000 / msPerFrame);
        var lastUpdateLeftoverTime = 0;

        updateMSPerFrame();
        updateColorRender(0);

        segment.addChangeHandler('playbackRate', updateMSPerFrame);

        var fnIdentifier = self.addUpdateFunction(updateColorRender);

        function updateColorRender(timeDelta) {
          var deltaWithLeftoverTime = timeDelta + lastUpdateLeftoverTime;

          var frames = Math.floor(deltaWithLeftoverTime / msPerFrame);
          currentFrameIndex += frames;

          lastUpdateLeftoverTime = deltaWithLeftoverTime - frames * msPerFrame;

          if (currentFrameIndex >= segment.numberOfColors()) {
            if (segment.loop) {
              currentFrameIndex = currentFrameIndex - segment.numberOfColors();
            } else {
              end(fnIdentifier);
              return;
            }
          }

          div.style.backgroundColor = segment.rgb(segment.getColor(currentFrameIndex));

          if (self.log) {
            console.log(window.performance.now() + ': displaying frame ' + currentFrameIndex + ' for color segment - ' + segment.simpleName());
          }
        }

        function updateMSPerFrame() {
          msPerFrame = segment.msDuration() / segment.numberOfColors();
        }

        if (self.log) {
          console.log(window.performance.now() + ': started color segment - ' + segment.simpleName());
        }
      }

      function end(fnIdentifier) {
        div.parentNode.removeChild(div);
        segment.cleanup();

        self.removeUpdateFunctionWithIdentifier(fnIdentifier);

        if (self.log) {
          console.log(window.performance.now() + ': finished color segment - ' + segment.simpleName());
        }
      }
    }
  }, {
    key: 'renderAudioSegment',
    value: function renderAudioSegment(segment, options) {
      if (segment.preferHTMLAudio || options.preferHTMLAudio || this.preferHTMLAudio) {
        this.renderAudioSegmentWithHTMLAudio(segment, options);
      } else {
        this.renderAudioSegmentWithWebAudio(segment, options);
      }
    }

    // helpful web audio documentation: http://www.html5rocks.com/en/tutorials/webaudio/intro/

  }, {
    key: 'renderAudioSegmentWithWebAudio',
    value: function renderAudioSegmentWithWebAudio(segment, _ref3) {
      var _ref3$offset = _ref3.offset;
      var offset = _ref3$offset === undefined ? 0 : _ref3$offset;

      var self = this;

      var Context = window.AudioContext || window.webkitAudioContext;
      var audioContext = new Context();
      var source = audioContext.createBufferSource();
      var sourceStartTime = audioContext.currentTime + offset / 1000;

      var gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      segment.addChangeHandler('volume', function (volume) {
        gainNode.gain.value = volume;
      });

      if (segment.fadeInDuration) {
        gainNode.gain.linearRampToValueAtTime(0, sourceStartTime);
        gainNode.gain.linearRampToValueAtTime(segment.volume, sourceStartTime + segment.fadeInDuration);
      } else {
        gainNode.gain.value = segment.volume;
      }

      if (segment.fadeOutDuration) {
        gainNode.gain.linearRampToValueAtTime(segment.volume, sourceStartTime + segment.getDuration() - segment.fadeOutDuration);
        gainNode.gain.linearRampToValueAtTime(0, sourceStartTime + segment.getDuration());
      }

      source.start(sourceStartTime, segment.startTime, segment.getDuration());

      var request = new XMLHttpRequest();
      request.open('GET', this.videoSourceMaker(segment.filename), true);
      request.responseType = 'arraybuffer';

      request.onload = function () {
        var audioData = request.response;

        audioContext.decodeAudioData(audioData, function (buffer) {
          source.buffer = buffer;
          source.connect(gainNode);

          source.loop = segment.loop;
          if (segment.loop) {
            source.loopStart = segment.startTime;
            source.loopEnd = segment.endTime();
          }

          source.playbackRate.value = segment.playbackRate;
          segment.addChangeHandler('playbackRate', function (playbackRate) {
            source.playbackRate.value = playbackRate;
          });
        }, function (e) {
          if (self.log) {
            console.log('audio decoding erorr: ' + e.err);
          }
        });
      };

      request.send();
    }
  }, {
    key: 'renderAudioSegmentWithHTMLAudio',
    value: function renderAudioSegmentWithHTMLAudio(segment, _ref4) {
      var _ref4$offset = _ref4.offset;
      var offset = _ref4$offset === undefined ? 0 : _ref4$offset;

      var self = this;

      var audio = document.createElement('audio');
      audio.preload = true;
      audio.src = this.videoSourceMaker(segment.filename);
      audio.currentTime = segment.startTime;
      audio.playbackRate = segment.playbackRate;
      segment.addChangeHandler('playbackRate', function (playbackRate) {
        audio.playbackRate = playbackRate;
      });
      audio.volume = segment.volume;
      segment.addChangeHandler('volume', function (volume) {
        audio.volume = volume;
      });

      var segmentDuration = segment.msDuration();
      var expectedStart = window.performance.now() + offset;

      audio.addEventListener('playing', function () {
        var now = window.performance.now();
        var startDelay = now + self.startPerceptionCorrection - expectedStart;

        var endTimeout = segmentDuration;
        if (startDelay > self.startPerceptionCorrection) {
          endTimeout -= startDelay;
        }

        setTimeout(end, endTimeout);

        if (self.log) {
          console.log('audio is playing for ' + segment.filename);
        }
      }, false);

      setTimeout(start, offset - this.startPerceptionCorrection);

      function start() {
        audio.play();

        var fadeInDuration = 1000 * segment.fadeInDuration || self.audioFadeDuration;
        if (fadeInDuration) {
          fadeInDuration = Math.min(fadeInDuration, segmentDuration / 2);

          audio.volume = 0;
          new TWEEN.Tween(audio).to({ volume: segment.volume }, fadeInDuration).start();
        }

        var fadeOutDuration = 1000 * segment.fadeOutDuration || self.audioFadeDuration;
        if (fadeOutDuration) {
          setTimeout(function () {
            new TWEEN.Tween(audio).to({ volume: 0 }, fadeOutDuration).start();
          }, segmentDuration - fadeOutDuration);
        }

        if (self.log) {
          console.log('started playing audio for: ' + segment.filename);
        }

        segment.didStart();
      }

      function end() {
        if (segment.loop) {
          audio.pause();
          audio.currentTime = segment.startTime;
          audio.play();
          setTimeout(end, segmentDuration);
        } else {
          audio.src = '';
          segment.cleanup();
        }
      }
    }

    /// Rendering Helpers

  }, {
    key: 'setVisualSegmentOpacity',
    value: function setVisualSegmentOpacity(segment, el) {
      if (segment.opacity !== 1.0) {
        el.style.opacity = segment.opacity;
      }
      segment.addChangeHandler('opacity', function (opacity) {
        el.style.opacity = opacity;
      });
    }
  }, {
    key: 'getJSON',
    value: function getJSON(url, callback) {
      if (!callback) return;

      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function () {
        var data = JSON.parse(request.responseText);
        callback(data);
      };

      request.send();
    }
  }]);

  return WebRenderer;
}(Renderer);

},{"./dahmer":10,"./renderer":11,"./scheduled-unit":12,"tween.js":2}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaSegment = require('./media-segment');

/// Play some audio!!
/// Dynamic properties on web: volume
module.exports = function (_MediaSegment) {
  _inherits(AudioSegment, _MediaSegment);

  function AudioSegment(options) {
    _classCallCheck(this, AudioSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AudioSegment).call(this, options));

    _this.segmentType = 'audio';

    _this.volume = options.volume || 0.8;
    _this.fadeInDuration = options.fadeInDuration;
    _this.fadeOutDuration = options.fadeOutDuration || _this.fadeInDuration;
    return _this;
  }

  _createClass(AudioSegment, [{
    key: 'copy',
    value: function copy(audioSegment) {
      _get(Object.getPrototypeOf(AudioSegment.prototype), 'copy', this).call(this, audioSegment);

      this.volume = audioSegment.volume;
      this.fadeInDuration = audioSegment.fadeInDuration;
      this.fadeOutDuration = audioSegment.fadeOutDuration;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new AudioSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setVolume',
    value: function setVolume(volume) {
      this.volume = volume;

      this.notifyChangeHandlers('volume', volume);

      return this;
    }
  }, {
    key: 'setFadeDuration',
    value: function setFadeDuration(fadeDuration) {
      return this.setFadeInDuration(fadeDuration).setFadeOutDuration(fadeDuration);
    }
  }, {
    key: 'setFadeInDuration',
    value: function setFadeInDuration(fadeInDuration) {
      this.fadeInDuration = fadeInDuration;

      return this;
    }
  }, {
    key: 'setFadeOutDuration',
    value: function setFadeOutDuration(fadeOutDuration) {
      this.fadeOutDuration = fadeOutDuration;

      return this;
    }

    // Generators

  }, {
    key: 'simpleName',
    value: function simpleName() {
      return 'audio - ' + this.filename;
    }
  }]);

  return AudioSegment;
}(MediaSegment);

},{"./media-segment":18}],15:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisualSegment = require('./visual-segment');

module.exports = function (_VisualSegment) {
  _inherits(ColorSegment, _VisualSegment);

  function ColorSegment(options) {
    _classCallCheck(this, ColorSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorSegment).call(this, options));

    _this.segmentType = 'color';

    // TODO: abstract this into FramesSegment
    _this.fps = options.fps;
    _this.numberOfFrames = options.numberOfFrames;
    _this.framesData = options.framesData;

    _this.transitionBetweenColors = options.transitionBetweenColors || false;
    return _this;
  }

  _createClass(ColorSegment, [{
    key: 'copy',
    value: function copy(colorSegment) {
      _get(Object.getPrototypeOf(ColorSegment.prototype), 'copy', this).call(this, colorSegment);

      this.fps = colorSegment.fps;
      this.numberOfFrames = colorSegment.numberOfFrames;
      this.framesData = colorSegment.framesData;
      this.transitionBetweenColors = colorSegment.transitionBetweenColors;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new ColorSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setColors',
    value: function setColors(colors) {
      this.colors = colors;
      return this;
    }
  }, {
    key: 'setFramesData',
    value: function setFramesData(framesData) {
      this.framesData = framesData.frames ? framesData.frames : framesData;
      return this;
    }

    // Generators

  }, {
    key: 'simpleName',
    value: function simpleName() {
      return 'color - ' + this.filename;
    }
  }, {
    key: 'numberOfColors',
    value: function numberOfColors() {
      if (this.numberOfFrames) {
        return this.numberOfFrames;
      }

      return this.framesData ? this.framesData.length : 0;
    }
  }, {
    key: 'getColor',
    value: function getColor(index) {
      if (!this.framesData) {
        return null;
      }

      var colors = this.framesData[index].colors;
      return colors.dominant;
    }
  }, {
    key: 'getPalette',
    value: function getPalette(index) {
      if (!this.framesData) {
        return null;
      }

      var colors = this.framesData[index].colors;
      return colors.palette;
    }
  }, {
    key: 'rgb',
    value: function rgb(color) {
      if (!color) return 'rgb(0, 0, 0)';

      return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
    }
  }]);

  return ColorSegment;
}(VisualSegment);

},{"./visual-segment":24}],16:[function(require,module,exports){
'use strict';

var SequencedSegment = require('./sequenced-segment');

module.exports = function finiteLoopingSegment(segment) {
  var timesToLoop = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  // create the list of cloned segments to loop
  var clonedSegments = [];
  for (var i = 0; i < timesToLoop; i++) {
    clonedSegments.push(segment.clone());
  }

  options.segments = clonedSegments;

  // create the looping sequence segment
  var loopingSegment = new SequencedSegment(options);

  return loopingSegment;
};

},{"./sequenced-segment":21}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisualSegment = require('./visual-segment');

module.exports = function (_VisualSegment) {
  _inherits(ImageSegment, _VisualSegment);

  function ImageSegment(options) {
    _classCallCheck(this, ImageSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ImageSegment).call(this, options));

    _this.segmentType = 'image';
    return _this;
  }

  _createClass(ImageSegment, [{
    key: 'copy',
    value: function copy(imageSegment) {
      _get(Object.getPrototypeOf(ImageSegment.prototype), 'copy', this).call(this, imageSegment);

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new ImageSegment({}).copy(this);
    }

    // Generators

  }, {
    key: 'simpleName',
    value: function simpleName() {
      return 'image - ' + this.filename;
    }
  }]);

  return ImageSegment;
}(VisualSegment);

},{"./visual-segment":24}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Segment = require('./segment');

/// abstract superclass for VisualSegment, AudioSegment
/// Dynamic properties on web: playbackRate
module.exports = function (_Segment) {
  _inherits(MediaSegment, _Segment);

  function MediaSegment(options) {
    _classCallCheck(this, MediaSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MediaSegment).call(this, options));

    _this.segmentType = 'media';

    // media config
    _this.filename = options.filename;
    _this.mediaDuration = options.duration;

    // segment config
    _this.startTime = options.startTime || 0;
    _this.duration = _this.mediaDuration - _this.startTime;
    _this.playbackRate = options.playbackRate || 1.0;
    _this.loop = options.loop || false;
    return _this;
  }

  _createClass(MediaSegment, [{
    key: 'copy',
    value: function copy(mediaSegment) {
      _get(Object.getPrototypeOf(MediaSegment.prototype), 'copy', this).call(this, mediaSegment);

      this.filename = mediaSegment.filename;
      this.mediaDuration = mediaSegment.mediaDuration;

      this.startTime = mediaSegment.startTime;
      this.duration = mediaSegment.duration;
      this.playbackRate = mediaSegment.playbackRate;
      this.loop = mediaSegment.loop;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new MediaSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setFilename',
    value: function setFilename(filename) {
      this.filename = filename;
      return this;
    }
  }, {
    key: 'setEndTime',
    value: function setEndTime(endTime) {
      this.startTime = endTime - this.duration;
      return this;
    }
  }, {
    key: 'setStartTime',
    value: function setStartTime(startTime) {
      this.startTime = startTime;
      this.duration = Math.min(this.duration, this.mediaDuration - startTime);
      return this;
    }
  }, {
    key: 'setDuration',
    value: function setDuration(duration, startAtEnd) {
      this.duration = Math.min(duration, this.mediaDuration);

      var maximalStartTime = this.mediaDuration - this.duration;
      if (startAtEnd || this.startTime > maximalStartTime) {
        this.startTime = maximalStartTime;
      }

      return this;
    }
  }, {
    key: 'setPlaybackRate',
    value: function setPlaybackRate(playbackRate) {
      this.playbackRate = playbackRate;

      this.notifyChangeHandlers('playbackRate', playbackRate);

      return this;
    }
  }, {
    key: 'setLoop',
    value: function setLoop(loop) {
      this.loop = loop;

      return this;
    }

    // Generators

  }, {
    key: 'extensionlessName',
    value: function extensionlessName() {
      return this.filename.substring(0, this.filename.lastIndexOf('.'));
    }
  }, {
    key: 'endTime',
    value: function endTime() {
      return this.startTime + this.duration;
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      return this.duration / this.playbackRate;
    }
  }, {
    key: 'msStartTime',
    value: function msStartTime() {
      return this.startTime * 1000;
    }
  }, {
    key: 'msEndTime',
    value: function msEndTime() {
      return this.endTime() * 1000;
    }
  }]);

  return MediaSegment;
}(Segment);

},{"./segment":19}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Segment(options) {
    _classCallCheck(this, Segment);

    this.onStart = options.onStart;
    this.onComplete = options.onComplete;

    this.changeHandlers = {};
  }

  _createClass(Segment, [{
    key: 'copy',
    value: function copy(segment) {
      this.onStart = segment.onStart;
      this.onComplete = segment.onComplete;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new Segment({}).copy(this);
    }

    /// Start and Finish

  }, {
    key: 'didStart',
    value: function didStart() {
      if (this.onStart) {
        this.onStart();
        this.onStart = undefined;
      }
    }
  }, {
    key: 'cleanup',
    value: function cleanup() {
      if (this.onComplete) {
        this.onComplete();
        this.onComplete = undefined;
      }
    }

    /// Change Notification

  }, {
    key: 'addChangeHandler',
    value: function addChangeHandler(propertyName, fn) {
      var handlers = this.getChangeHandlers(propertyName);
      handlers.push(fn);
    }
  }, {
    key: 'notifyChangeHandlers',
    value: function notifyChangeHandlers(propertyName, value) {
      var handlers = this.getChangeHandlers(propertyName);

      for (var i = 0; i < handlers.length; i++) {
        handlers[i](value);
      }
    }
  }, {
    key: 'getChangeHandlers',
    value: function getChangeHandlers(propertyName) {
      var handlers = this.changeHandlers[propertyName];
      if (handlers !== undefined) {
        return handlers;
      }

      handlers = [];
      this.changeHandlers[propertyName] = handlers;

      return handlers;
    }

    /// Generators

  }, {
    key: 'getDuration',
    value: function getDuration() {
      return 0;
    }
  }, {
    key: 'msDuration',
    value: function msDuration() {
      return this.getDuration() * 1000;
    }
  }, {
    key: 'simpleName',
    value: function simpleName() {
      return 'plain segment';
    }
  }, {
    key: 'associatedSegments',
    value: function associatedSegments() {
      return null;
    }
  }]);

  return Segment;
}();

},{}],20:[function(require,module,exports){
'use strict';

var VideoSegment = require('./video-segment');
var ImageSegment = require('./image-segment');
var SequencedSegment = require('./sequenced-segment');

module.exports = function sequencedSegmentFromFrames(framesData) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var firstFrameIndex = options.firstFrameIndex || 0;
  var numberOfFrames = options.numberOfFrames || framesData.frames.length;
  var cutVideos = options.cutVideos || false;

  var frameDuration = 1 / framesData.fps;

  // create list of video segments, each segment with duration equal to one frame
  var segments = [];
  for (var i = firstFrameIndex; i < numberOfFrames; i++) {
    var frame = framesData.frames[i];

    if (cutVideos) {
      var videoSegment = new VideoSegment(framesData);
      videoSegment.setStartTime(frame.timecode).setDuration(frameDuration);

      segments.push(videoSegment);
    } else {
      var imageSegment = new ImageSegment({
        filename: frame.imageFilename,
        duration: frameDuration
      });

      segments.push(imageSegment);
    }
  }

  // put segments in given options array to allow arbitrary options-passing to SequencedSegment
  options.segments = segments;

  // create the looping sequence segment
  var sequencedSegment = new SequencedSegment(options);

  return sequencedSegment;
};

},{"./image-segment":17,"./sequenced-segment":21,"./video-segment":23}],21:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Segment = require('./segment');

module.exports = function (_Segment) {
  _inherits(SequencedSegment, _Segment);

  function SequencedSegment() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, SequencedSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SequencedSegment).call(this, options));

    _this.segmentType = 'sequence';
    _this.segments = options.segments || [];
    _this.videoOffset = options.videoOffset || 0;
    return _this;
  }

  _createClass(SequencedSegment, [{
    key: 'copy',
    value: function copy(sequencedSegment, recursive) {
      _get(Object.getPrototypeOf(SequencedSegment.prototype), 'copy', this).call(this, sequencedSegment);

      this.segments = [];
      for (var i = 0; i < sequencedSegment.segments.length; i++) {
        var segment = sequencedSegment.segments[i];
        this.segments.push(recursive ? segment.clone() : segment);
      }

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new SequencedSegment().copy(this, true);
    }

    /// Generators

  }, {
    key: 'getSegment',
    value: function getSegment(index) {
      return this.segments[index];
    }
  }, {
    key: 'segmentCount',
    value: function segmentCount() {
      return this.segments.length;
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      var offset = 0;
      for (var i = 0; i < this.segments.length - 1; i++) {
        offset += this.segments[i].getDuration() - this.videoOffset;
      }

      var duration = offset + this.segments[this.segments.length - 1].getDuration();

      return duration;
    }
  }, {
    key: 'msVideoOffset',
    value: function msVideoOffset() {
      return this.videoOffset * 1000;
    }
  }]);

  return SequencedSegment;
}(Segment);

},{"./segment":19}],22:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Segment = require('./segment');

module.exports = function (_Segment) {
  _inherits(StackedSegment, _Segment);

  function StackedSegment() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, StackedSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StackedSegment).call(this, options));

    _this.segmentType = 'stacked';
    _this.segments = options.segments || [];
    _this.stackAllowance = options.stackAllowance || 0.25;
    _this.segmentOffsets = [];
    _this.segmentEndTimes = [];

    var accumulatedOffset = 0;
    for (var i = 0; i < _this.segments.length; i++) {
      _this.segmentOffsets.push(accumulatedOffset);

      var duration = _this.segments[i].getDuration();
      _this.segmentEndTimes.push(accumulatedOffset + duration);

      accumulatedOffset += Math.random() * duration * _this.stackAllowance * 2 + duration * (1 - _this.stackAllowance);
    }
    return _this;
  }

  _createClass(StackedSegment, [{
    key: 'copy',
    value: function copy(stackedSegment, recursive) {
      _get(Object.getPrototypeOf(StackedSegment.prototype), 'copy', this).call(this, stackedSegment);

      this.stackAllowance = stackedSegment.stackAllowance;

      for (var i = 0; i < stackedSegment.segments.length; i++) {
        var segment = stackedSegment.segments[i];
        this.segments.push(recursive ? segment.clone() : segment);

        this.segmentOffsets.push(stackedSegment.segmentOffsets[i]);
        this.segmentEndTimes.push(stackedSegment.segmentEndTimes[i]);
      }

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new StackedSegment().copy(this, true);
    }

    /// Generators

  }, {
    key: 'msSegmentOffset',
    value: function msSegmentOffset(idx) {
      return this.segmentOffsets[idx] * 1000;
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      return Math.max.apply(null, this.segmentEndTimes);
    }
  }, {
    key: 'lastSegment',
    value: function lastSegment() {
      var maxEndTime = Math.max.apply(null, this.segmentEndTimes);
      var maxEndTimeIndex = this.segmentEndTimes.indexOf(maxEndTime) || this.segmentEndTimes.length - 1;
      return this.segments[maxEndTimeIndex];
    }
  }]);

  return StackedSegment;
}(Segment);

},{"./segment":19}],23:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisualSegment = require('./visual-segment');
var AudioSegment = require('./audio-segment');

module.exports = function (_VisualSegment) {
  _inherits(VideoSegment, _VisualSegment);

  function VideoSegment(options) {
    _classCallCheck(this, VideoSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VideoSegment).call(this, options));

    _this.segmentType = 'video';

    _this.audioFadeDuration = options.audioFadeDuration || 0;
    _this.videoFadeDuration = options.videoFadeDuration || 0;

    _this.audioHandleMedia = options.audioHandleMedia;
    _this.audioHandleSegmentOptions = options.audioHandleSegmentOptions || {};
    _this.audioHandleFadeDuration = options.audioHandleFadeDuration || 0.25;
    _this.audioHandleStartTimeOffset = options.audioHandleStartTimeOffset || 0.0;

    if (_this.audioHandleMedia) {
      _this.volume = 0;
    } else if (options.volume && !isNaN(parseFloat(options.volume))) {
      _this.volume = options.volume;
    } else {
      _this.volume = 1.0;
    }
    return _this;
  }

  _createClass(VideoSegment, [{
    key: 'copy',
    value: function copy(videoSegment) {
      _get(Object.getPrototypeOf(VideoSegment.prototype), 'copy', this).call(this, videoSegment);

      this.audioFadeDuration = videoSegment.audioFadeDuration;
      this.videoFadeDuration = videoSegment.videoFadeDuration;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new VideoSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setAudioFadeDuration',
    value: function setAudioFadeDuration(audioFadeDuration) {
      this.audioFadeDuration = audioFadeDuration;
      return this;
    }
  }, {
    key: 'setVideoFadeDuration',
    value: function setVideoFadeDuration(videoFadeDuration) {
      this.videoFadeDuration = videoFadeDuration;
      return this;
    }
  }, {
    key: 'setAudioHandleMedia',
    value: function setAudioHandleMedia(audioHandleMedia) {
      this.audioHandleMedia = audioHandleMedia;
      this.setVolume(0);
      return this;
    }
  }, {
    key: 'setAudioHandleFadeDuration',
    value: function setAudioHandleFadeDuration(audioHandleFadeDuration) {
      this.audioHandleFadeDuration = audioHandleFadeDuration;
      return this;
    }
  }, {
    key: 'setAudioHandleStartTimeOffset',
    value: function setAudioHandleStartTimeOffset(audioHandleStartTimeOffset) {
      this.audioHandleStartTimeOffset = audioHandleStartTimeOffset;
      return this;
    }
  }, {
    key: 'setVolume',
    value: function setVolume(volume) {
      this.volume = volume;

      this.notifyChangeHandlers('volume', volume);

      return this;
    }

    // Generators

  }, {
    key: 'simpleName',
    value: function simpleName() {
      return 'video - ' + this.filename;
    }
  }, {
    key: 'associatedSegments',
    value: function associatedSegments() {
      if (!this.audioHandleMedia) {
        return null;
      }

      var audioHandleOptions = this.audioHandleSegmentOptions;
      for (var key in this.audioHandleMedia) {
        if (this.audioHandleMedia.hasOwnProperty(key)) {
          audioHandleOptions[key] = this.audioHandleMedia[key];
        }
      }

      var audioHandleSegment = new AudioSegment(audioHandleOptions);

      audioHandleSegment.setStartTime(this.startTime + this.audioHandleStartTimeOffset).setDuration(this.getDuration() + this.audioHandleFadeDuration * 2).setFadeDuration(this.audioHandleFadeDuration).setPlaybackRate(this.playbackRate).setLoop(this.loop);

      return [{
        segment: audioHandleSegment,
        offset: -this.audioHandleFadeDuration
      }];
    }
  }]);

  return VideoSegment;
}(VisualSegment);

},{"./audio-segment":14,"./visual-segment":24}],24:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaSegment = require('./media-segment');

/// abstract superclass for Video, Color, Image
/// Dynamic properties on web: opacity
module.exports = function (_MediaSegment) {
  _inherits(VisualSegment, _MediaSegment);

  function VisualSegment(options) {
    _classCallCheck(this, VisualSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VisualSegment).call(this, options));

    _this.segmentType = 'visual';

    _this.z = options.z || 0;
    _this.opacity = options.opacity || 1.0;
    _this.width = options.width;
    _this.top = options.top;
    _this.left = options.left;
    return _this;
  }

  _createClass(VisualSegment, [{
    key: 'copy',
    value: function copy(visualSegment) {
      _get(Object.getPrototypeOf(VisualSegment.prototype), 'copy', this).call(this, visualSegment);

      this.z = visualSegment.z;
      this.opacity = visualSegment.opacity;
      this.width = visualSegment.width;
      this.left = visualSegment.left;
      this.top = visualSegment.top;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new VisualSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setOpacity',
    value: function setOpacity(opacity) {
      this.opacity = opacity;

      this.notifyChangeHandlers('opacity', opacity);

      return this;
    }
  }]);

  return VisualSegment;
}(MediaSegment);

},{"./media-segment":18}],25:[function(require,module,exports){
'use strict';

var frampton = require('./frampton');

frampton.WebRenderer = require('./renderer/web-renderer');

module.exports = frampton;

},{"./frampton":9,"./renderer/web-renderer":13}]},{},[4]);
