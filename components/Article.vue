<template>
  <div class="article">
    <div   :class="[!$store.state.night?'type':'n-type']">
      <span>{{type}}</span>
      <div class="divider">
        <el-divider></el-divider>
      </div>
    </div>
<!--    {{articles}}-->
    <div class="article-list" v-for="item in articles" :key="item.id">

          <nuxt-link :to="{name:'detail',params:{article:item,len:item.comments.length}}" class="one">
            <el-card shadow="hover" :body-style="{ padding: '0px' }"
                     :class="[!$store.state.night?'card':'n-card']">

            <div class="article-item">
              <div  :class="[!$store.state.night?'left':'n-left']">
               <div class="day">
                 <img :src="a2" class="img1"/>
                 <img :src="bg2" class="img2" alt="">
               </div>
                <div class="night">
                  <img :src="bg2" class="img1"/>
                  <img :src="a2" class="img2" alt="">
<!--                                    <img :src="a" class="img1"/>-->
<!--                                    <img :src="a2" class="img2" alt="">-->


                </div>
              </div>
              <div class="right">
                <div class="title">
                  {{item.aTitle}}
                </div>
                <div class="content">
                  {{item.aContent}}
                </div>

                <el-row class="messages" :class="$store.state.night?'b-icon':'w-icon'">
                    <el-col class="item" :span="4">
                      <div class="icon bimg"><img src="../assets/imgs/user.png" class="one"></div>
                      <div class="icon wimg"><img src="../assets/imgs/user2.png"></div>

                      <div class="word">{{item.userName}}</div>
                    </el-col>
                    <el-col class="item" :span="10">
                      <div class="icon bimg"><img src="../assets/imgs/time.png"></div>
                      <div class="icon wimg"><img src="../assets/imgs/time2.png"></div>

                      <div class="word">{{item.time}}</div>
                    </el-col>

                    <el-col class="item" :span="3">
                      <div class="icon bimg" style="margin-top: 2px"><img src="../assets/imgs/love.png"></div>
                      <div class="icon wimg" style="margin-top: 2px"><img src="../assets/imgs/love2.png"></div>
                      <div class="word">({{item.love}})</div>
                    </el-col>
                    <el-col class="item" :span="3">
                      <div class="icon bimg"  style="margin-top: 2px"><img src="../assets/imgs/eye.png"></div>
                      <div class="icon wimg"  style="margin-top: 2px"><img src="../assets/imgs/eye2.png"></div>
                      <div class="word">({{item.aScan}})</div>
                    </el-col>
                    <el-col class="item" :span="3">
                      <div class="icon bimg"  style="margin-top: 3px"><img src="../assets/imgs/comment.png"></div>
                      <div class="icon wimg"  style="margin-top: 3px"><img src="../assets/imgs/comment2.png"></div>
                      <div class="word">({{item.aComment}})</div>
                    </el-col>

                </el-row>
              </div>
            </div>
            </el-card>

          </nuxt-link>

      <div>

      </div>
    </div>
  </div>
</template>

<script>
  import img from '../assets/imgs/c4.jpg'
  import a from '../assets/imgs/a.jpg'
  import a2 from '../assets/imgs/a2.jpg'
  import bg2 from '../assets/imgs/bg2.jpg'
  import c2 from '../assets/imgs/c2.jpg'
  export default {
        props: {
            type: String,
            articles:''
        },
        data() {
            return {
                img:img,
                a:a,
                a2:a2,
              bg2,
              c2

            }
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped="scoped">
  @import "../assets/scss/var.scss";

  @media screen and (min-width: $size) {
    @import "../assets/scss/article.scss";
  }

  @media screen and (max-width: $size) {
    @import "../assets/scss/article-mobile.scss";
  }
</style>
