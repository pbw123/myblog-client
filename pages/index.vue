<template>
  <div class="home">
    <div class="left">
      <div class="carousel" v-if="imgs.length>0">
        <el-carousel height="320px">
          <el-carousel-item v-for="(item,index) in imgs" :key="index">
            <img :src="item.cPc" v-show="!$store.state.night"/>
            <img :src="item.cNight" alt="" v-show="$store.state.night">
<!--            <img :src="n"/>-->
          </el-carousel-item>
        </el-carousel>

      </div>

      <div class="swipe">
        <van-swipe :autoplay="3000" indicator-color="white">
          <div v-for="(item,index) in imgs" :key="index">
            <van-swipe-item>
              <div class="swipe-img">
                <img :src="item.cPc"/>
              </div>
            </van-swipe-item>
          </div>

        </van-swipe>
      </div>
      <div class="article">
        <Article type="最新文章" :articles="articles"></Article>
      </div>

    </div>
  </div>
</template>

<script>
    import Article from '~/components/Article.vue'
    import img from '../assets/imgs/c1.jpg'
    import img2 from '../assets/imgs/c2.jpg'
    import img3 from '../assets/imgs/c3.jpg'
    import n from '../assets/imgs/n4.jpg'


    export default {
        name: 'index',
        head(){
            return {
                title:'首页'
            }
        },
        components: {
            Article
        },
        data() {
            return {
             n:n
            }
        },
        methods: {
        },
        mounted() {
            // window.addEventListener('scroll', this.menu,true)
        },
        async asyncData({$axios}) {
           const obj = await $axios.$get('http://localhost:8888/article/articleList')
            const carousels =await $axios.$get('http://localhost:8888/carousel/getAllCarousel')
            return {articles: obj.data, imgs: carousels.data}
        }

    }
</script>

<style lang="scss">
  @import "../assets/scss/var.scss";

  @media screen and (min-width: $size) {
    @import "../assets/scss/index.scss";
  }

  @media screen and (max-width: $size) {
    @import "../assets/scss/index-mobile.scss";
  }

</style>
