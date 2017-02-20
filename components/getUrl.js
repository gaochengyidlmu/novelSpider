const appcfg = require('../appcfg')
;


exports.getBookUrl = (novelArr, novelName, author)=>{
  let bookUrl;
  for (let i = 0,len = novelArr.length; i < len; i++){
    let item = novelArr[i];
    if (item.attribs.id == 'CListTitle'){
      if (item.children[0].children[0].children[0].data === novelName &&
        item.children[2].children[0].data === author
      ){
        bookUrl = appcfg.urls[0] + item.children[0].attribs.href;
        console.log('查找的书的 Url： ',bookUrl);
        return bookUrl
      }
    }
  }
};
