/* text-mix - v0.3.0 - 2015-05-10 */
// Uses Node, AMD or browser globals to create a module.
//
// https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['levenshtein'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('levenshtein'));
  } else {
    // Browser globals (root is window)
    root.textMix = factory(root.Levenshtein);
  }
}(this, function (Levenshtein) {
  'use strict';

  var utils = {
    // from jQuery, MIT license
    isNumeric: function( obj ) {
      return !isNaN( parseFloat(obj) ) && isFinite( obj );
    }
  };

  var debug = function() {
    if (false)
    console.log.apply(console, arguments);
  };


  var NOOP = 'noop',
      SUB = 'sub',
      INSERT = 'ins',
      DELETION = 'del';

  // cache creation of Levenshtein matrix
  var matrixMemory = {},
      cachedLevenshtein = function (text1, text2) {
        var mmKey = text1 + ' ' + text2;
        if (!matrixMemory[mmKey]) {
          matrixMemory[mmKey] = (new Levenshtein(text1, text2));
        }
        return matrixMemory[mmKey];
      };

  // An iteration step through a Levenshtein matrix (reverse backwards)
  var next = function (matrix, startX, startY) {
    // http://stackoverflow.com/questions/5849139/levenshtein-distance-inferring-the-edit-operations-from-the-matrix
    // assert startY > matrix.length
    // assert startX > matrix[0].length
    var val = matrix[startY][startX],
        nextX = startX, nextY = startY, operation,
        diag = Infinity,
        up = Infinity,
        left = Infinity;
    if (startY > 0) {
      up = matrix[startY - 1][startX];
    }
    if (startX > 0) {
      left = matrix[startY][startX - 1];
    }
    if (startX > 0 && startY > 0) {
      diag = matrix[startY - 1][startX - 1];
      }
    var min = Math.min(up, left, diag);
    // console.log('val:', val, 'up:', up, 'diag:', diag, 'left:', left, 'min:', min);
    if (diag === 0 || diag <= min) {
      nextX = startX - 1;
      nextY = startY - 1;
      if (diag < val) {
        operation = SUB;
      } else if (diag === val) {
        // NOOP sometimes should be SUB
        operation = NOOP;
      }
    } else if (left === 0 || left <= min) {
      operation = INSERT;
      nextX = startX - 1;
    } else {
      operation = DELETION;
      nextY = startY -1;
    }
    return [min, operation, nextX, nextY];
  };

  // Traverse a path through the Levenshtein matrix
  function traverse (text1, text2, iterations) {
    var lev = cachedLevenshtein(text1, text2);
    if (lev.distance === 0) {
      // text1 == text2
      return text1;
    }
    var matrix = lev.getMatrix(),
        startY = matrix.length - 1,
        startX = matrix[0].length - 1,
        out,
        ret = text2.split('');

    debug('traverse', text1, text2, iterations);
    debug(lev.inspect());
    while (iterations-- && (startX || startY)) {
      out = next(matrix, startX, startY);
      debug('.next', 'iterations:', iterations, 'startX:', startX, 'startY:', startY);
      debug('..out:', out);
      startX = out[2];
      startY = out[3];
      switch (out[1]) {
        case NOOP:
          ++iterations;
          // NOOP sometimes should be SUB
          /* falls through */
        case SUB:
          ret[startY] = text1[startX];
        break;
        case INSERT:
          ret.splice(startY, 0, text1[startX]);
        break;
        case DELETION:
          ret.splice(startX, 1);
        break;
      }
      debug('..ret:', ret.join(''));
    }
    return ret.join('');
  }

  // helper for `stringMix`
  // @returns {char} The character between text1 and text2 at index idx
  var _pick = function(text1, text2, idx, amount) {
    // assert idx < Math.max(text1.length, text2.length)
    var n_max = Math.max(text1.length, text2.length);
    if (idx >= text1.length) {
      return text2[idx];
    } else if (idx >= text2.length) {
      return text1[idx];
    }
    // left to right:
    return (idx < amount * n_max) ? text2[idx]: text1[idx];
    // random method:
    // return (Math.random() < amount) ? text2[idx]: text1[idx];
  };

  function reverse (s) {
    return s.split('').reverse().join('');
  }

  // Simple tween between two strings
  // @param {String} text1 - The starting text
  // @param {String} text2 - The ending text
  // @param {Number} amount - The amount to tween, between 0.0 and 1.0 for LTR
  //                          and 0.0 to -1.0 for RTL
  function stringMix (text1, text2, amount) {
    var newLength = text1.length + Math.floor((text2.length - text1.length) * Math.abs(amount)),
        out = '', i;
    if (amount < 0) {
      var rt1 = reverse(text1);
      var rt2 = reverse(text2);
      for (i = 0; i < newLength; i++) {
        out += _pick(rt1, rt2, i, -amount);
      }
      return reverse(out);
    } else {
      for (i = 0; i < newLength; i++) {
        out += _pick(text1, text2, i, amount);
      }
      return out;
    }
  }

  // Tween between two numbers
  function numberMix (num1, num2, amount) {
    // FIXME sig digs
    return Math.round(num1 + (num2 - num1) * amount);
  }

  // Splits a sentence into words
  // Demo: http://youtu.be/M7FIvfx5J10
  var get_words = function(text) {
    return text.split(' ');
    // return [text];
  };

  // Tween text between two values
  // @param {String} text1 - The starting text
  // @param {String} text2 - The ending text
  // @param {Number} amount - The amount to tween, between 0.0 and 1.0
  // @param {Object} [options] - Any additional options
  // @param {bool} [options.rtl] - Text is right-to-left
  var textMix = function(text1, text2, amount, options) {
    var words1 = get_words(text1),
        words2 = get_words(text2),
        n_max = Math.max(words1.length, words2.length),
        out = [],
        w1, w2;
    for (var i = 0; i < n_max; i++) {
      w1 = words1[i];
      w2 = words2[i];
      if (utils.isNumeric(w1) && utils.isNumeric(w2)) {
        out.push(numberMix(parseFloat(w1), parseFloat(w2), amount));
      } else if (!w1 || !w1.length || !w2 || !w2.length) {
        out.push(stringMix(w1 || '', w2 || '', options && options.rtl ? -amount : amount));
      } else {
        var d = (cachedLevenshtein(w1, w2)).distance;
        if (options && options.rtl) {
          out.push(traverse(w2, w1, Math.round(amount * d)));
        } else {
          out.push(traverse(w1, w2, d - Math.round(amount * d)));
        }
      }
    }
    return out.join(' ');
  };

  // Variation of `textMix` to use with `mix`.
  var _textMix = function(tweenFuncs, amount) {
    var out = [], tweenFunc, _amount;
    for (var i = 0; i < tweenFuncs.length; i++) {
      tweenFunc = tweenFuncs[i];
      if (tweenFunc.distance) {
        // need to convert amount to an iteration count
        _amount = Math.round(amount * tweenFunc.distance);
        if (!tweenFunc.rtl) {
          _amount = tweenFunc.distance - _amount;
        }
      } else {
        _amount = amount;
      }
      out.push(tweenFunc.func(tweenFunc.a, tweenFunc.b, _amount));
    }
    return out.join(' ');
  };

  // A version of textMix optimized for use with the same words
  // @param {String} text1 - The starting text
  // @param {String} text2 - The ending text
  // @param {Object} [options] - Any additional options
  // @param {bool} [options.rtl] - Text is right-to-left
  // @returns {Function}
  function mix(text1, text2, options) {
    var words1 = get_words(text1),
        words2 = get_words(text2);
    var n_max = Math.max(words1.length, words2.length);
    var tweenFuncs = [];
    var w1, w2;
    for (var i = 0; i < n_max; i++) {
      w1 = words1[i];
      w2 = words2[i];
      if (utils.isNumeric(w1) && utils.isNumeric(w2)) {
        tweenFuncs.push({func: numberMix, a: parseFloat(w1), b: parseFloat(w2)});
      } else if (!w1 || !w1.length || !w2 || !w2.length) {
        tweenFuncs.push({func: stringMix, a: w1 || '', b: w2 || ''});
      } else {
        var d = (cachedLevenshtein(w1, w2)).distance;
        if (options && options.rtl) {
          tweenFuncs.push({func: traverse, a: w2, b: w1, distance: d, rtl: true});
        } else {
          tweenFuncs.push({func: traverse, a: w1, b: w2, distance: d});
        }
      }
    }
    return function (amount) {
      return _textMix(tweenFuncs, amount);
    };
  }


  return {
    traverse: traverse,
    stringMix: stringMix,
    numberMix: numberMix,
    textMix: textMix,
    mix: mix
  };
}));
