// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
const EventBus = new Vue();
Vue.prototype.$EventBus = EventBus;

import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
import { isCardID, isMPBank, sliceFile, makeUUID, makePage, isPhone } from './utils';
Vue.prototype.$isCardID = isCardID;
Vue.prototype.$isMPBank = isMPBank;
Vue.prototype.$sliceFile = sliceFile;
Vue.prototype.$makeUUID = makeUUID;
Vue.prototype.$makePage = makePage;
Vue.prototype.$isPhone = isPhone;
import { get, post, upload, plupload } from './components/api/require'
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$upload = upload;
Vue.prototype.$plupload = plupload;
import async from 'async';
Vue.prototype.$async = async;
//bootstrap全局引入
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
// 引入 ele
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)
import '@/assets/web/css/defaultele.css';
//引入表格
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// web 引入字体库
import "@/assets/web/iconfont/iconfont.css"

import router from './router'
// 引入css
import "@/assets/css/common.css"
// 引入字体库
import "@/assets/font/iconfont.css"
// 轮播图引入
import wcSwiper from 'wc-swiper'
import 'wc-swiper/style.css'
Vue.use(wcSwiper);

import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

// 引入全局过滤器
import moment from 'moment'
import { verify } from 'crypto';
Vue.filter('dateFormat', function (datastr, pattern = "YYYY-MM-DD") {
  // 使用node中的moment.js
  return moment(datastr).format(pattern)

})

Vue.config.productionTip = false
// Vue.directive('title', {
//   inserted: function (el, binding) {
//     document.title = el.dataset.title
//   }
// });
// 可以使相应页面显示相应的title

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
