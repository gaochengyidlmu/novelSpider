(function() {
  const

  common = require('../components/common'),

  tools = require('../components/tools'),

  encode = require('../components/encode'),

  getUrl = require('../components/getUrl'),

  cheerio = require('cheerio'),
  http = require('http'),
  fs = require('fs'),

  iconv = require('iconv-lite'),

  install = require('superagent-charset'),

  request = require('superagent'),

  appcfg = require('../appcfg');
  exports.get = function(req, res) {
    let args, queryStr, url, data, bookUrl;
    args = {};
    if (common.getReqParamter(req, res, args, 'novelName', true) &&
      common.getReqParamter(req, res, args, 'author', true)) {
      console.log('args: ',args)
      queryStr = encode.chinese2Gb2312(args.novelName);
      url = appcfg.urls[0] + '/Book/Search.aspx?SearchKey=' + queryStr + '&SearchClass=1';
      console.log('start url: ',url)
      const superagent = install(request);

      //获取小说url
      superagent.get(url).charset('gb2312').end((err,data)=>{
        if (err) return common.sendError(req,res,err)
        let $ = cheerio.load(data.text, {decodeEntities: false});
        let novelArr = $('#Content ').children()
        bookUrl = getUrl.getBookUrl(novelArr, args.novelName, args.author)

        //获取小说目录url
        superagent.get(bookUrl).charset('gb2312').end((err,data)=>{
          if (err) return common.sendError(req,res,err)
          let $ = cheerio.load(data.text, {decodeEntities: false});
          let catalogUrl = appcfg.urls[0] + $('.b1 a').attr('href')
          console.log('目录url catalogUrl: ',catalogUrl)

          //获取小说章节urls
          superagent.get(catalogUrl).charset('gb2312').end((err,data)=> {
            if (err) return common.sendError(req, res, err)
            let $ = cheerio.load(data.text, {decodeEntities: false});
            let articleArr = $('.insert_list ul').find('a')
            let articleUrls = []
            for (let i = 0, len = articleArr.length; i < len; i++){
              let item = articleArr[i]
              articleUrls.push(catalogUrl.replace(/Index/,item.attribs.href.split('.')[0]) )
            }
            console.log('获取文章列表 urls 成功...')

            //获取每篇文章的内容，并写入txt
            const gapNum = 10, limit = 10000;
            let count = 0, len = articleUrls.length < limit ? articleUrls.length : limit, content = {length:len};
            let path = './novels/' + args.novelName + '-' + args.author + '.txt'

            const getData =　(start, end)=>{
              let tempCount = 0, tempContent = [];

              for(let i = start; i < end; i++){
                console.log('i: ',i)
                superagent.get(articleUrls[i]).charset('gb2312').end((err,data)=> {
                  if (err) return common.sendError(req, res, err)
                  let $ = cheerio.load(data.text, {decodeEntities: false});
                  let temper = $('.contentbox').text()
                  temper = temper.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/ig,'\r\n&nbsp;&nbsp;&nbsp;&nbsp;')
                  temper = temper.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/ig,'    ')
                  temper = $('#htmltimu').text() + '\r\n' + temper + '\r\n\r\n'
                  tempContent[i] = temper

                  count++;
                  tempCount++;
                  console.log(`第${i}章结束了！`)
                  console.log('count: ',count)
                  console.log('tempCount: ',tempCount)
                  if (count === len){
                    console.log('content success...')
                    tempContent = Array.from(tempContent).join('')
                    fs.writeFile(path, tempContent, {flag : 'a'},(err)=> {
                      if (err) return common.sendError(req, res, err)
                      common.sendSuccess(req,res)
                    })
                  } else if (tempCount === gapNum){
                    tempContent = Array.from(tempContent).join('')
                    fs.writeFile(path, tempContent, {flag : 'a'},(err)=> {
                      if (err) return common.sendError(req, res, err)
                      end = end + gapNum <= len ? end + gapNum : len;
                      start += gapNum;
                      setTimeout(()=>getData(start, end), 1000)
                    })
                  }
                })
              }
            }
            let start = 0, end = len <= gapNum ? len : gapNum;

            //初始化文件
            fs.writeFile(path, '', (err)=>{
              if (err) return common.sendError(req, res, err)
              console.log('文件初始化...')
              getData(start, end)
            })
          })
        })
      })
    }
  };

}).call(this);

