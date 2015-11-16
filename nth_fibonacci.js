var now = require('performance-now');


// Different approaches to getting the nth Fibonacci number.

var functional = function(n) {
  if (n <= 0) throw new RangeError('n must be a natural number (> 0); n is ' + n);
  if (n === 1) return 1;
  if (n === 2) return 1;
  return functional(n - 2) + functional(n - 1);
};

var procedural = function(n) {
  if (n <= 0) throw new RangeError('n must be a natural number (> 0); n is ' + n);
  if (n === 1) return 1;
  if (n === 2) return 1;

  var result;

  var result_2 = 1;
  var result_1 = 1;
  for (var i = 3; i <= n; ++i) {
    result = result_2 + result_1;
    result_2 = result_1;
    result_1 = result;
  }

  return result;
};

var functional_memoize__cache = {};
var functional_memoize = function(n) {
  if (n <= 0) throw new RangeError('n must be a natural number (> 0); n is ' + n);
  if (n === 1) return 1;
  if (n === 2) return 1;
  if (!functional_memoize__cache.hasOwnProperty(n))
    functional_memoize__cache[n] = functional_memoize(n - 2) + functional_memoize(n - 1);
  return functional_memoize__cache[n];
};

var procedural_memoize__cache = {
  1: 1,
  2: 2,
};
var procedural_memoize__cache_max = 2;
var procedural_memoize = function(n) {
  if (n <= 0) throw new RangeError('n must be a natural number (> 0); n is ' + n);

  if (n > procedural_memoize__cache_max) {
    var result;
    var result_2 = procedural_memoize__cache[procedural_memoize__cache_max - 1];
    var result_1 = procedural_memoize__cache[procedural_memoize__cache_max];
    var i = procedural_memoize__cache_max + 1;
    for (; i <= n; ++i) {
      result = result_2 + result_1;
      result_2 = result_1;
      result_1 = result;
      procedural_memoize__cache[i] = result;
    }
    procedural_memoize__cache_max = n;
  }

  return procedural_memoize__cache[n];
};


var test_harness = function(m, r) {
  console.log('test harness for m=' + m + ', r=' + r);

  // register above implementations in a loop-able construct for testing
  var functions = {
    // functional: functional,
    procedural: procedural,
    functional_memoize: functional_memoize,
    procedural_memoize: procedural_memoize,
  };

  // randomly generate a set of inputs
  // use the same inputs for each function for a more fair comparison
  // get 100 inputs out of 100,000
  var inputs = new Array(m);
  for (var i = 0; i < inputs.length; ++i)
    inputs[i] = Math.floor(Math.random() * r) + 1;

  var function_, startTime, endTime;
  for (var function_name in functions) {
    if (!functions.hasOwnProperty(function_name)) continue;
    function_ = functions[function_name];
    startTime = now();
    for (var j = 0; j < inputs.length; ++j) {
      function_(inputs[j]);
    }
    endTime = now();
    console.log('  ' + function_name + ': time ' + (endTime - startTime) + ' milliseconds');
  }
};

test_harness(100, 10000);
test_harness(100, 100000);
test_harness(1000, 100000);
