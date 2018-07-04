import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Question from './views/Question.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/question/:questionId',
      name: 'question',
      component: Question
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
