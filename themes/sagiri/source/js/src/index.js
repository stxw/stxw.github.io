window.FastClick = require('fastclick');
require('lazyload');
require('fancybox')(window.$);
window.notie = require('corner-notie');

require('./utils');
require('./motion');
require('./affix');
require('./pisces')();
require('./scrollspy');
require('./post-details')();
require('./bootstrap');
require('./leancloud')();
require('./share')(); //文章分享
require('./since');  //运行时间统计
require('./title'); //标题变化
require('./type');
require('./mix');
require('./scroll'); //回到顶部
// require('./kanban'); //看板娘
// require('./evanyou'); //背景彩带
// require('./clipboard'); //剪贴板加版权
// require('./pjax'); //
// require('./online'); //在线人数统计
// require('./search'); //搜索
