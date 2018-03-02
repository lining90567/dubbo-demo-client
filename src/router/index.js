import Vue from 'vue'
import Router from 'vue-router'
import LoginView from '@/views/login/index'

Vue.use(Router)

//按需加载
/**
 * 有时候我们想把某个路由下的所有组件都打包在同个异步 chunk 中。
 * 只需要 给 chunk 命名，提供 require.ensure 第三个参数作为 chunk 的名称。
 * Webpack 将相同 chunk 下的所有异步模块打包到一个异步块里面，
 * 这也意味着我们无须明确列出 require.ensure 的依赖（传空数组就行）。
 */
//const Index = resolve => require(['@/views/index'], resolve)
//const foodList = r => require.ensure([], () => r(require('@/page/foodList')), 'foodList');

const router = new Router({
  routes: [
    {
      path: '/login',
      name: "login",
      component: LoginView,
      meta: { requiresAuth: false }
    },{
      path: '/index',
      redirect: '/',
      meta: { requiresAuth: true }
    }
  ]
});
generateIndexRouter();

// 验证token，存在才跳转
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('token')
  if(to.path === '/') {
    if(!token) {
      next({
				path: '/login',
				query: { redirect: to.fullPath }
      })
      return
    }
  }

	if(to.meta.requiresAuth) {
		if(token) {
			next()
		} else {
			next({
				path: '/login',
				query: { redirect: to.fullPath }
			})
		}
	} else {   
		next()
	}
});

router.afterEach((to, from) => {
  // 设置面包屑
  let breadCrumbItems = []
  let homePageCrumb = {
    title: '首页',
    to: '/'
  }
  breadCrumbItems.push(homePageCrumb)
  if(to.meta.nameFullPath) {
    let fullPathSplit = to.meta.nameFullPath.split('/')
    fullPathSplit.forEach(( item, index ) => {
      let routerBreadCrumb = {
        title: item,
        to: (index == fullPathSplit.length - 1 ? to.path : '')
      }
      breadCrumbItems.push(routerBreadCrumb)
    });
  }
  // 更新到state
  router.app.$store.dispatch('setBreadcurmbItems', breadCrumbItems)
})

// 生成首页路由
function generateIndexRouter() {
  if (!sessionStorage.routers) {
    return
  }
  let indexRouter = {
    path: '/',
    name: "/",
    component: resolve => require(['@/views/home/index'], resolve),
    children: [
      ...generateChildRouters()
    ]
  }
  router.addRoutes([indexRouter])
}

// 生成嵌套路由（子路由）
function generateChildRouters() {
  let routers = JSON.parse(sessionStorage.routers)
  let childRouters = []
  for(let router of routers) {
    if(router.code != null) {
      let routerProps = JSON.parse(router.properties)
      let childRouter = {
        path: router.url,
        name: router.code,
        component: resolve => require(['@/views/' + router.code + '/index'], resolve),
        meta: { routerId: router.id, requiresAuth: routerProps.meta.requiresAuth, nameFullPath: routerProps.nameFullPath }
      }
      childRouters.push(childRouter)      
    }
  }
  return childRouters
}

export default router;
