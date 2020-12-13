import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64';
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Load',
      component: resolve => require(['@/components/H5/loading'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/list/:tags?',
      name: 'list',
      component: resolve => require(['@/components/H5/list'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/active_detail/:voteId',
      name: 'active_detail',
      component: resolve => require(['@/components/H5/active_detail'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/panking/:voteId',
      name: 'panking',
      component: resolve => require(['@/components/H5/panking'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/participate/:voteId',
      name: 'participate',
      component: resolve => require(['@/components/H5/participate'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/partner_detail/:itemId',
      name: 'partner_detail',
      component: resolve => require(['@/components/H5/partner_detail'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/success/:voteId',
      name: 'success',
      component: resolve => require(['@/components/H5/success'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/participate_best/:voteId',
      name: 'participate_best',
      component: resolve => require(['@/components/H5/participate_best'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/rule/:voteId',
      name: 'rule',
      component: resolve => require(['@/components/H5/rule'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/history_comment',
      name: 'history_comment',
      component: resolve => require(['@/components/H5/history_comment'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/myinfo',
      name: 'myinfo',
      component: resolve => require(['@/components/H5/myinfo'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/mysign',
      name: 'mysign',
      component: resolve => require(['@/components/H5/mysign'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/poster_share/:itemId',
      name: 'poster_share',
      component: resolve => require(['@/components/H5/poster_share'], resolve),
      meta: { cmbapp: true },
    },
    {
      path: '/poster_share2/:itemId',
      name: 'poster_share2',
      component: resolve => require(['@/components/H5/poster_share2'], resolve),
      meta: { cmbapp: true },
    },
    //web页面
    {//登录页面
      path: '/web/login',
      name: 'weblogin',
      component: resolve => require(['@/components/WEB/login'], resolve),
    },
    {
      path: '/admin',
      redirect: '/web/home'
    },
    {
      path: '/web',
      component: resolve => require(['@/components/WEB/layout'], resolve),
      redirect: '/web/home',
      children: [
        {//主页
          path: 'home',
          name: 'home',
          component: resolve => require(['@/components/WEB/home'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {//活动管理
          path: 'activity',
          name: 'activity',
          component: resolve => require(['@/components/WEB/activity'], resolve),
          meta: {
            requireAuth: true,
            title: '活动管理'
          }

        },
        {//添加活动
          path: 'addactivity/:voteId?',
          name: 'addactivity',
          component: resolve => require(['@/components/WEB/addactivity'], resolve),
          meta: {
            requireAuth: true,
            title: '创建活动'
          }
        },
        {//参赛队伍
          path: 'team',
          name: 'team',
          component: resolve => require(['@/components/WEB/team'], resolve),
          meta: {
            requireAuth: true,
            title: '活动数据'
          }
        },
        {//新增队伍
          path: 'addteam/:itemId?',
          name: 'addteam',
          component: resolve => require(['@/components/WEB/addteam'], resolve),
          meta: {
            requireAuth: true,
            title: '新增队伍'
          }
        },
        {//敏感字
          path: 'sensitiveword',
          name: 'sensitiveword',
          component: resolve => require(['@/components/WEB/sensitiveword'], resolve),
          meta: {
            requireAuth: true,
            title: '敏感字'
          }
        },
        {//敏感字设置
          path: 'setsensitive',
          name: 'setsensitive',
          component: resolve => require(['@/components/WEB/setsensitive'], resolve),
          meta: {
            requireAuth: true,
            title: '敏感字设置'
          }
        },
        {//账户管理
          path: 'account',
          name: 'account',
          component: resolve => require(['@/components/WEB/account'], resolve),
          meta: {
            requireAuth: true,
            title: '账户管理'
          }
        },
        {//添加账户
          path: 'addaccount',
          name: 'addaccount',
          component: resolve => require(['@/components/WEB/addaccount'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {//规则设置
          path: 'rule/:voteId',
          name: 'webrule',
          component: resolve => require(['@/components/WEB/rule'], resolve),
          meta: {
            requireAuth: true,
            title: '规则设置'
          }
        },
        {//白名单设置
          path: 'whitelist/:voteId?',
          name: 'whitelist',
          component: resolve => require(['@/components/WEB/whitelist'], resolve),
          meta: {
            requireAuth: true,
            title: '白名单设置'
          }
        },
        {//添加白名单
          path: 'addwhitelist/:voteId',
          name: 'addwhitelist',
          component: resolve => require(['@/components/WEB/addwhitelist'], resolve),
          meta: {
            requireAuth: true,
            title: '添加白名单'
          }
        },
        {//规则列表
          path: 'rulesummary',
          name: 'rulesummary',
          component: resolve => require(['@/components/WEB/rulesummary'], resolve),
          meta: {
            requireAuth: true,
            title: '规则列表'
          }
        },
        {
          path: 'selfset/:voteId',
          name: 'selfset',
          component: resolve => require(['@/components/WEB/selfset'], resolve),
          meta: {
            requireAuth: true
          }
        }
      ]
    }
  ]
});



// 验证 token，存在才跳转
router.beforeEach((to, from, next) => {
  // next()
  if (/^\/web\/addactivity/.test(to.path)) { to.meta.title = /^\/web\/addactivity\/[0-9a-zA-Z]{1,}/.test(to.path) ? '编辑活动' : '创建活动' }
  if (/^\/web\/addteam/.test(to.path)) { to.meta.title = /^\/web\/addteam\/[0-9a-zA-Z]{1,}/.test(to.path) ? '编辑队伍' : '新增队伍' }
  if (/^\/list/.test(to.path)) Cookies.set('cmb.ListTags', to.params.tags || '');
  let token = Cookies.get('jtoken');
  if (to.meta.cmbapp) {//招行APP用 手机H5页面
    if (to.query.MobileNo) Cookies.set('cmb.MobileNo', to.query.MobileNo);
    if (to.query.UniqueUserID) Cookies.set('cmb.UniqueUserID', to.query.UniqueUserID);
    if (to.query.ExpandUserID) Cookies.set('cmb.ExpandUserID', to.query.ExpandUserID);
    if (to.query.NewUserID) Cookies.set('cmb.NewUserID', to.query.NewUserID);
    if (to.query.Level) Cookies.set('cmb.Level', to.query.Level);
    if (to.query.customerType) Cookies.set('cmb.customerType', to.query.customerType);
    if (to.query.PersonalID) Cookies.set('cmb.PersonalID', to.query.PersonalID);
    if (to.query.RealName) Cookies.set('cmb.RealName', to.query.RealName);
    try {
      var OriginalXdParams = to.query.XdParams;
      if (OriginalXdParams) {
        Cookies.set('cmb.OriginalXdParams', OriginalXdParams);
        var XdParams = decodeURIComponent(OriginalXdParams);
        Cookies.set('cmb.XdParams', XdParams);
        XdParams = JSON.parse(Base64.decode(XdParams));
        console.log(XdParams);
        if (XdParams.type == "redirect") {
          return next({
            path: XdParams.path
          });
        } else {
          return next();
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  if (to.meta.requireAuth) {
    if (token) {
      next()
    } else {
      next({
        path: '/web/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})
window._doRouterPush = (path) => router.push({ path });
window._doRouterReplace = (path) => router.replace({ path });
export default router;