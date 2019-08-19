import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login';
import Manager from '../components/Manager';
import People from '../components/People';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path:'/people',
      name:'people',
      component:People
    },
    {
      path:'/manager',
      name:'manager',
      component:Manager
    },
    {
      path:'*',
      redirect:'/'
    }
  ]
})
