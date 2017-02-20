
#对数组的处理

#两组数，得出其交集
#example: ([10,15],[9,13]) => [10,13]
exports.intersection=(arr1,arr2)->
  num1=Math.max.apply(null,[arr1[0],arr2[0]])
  num2=Math.min.apply(null,[arr1[1],arr2[1]])
  if num2<num1
    return null
  else
    return [num1,num2]

#对字符串的处理


#将字符串拆开，用于模糊搜索
exports.searchStr=(str)->
  matchstr = str.split('')
  return matchstr = '%' + matchstr.join('%') + '%'

#将数字1转换为字符串001，自动补齐前面的0
exports.pad0 = (num, n)->
  len = num.toString().length
  while len < n
    num = '0' + num
    len++
  return num

#对对象的处理