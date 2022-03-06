<template>
  <div id="app" :class="[!night?one:two]"
       :style="{backgroundImage: 'url(' + (!night ? info.img : info.nightImg) + ')'}">
      <!--      <header @click="onNight()"-->
      <!--              :style="{backgroundImage: 'url(' + (!night ? info.bgImg : info.bgImg2) + ')'}">-->
      <!--      </header>-->
      <header @click="onNight()"
              :style="{backgroundImage: 'url(' + (!night ? info.bgImg : info.bgImg2) + ')',backgroundSize:'cover',opacity:0.9}">
      </header>
      <div class="top-nav">
        <div class="directory" @click="showPopup">
          <img :src="directory"/>
        </div>
        <div class="yemu" @click="onNight()">
          <img :src="yemuwhite"/>
        </div>
      </div>

      <!--      PC  -->
      <div class="nav" :class="navBarFixed == true ? 'navBarWrap' :''">
        <el-col class="menu">
          <li class="">
            <nuxt-link to="/" class="item">首页</nuxt-link>
          </li>
          <li class="">
            <nuxt-link to="/dynamic" class="item">动态</nuxt-link>
          </li>
          <li class="">
            <nuxt-link to="/message" class="item">留言</nuxt-link>
          </li>
          <li class="">
            <nuxt-link to="/about" class="item">关于</nuxt-link>
          </li>

        </el-col>
      </div>

      <div class="main-content">
        <div class="left-right">
          <div class="main-left">
            <nuxt/>
          </div>

          <div class="main-right">
            <!--            <Right class="main-right" :con="con" :articles="articles" :links="links"/>-->
            <el-card :class="[navBarFixed == true ? 'r-card-fixed' :'r-card',
            !$store.state.night?'card':'n-card']" id="ri">
              <div class="right-r">
                <div class="attention">
                  <div class="title-r">关注我</div>
                  <div class="logo">
                    <div class="item-r" v-for="(item,index) in con" :key="index">
                      <div v-if="item.name==='公众号'">
                        <el-tooltip placement="bottom" effect="light">
                          <div slot="content">
                            <img :src="info.gzh" style="width: 300px">
                            <!--                            <img :src="we" style="width: 350px">-->
                          </div>
                          <div>
                            <div class="icon">
                              <img :src="item.icon" alt="">
                            </div>
                            <div class="name">
                              {{item.name}}
                            </div>
                          </div>
                        </el-tooltip>
                      </div>

                      <div v-else>
                        <a :href="item.link">
                          <div class="icon">
                            <img :src="item.icon" alt="">
                          </div>
                        </a>
                        <div class="name">
                          {{item.name}}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="art">
                  <div class="title-r">
                    最新文章
                  </div>

                  <div class="article-list" v-for="(item,index) in articles" :key="index">
                    <nuxt-link :to="{name:'detail',params:{article:item,len:item.comments.length}}"
                    :style="{'color':night?'white':'black'}">
                     <li>
                       {{item.aTitle}}
                     </li>
                   </nuxt-link>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    <a href="#" style="color: black">
      <div class="icp" :style="{'color':night?'white':'black'}">
        {{info.icp}}
      </div>
    </a>

  </div>
</template>

<script>
    const directory = require('../assets/imgs/directory4.png')
    const search = require('../assets/imgs/yl.png')
    const yemu = require('../assets/imgs/ym.png')
    const yemuwhite = require('../assets/imgs/ymwhite.png')
    const message = require('../assets/imgs/message.png')
    const about = require('../assets/imgs/about.png')
    const dynamic = require('../assets/imgs/dynamic.png')
    const home = require('../assets/imgs/home.png')
    const bg = require('../assets/imgs/bg.jpg')
    const bg2 = require('../assets/imgs/bg3.jpg')
    const we = require('../assets/imgs/g.jpg')
    const topbg = require('../assets/imgs/topbg.jpg')
    const jianshu = require('../assets/imgs/jianshu3.png')
    const github = require('../assets/imgs/github.png')
    const gzh = require('../assets/imgs/gzh.jpg')
    const gitee = require('../assets/imgs/gitee2.png')
    const juejin = require('../assets/imgs/juejin2.png')
    const aImg= require('../assets/imgs/n.jpg')
    const hoverImg = require('../assets/imgs/n3.jpg')

    export default {
        data() {
            return {
                we: we,
                one: 'one',
                two: 'two',
                bg: bg,
                bg2: bg2,
                navBarFixed: false,
                show: false,
                directory: directory,
                search: search,
                yemu: yemu,
                yemuwhite: yemuwhite,
                count: 0,
                isLoading: false,
                night: false,
                message: message,
                home: home,
                dynamic: dynamic,
                about: about,
                con: [
                  {
                    icon:jianshu,
                    name:'简书'
                  },{
                    icon:juejin,
                    name:'掘金'
                  },{
                    icon:gitee,
                    name:'码云'
                  },{
                    icon:github,
                    name:'github'
                  },{
                    icon:gzh,
                    name:'公众号'
                  }
                ],
                articles: [],
                links: [],
                info: {
                    img: bg,
                    nightImg: bg2
                },
                topbg: topbg

            }
        },
        methods: {
            showPopup() {
                this.show = true;
            },

            async fetchSomething() {
                const defaultIcon = await this.$axios.$get('http://localhost:8888/web/getDefaultIcon')
                for (let i = 0; i < defaultIcon.data.length; i++) {
                    this.$store.state.icons.push(defaultIcon.data[i])
                }

                const links = await this.$axios.$get('http://localhost:8888/link/getAllLink')
                this.links = links.data
                const info = await this.$axios.$get('http://localhost:8888/web/getWebInfo')
                const articles = await this.$axios.$get('http://localhost:8888/article/getArticleTitle')
                this.articles=articles.data
                // this.info = info.data
                localStorage.setItem('info', JSON.stringify(info.data))
            },

            goDynamic() {
                this.$router.push({
                    name: 'dynamic',
                    params: {}

                });
                this.show = false;
            },
            goHome() {
                this.$router.push({
                    name: 'index',
                    params: {}
                });
                this.show = false;
            },
            goMessage() {
                this.$router.push({
                    name: 'message',
                    params: {}
                });
                this.show = false;
            },
            goAbout() {
                this.$router.push({
                    name: 'about'
                })
                this.show = false;
            },
            onRefresh() {
                setTimeout(() => {
                    this.$toast('刷新成功');
                    this.isLoading = false;
                    this.count++;
                }, 500);
            },

            onNight() {
                this.night = !this.night
                this.$store.state.night = !this.$store.state.night
            },
            handleScroll() {
                let s = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                if (s > 200) {
                    this.navBarFixed = true
                } else {
                    this.navBarFixed = false
                }
            }
        },
        components: {},
        mounted() {
            this.fetchSomething()
            window.addEventListener('scroll', this.handleScroll, true)
        }
    }
</script>


<style lang="scss">
  @import "../assets/scss/var.scss";

  @media screen and (min-width: $size) {
    @import "../assets/scss/default.scss";
    @import "../assets/scss/right.scss";


  }

  @media screen and (max-width: $size) {
    @import "../assets/scss/default-mobile.scss";
    @import "../assets/scss/right-mobile.scss";

  }
</style>
