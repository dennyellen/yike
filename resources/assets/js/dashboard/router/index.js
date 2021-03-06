import Vue from 'vue'
import Router from 'vue-router'
import beforeEach from './beforeEach'
import NotFound from '../components/NotFound'
import Content from '../components/Content'
import { routes as home } from '../home'
import { routes as auth } from 'app/auth'
import { routes as user } from '../user'
import { routes as post } from '../post'
import { routes as comment } from '../comment'
import { routes as tag } from '../tag'
import { routes as role } from '../role'
import { routes as series } from '../series'
import { routes as banner } from '../banner'
import { routes as report } from '../report'
import { routes as log } from '../log'
import { routes as feedback } from '../feedback'

Vue.use(Router)

const NotFoundRoute = {
  name: '404',
  path: '*',
  component: NotFound
}

const routes = [{
  path: '/dashboard',
  component: Content,
  redirect: { name: 'dashboard.home' },
  children: [
    ...auth,
    ...home,
    ...user,
    ...post,
    ...comment,
    ...tag,
    ...role,
    ...series,
    ...banner,
    ...report,
    ...log,
    ...feedback,
    NotFoundRoute,
  ]
}]

const router = new Router({
  routes,
  linkActiveClass: 'active',
  mode: 'history', // do not use /#/.
})

/**
* Before a route is resolved we check for
* the token if the route is marked as
* requireAuth.
*/
router.beforeEach(beforeEach)

export default router
