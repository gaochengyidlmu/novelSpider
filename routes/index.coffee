
novel = require('./novel')
syncNovel = require('./syncNovel')
common = require('../components/common')
tools = require('../components/tools')



module.exports = (router)->
  router.route('/novels')
  .get(novel.get)
  router.route('/1/novels')
  .get(syncNovel.get)

