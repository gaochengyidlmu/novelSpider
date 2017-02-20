(function() {
  var common, novel, syncNovel, tools;

  novel = require('./novel');

  syncNovel = require('./syncNovel');

  common = require('../components/common');

  tools = require('../components/tools');

  module.exports = function(router) {
    router.route('/novels').get(novel.get);
    return router.route('/1/novels').get(syncNovel.get);
  };

}).call(this);
