
const
  common = require('../components/common'),
  tools = require('../components/tools'),
  encode = require('../components/encode'),
  getUrl = require('../components/getUrl'),
  cheerio = require('cheerio'),
  http = require('http'),
  fs = require('fs'),
  iconv = require('iconv-lite'),
  request = require('sync-request'),
  appcfg = require('../appcfg');

exports.get = (req, res)=>{
  let args, queryStr, url;
  args = {};
  if (common.getReqParamter(req, res, args, 'novelName', true) &&
    common.getReqParamter(req, res, args, 'author', true)) {
    console.log('args: ', args)
    queryStr = encode.chinese2Gb2312(args.novelName);
    url = appcfg.urls[0] + '/Book/Search.aspx?SearchKey=' + queryStr + '&SearchClass=1';
    console.log('start url: ', url)

    http.get(url, (data)=>{
      let chunks = [];
      data.on('data', (chunk)=>{
        chunks.push(chunk)
      });

      //获取小说url
      data.on('end', ()=>{
        let html = iconv.decode(Buffer.concat(chunks), 'gb2312');
        let $ = cheerio.load(html, {decodeEntities: false});
        let novelArr = $('#Content ').children();
        let bookUrl = getUrl.getBookUrl(novelArr, args.novelName, args.author);
        console.log('获取小说主页面 URL 成功:',bookUrl);


        //获取小说目录url
        html = request('GET', bookUrl);
        $ = cheerio.load(html, {decodeEntities: false});
        let catalogUrl = appcfg.urls[0] + $('.b1 a').attr('href');
        console.log('目录url catalogUrl: ',catalogUrl);
        common.sendSuccess(req, res, {catalogUrl: catalogUrl});
      })
    })
  }
};
