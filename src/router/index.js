import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'
import Index from '../views/QuestionIndex.vue'
import Detail from '../views/QuestionDetail.vue'
import LogIn from '../views/LogIn.vue'
import User from '../views/User.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: { title: ' - トップページ', desc: 'りんご謎王のトップページです' }
  },
  {
    path: '/:id(\\d+)',
    name: 'Detail',
    component: Detail,
    meta: { title: ' - 詳細ページ', desc: 'りんご謎王の謎詳細ページです' }
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn,
    meta: { title: ' - ログインページ', desc: 'りんご謎のログインページです', isPublic: true }
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: { title: ' - ユーザーページ', desc: 'りんご謎のユーザーページです' }
  }
]

const DEFAULT_TITLE = "りんご謎王"

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe()
      resolve(user);
    }, reject);
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => !record.meta.isPublic) && !(await firebase.getCurrentUser())) {
    next({ path: '/login'});
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = DEFAULT_TITLE + (to.meta.title ? to.meta.title : "")
})

export default router
