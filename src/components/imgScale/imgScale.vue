<template>
  <div>
    <div class="upload-item item-bg" v-for="(item,index) in list" :key="index">
      <div class="remove" @click="removeItem(item)"><i class="iconfont icon-cuowuguanbiquxiao-fangkuang"></i></div>
      <img class="upload-item-img active" :src="item.base64"
           alt="" :style="{width:cutWidth,height:cutHeight,position:'relative'}">
    </div>
    <div class="upload-item upload-item-input-box">
      <input class="upload-item-input" type="file" value="" ref="img" @input="changesUpload" multiple>
      <i class="iconfont icon-jia-xianxingyuankuang"></i>
      <div :class="'error-hide '+errorStates">
        <div class="remove" @click="closeError"><i class="iconfont icon-cuowuguanbiquxiao-fangkuang"></i></div>
        <p v-for="(item,index) in errorTitle" :key="index" :class="item.errorMsgShow">{{ item.title }}</p>
      </div>
    </div>
    <canvas ref="myCanvas" style="display: none"></canvas>
  </div>
</template>

<script>
export default {
  name: 'imgScale',
  props: {
    cutWidth: {
      type: [Number, String],
      default: function (e) {
        return 'auto'
      }
    },
    cutHeight: {
      type: [Number, String],
      default: function (e) {
        return 'auto'
      }
    },
    size: {
      type: [Number, String],
      default: function (e) {
        return 5024
      }
    },
    type: {
      type: Array,
      default: function (e) {
        return ['jpg', 'png', 'jpeg', 'bmp']
      }
    }
  },
  data () {
    return {
      list: [],
      cutH: '',
      cutW: '',
      max: '',
      uploadList: [],
      typeList: [],
      errorStates: '',
      errorTitle: []
    }
  },
  watch: {
    list (n, o) {
      this.changesList(n)
    }
  },
  mounted () {
    this.cutH = this.cutHeight
    this.cutW = this.cutWidth
    this.typeList = this.type
    this.sizeOf = this.size
  },
  methods: {
    changesUpload () {
      let that = this
      var data = this.$refs.img.files
      for (var i = 0; i < data.length; i++) {
        if ((data[i].size / 1024) < that.sizeOf) {
          var reader = new FileReader()
          reader.readAsDataURL(data[i])
          reader.onload = function (e) {
            var arr = e.target.result.split(',')
            var mime = arr[0].match(/:(.*?);/)[1]
            var imgType = mime.split('/')[1]
            if (that.typeList.indexOf(imgType) >= 0) {
              that.cutImg({
                base64: e.target.result,
                cutW: that.cutW,
                cutH: that.cutH,
                callback: function (result) {
                  that.list.push({ base64: result })
                  that.uploadList.push({ base64: result })
                }
              })
            } else {
              that.setErrorMsg('error-msg', '图片格式错误', 400)
            }
          }
        } else {
          that.setErrorMsg('error-msg', '图片规格超过限制', 400)
        }
      }
    },
    changesList (n) {
      return n
    },
    base64ToBlob (base64) {
      var arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    cutImg (obj) {
      if (obj.base64 === '') return obj.callback(result)
      let that = this
      var img = new Image()
      img.src = obj.base64
      img.onload = function () {
        var load = this
        var w = load.width, h
        if (obj.cutW !== 'auto') {
          w = obj.cutW
          h = load.height / (load.width / obj.cutW)
        }
        if (obj.cutH !== 'auto') {
          h = obj.cutH
          w = load.width / (load.height / obj.cutH)
        }
        var quality = 0.7
        var canvas = that.$refs.myCanvas
        var ctx = canvas.getContext('2d')
        var anw = document.createAttribute('width')
        anw.nodeValue = w
        var anh = document.createAttribute('height')
        anh.nodeValue = h
        canvas.setAttributeNode((anw))
        canvas.setAttributeNode(anh)
        ctx.drawImage(load, 0, 0, w, h)
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality
        }
        var result = canvas.toDataURL('image/jpeg', quality)
        obj.callback(result)
      }
    },
    removeItem (item) {
      this.list.splice(this.list.indexOf(item), 1)
      this.uploadList.splice(this.list.indexOf(item), 1)
    },
    /* 获取未缩小的图片数组 */
    getUploadList () {
      return this.uploadList
    },
    /* 获取缩略图片数组 */
    getThumList () {
      return this.list
    },
    setErrorMsg (states, title, time) {
      this.errorStates = states
      this.errorTitle.push({ title: title, errorMsgShow: 'msgShow' })
    },
    closeError () {
      let that = this
      for (var a in that.errorTitle) {
        that.errorTitle[a].errorMsgShow = 'msgHide'
        setTimeout(() => {
          that.errorTitle.splice(a, 1)
        }, 1000)
        that.errorStates = ''
      }
    }
  }
}
</script>

<style scoped>
@import './iconfont/iconfont.css';
.error-hide{
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  z-index: 100;
  font-size: 16px;
  line-height: 30px;
  color: white;
  text-align: center;
  font-weight: bold;
  transition: 0.3s;
  padding: 18px 0;
}
.error-msg{
  top:0;
  left: 0;
  z-index: 100;
}
.msgShow{
  transition: 0.3s;
}
.msgHide{
  position: relative;
  overflow: hidden;
  height: 0;
}
.remove{
  background: rgba(0,0,0,0.5);
  position: absolute;
  right: 0;
  top: 0;
  width: 26px;
  height: 26px;
  line-height: 26px;
  font-size: 22px;
  color: white;
  z-index: 200;
  transition: 0.2s;
}
.remove:hover{
  background: rgba(0,0,0,1);
}
.upload-item-input{
  width: 160px;
  height: 160px;
  background: red;
  float: left;
  border: none;
  outline: none;
  opacity: 0;
  position: absolute;
  z-index: 3;
  left: 0;
  top: 0;
}
.upload-item{
  width: 160px;
  height: 160px;
  background: transparent;
  font-size: 50px;
  text-align: center;
  line-height: 160px;
  border: 1px solid #aaa;
  box-sizing: border-box;
  box-shadow: inset 0px 0px 0px rgba(0,0,0,0.25);
  position: relative;
  float: left;
  margin: 5px;
}
.upload-item{
  text-align: center;
  overflow: hidden;
}
.upload-item:active{
  boder:1px solid #2d8cf0;
  box-shadow: inset 0px 0px 6px rgba(0,0,0,0.25);
}
.upload-item-img{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 158px;
  height: 158px;
  z-index: 0;
  opacity: 0;
}
.item-bg{
  background: #eee;
}
.active{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 158px;
  height: 158px;
  z-index: 0;
  opacity: 1;
}
.icon-jia-xianxingyuankuang{
  position: absolute;
  z-index: 0;
  width: 159px;
  height: 159px;
  left: 1px;
  top: 1px;
  line-height: 159px;
  font-size: 36px;
}
</style>
