import Vue from 'vue'
import Router from 'vue-router'
import imgScale from '@/components/scale'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'imgScale',
      component: imgScale
    }
  ]
})
