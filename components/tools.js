(function() {
  exports.intersection = function(arr1, arr2) {
    var num1, num2;
    num1 = Math.max.apply(null, [arr1[0], arr2[0]]);
    num2 = Math.min.apply(null, [arr1[1], arr2[1]]);
    if (num2 < num1) {
      return null;
    } else {
      return [num1, num2];
    }
  };

  exports.searchStr = function(str) {
    var matchstr;
    matchstr = str.split('');
    return matchstr = '%' + matchstr.join('%') + '%';
  };

  exports.pad0 = function(num, n) {
    var len;
    len = num.toString().length;
    while (len < n) {
      num = '0' + num;
      len++;
    }
    return num;
  };

}).call(this);
