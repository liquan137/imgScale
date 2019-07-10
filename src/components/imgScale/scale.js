import Vue from 'vue'
import imgScale from './imgScale.vue'

const VueImgScale ={
	install:function(vue){
		Vue.component('vue-imgScale',imgScale)
	}
}
export default VueImgScale