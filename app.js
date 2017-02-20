const http = require('http')
  ,cheerio = require('cheerio')
  ,express = require('express')
  ,morgan = require('morgan')
  ,fs = require('fs')
  ,bodyParser=require('body-parser')
  ,router = express.Router()
  ,routes = require('./routes')
  ,common = require('./components/common')
  ,tools = require('./components/tools')
;

app = express();


//用于解析application/json方法传的参数
app.use(bodyParser.json());
//用于解析application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

app.use(morgan('dev'));

app.use(router);
routes(router);

app.listen(5200,()=>{
  console.log('server listening at http://127.0.0.1:5200');
  console.log("发起请求的参考格式：http://127.0.0.1:5200?novelName=诛仙&author=萧鼎");
});