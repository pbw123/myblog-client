<template>
  <div class="container">
    <div class="left">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right"
                       :class="[!$store.state.night?'breadcrumb':'n-breadcrumb']">
          <el-breadcrumb-item :to="{ path: '/' }"><span class="index">首页</span></el-breadcrumb-item>
          <el-breadcrumb-item><span class="item">文章详情</span></el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
      </div>
      <div class="article-detail">
        <el-card :class="[!$store.state.night?'card':'n-card']">
          <div class="title">{{article.aTitle}}</div>
          <div class="msg">
            <div class="author author2">
              <div class="icon"><img src="../assets/imgs/user.png" alt=""></div>
              <!--              <div v-show="this.$store.state.night" class="icon"><img src="../assets/imgs/user2.png" alt=""></div>-->
              <div class="name">
                {{article.userName}}
              </div>
            </div>
            <div class="author">
              <div class="icon"><img src="../assets/imgs/rl2.png" alt=""></div>
              <!--              <div v-show="this.$store.state.night" class="icon"><img src="../assets/imgs/rl.png" alt=""></div>-->
              <div class="word">{{article.time}}</div>
            </div>
          </div>
          <div class="content">
            <no-ssr>
              <mavon-editor
                class="md"
                :value="article.aContent"
                :subfield="prop.subfield"
                :defaultOpen="prop.defaultOpen"
                :toolbarsFlag="prop.toolbarsFlag"
                :editable="prop.editable"
                :scrollStyle="prop.scrollStyle"
                :ishljs="prop.ishljs"
                :boxShadow="prop.boxShadow"
              ></mavon-editor>
            </no-ssr>
          </div>


          <div class="money">

            <div class="praise info" style="cursor: pointer">
              <div class="icon">
                <img v-show="!isActive" src="../assets/imgs/love.png" alt="" @click="good()">
                <img v-show="isActive" src="../assets/imgs/love3.png" alt=""
                     @click="good()">
                <!--                <img v-show="this.$store.state.night&!isActive" src="../assets/imgs/love2.png" alt="" @click="good()">-->
              </div>
              <div class="word" @click="good()">
                点赞({{$store.state.counter}}）
              </div>
            </div>

            <div class="reward">

              <el-popover placement="top" width="320" trigger="click">
                <div class="model">
                  <div class="btn" style="display: flex;justify-content: center;">
                    <div style="line-height: 50px;text-align: center;" id="btn1" @click="btn1"
                         :class="[ btn1Active ? active : defaultClass]">
                      微信
                    </div>
                    <div style="line-height: 50px;text-align: center;" id="btn2" @click="btn2"
                         :class="[ btn2Active ? active : defaultClass]">
                      支付宝
                    </div>
                  </div>

                  <div id="div1">
                    <div v-show="show">
                      <img :src="wx" style="width: 300px;"/>
                    </div>
                    <div v-show="!show">
                      <img :src="zfb" style="width: 300px;"/>
                    </div>
                  </div>

                </div>
                <el-button slot="reference" type="danger" round class="word" size="medium">打赏</el-button>
              </el-popover>

            </div>

            <div class="scan info">
              <div class="icon" style="padding-top: 3px;">
                <!--                <img v-show="this.$store.state.night" src="../assets/imgs/eye2.png" alt="">-->
                <img src="../assets/imgs/eye.png" alt="">
              </div>
              <div class="word">
                浏览({{$store.state.scan}}）
              </div>
            </div>
          </div>
        </el-card>

        <div class="com">
          <Comment :comments="article.comments" :msg="msg" :num="len" ref="com"
                   :aId="aId" @updateNum="updateNum" @reloadDetail="reloadDetail" @noActive="noActive"></Comment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Comment from '~/components/Comment.vue'
    import axios from 'axios';
    import zfb from '../assets/imgs/zfb.jpg'
    import wx from '../assets/imgs/wx.jpg'

    export default {
        name: 'detail',
        head(){
            return {
                title:'文章详情'
            }
        },
        computed: {
            prop() {
                let data = {
                    subfield: false,// 单双栏模式
                    defaultOpen: 'preview',//edit： 默认展示编辑区域 ， preview： 默认展示预览区域
                    editable: false,
                    toolbarsFlag: false,
                    scrollStyle: true,
                    ishljs: false,
                    boxShadow: false
                }
                return data
            }
        },
        data() {
            return {
                domain: 'panbingwen',
                // domain: 'qinbinbin',
                zfb: zfb,
                wx: wx,
                len: '',
                aId: '',
                show: true,
                isOne: 1,
                article: {},
                isActive: false,
                msg: {
                    kind: '评论'
                },
                btn1Active: true,
                btn2Active: false,
                defaultClass: 'defaultClass',
                active: 'active',
                coms: '',
                info: {},
                count: ''
            }
        },
        components: {
            Comment
        },
        mounted() {
            this.setArticleData();
        },
        watch: {
            count() {
                this.count = this.article.love
            }
        },
        methods: {
            noActive(data) {
                this.isActive = data
            },
            reloadDetail(data) {
                let art = JSON.parse(localStorage.getItem('data'));
                // console.log(data+"-------")
                let _that=this
                axios({
                    method: 'get',
                    url: 'http://localhost:8888/article/isLike',
                    params: {
                        aId: art.aId,
                        uId: data
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        _that.isActive = res.data.data
                        // console.log(res.data.data+"++++++++-------")
                    } else {
                        // console.log("+++++fail")
                    }
                })

            },

            updateNum(data) {
                localStorage.setItem('len', JSON.stringify(data))
            },
            open2(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 1500
                });
            },
            test() {
            },
            good() {
                let _that = this
                let user = JSON.parse(localStorage.getItem('myinfo'));
                if (user === null) {
                    this.$refs.com.goLogin()
                    this.open2("请先登录", 'warning');
                    return;
                } else {
                    // _that.$route.params.article.aId
                    // var is = this.$route.params.article === undefined
                    let art = JSON.parse(localStorage.getItem('data'))
                    let user = JSON.parse(localStorage.getItem('myinfo'))
                    let aid = art.aId
                    axios({
                        method: 'get',
                        url: 'http://localhost:8888/article/checkArticleLike',
                        params: {
                            articleId: aid,
                            userId: user.userId
                        }
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.isActive = res.data.data.like;
                            let art = JSON.parse(localStorage.getItem('data'));
                            art.love = res.data.data.count
                            localStorage.setItem('data', JSON.stringify(art))
                            _that.$store.state.counter = res.data.data.count
                        }
                    })


                }
            },
            btn1() {
                this.btn1Active = true
                this.btn2Active = false
                this.show = !this.show
            },
            btn2() {
                this.btn2Active = true
                this.btn1Active = false
                this.show = !this.show
            },
            likeOrNo(id) {
                var _that = this
                var user = JSON.parse(localStorage.getItem('myinfo'))
                if (user !== null) {
                    axios({
                        url: 'http://localhost:8888/article/isLike',
                        method: 'get',
                        params: {
                            aId: id,
                            uId: user.userId
                        }
                    }).then(res => {
                        if (res.data.code === 0) {
                            _that.isActive = res.data.data;
                        } else {
                            console.log("error==========")
                        }
                    })
                }
            },
            setArticleData() {
                let _that = this
                var is = this.$route.params.article === undefined
                if (is) {
                    //路由没带所需参数
                    let d = JSON.parse(localStorage.getItem('data'))
                    this.aId = d.aId
                    this.info = JSON.parse(localStorage.getItem('info'))
                    this.article = d
                    this.len = JSON.parse(localStorage.getItem('len'))
                    this.$store.state.counter = d.love
                    this.likeOrNo(d.aId)
                    this.$store.state.scan = d.aScan
                } else {
                    //路由带来所需参数
                    var pay = JSON.parse(localStorage.getItem('info'))
                    this.info = pay
                    this.likeOrNo(this.$route.params.article.aId)
                    this.article = this.$route.params.article;
                    this.$store.state.counter = this.$route.params.article.love
                    this.len = this.$route.params.len
                    this.aId = this.$route.params.article.aId
                    localStorage.setItem('len', JSON.stringify(this.$route.params.len))
                    localStorage.setItem('data', JSON.stringify(this.$route.params.article))
                    axios({
                        url:'http://localhost:8888/article/addArticleScan?aId='+_that.$route.params.article.aId,
                        method: 'get',
                    })
                }
            },
            goHome() {
                this.$router.push({
                    name: 'index',
                    params: {}
                })
            }
        }
    }

</script>

<style lang="scss" scoped>
  @import "../assets/scss/var.scss";

  @media screen and (min-width: $size) {
    @import "../assets/scss/detail.scss";
  }

  @media screen and (max-width: $size) {
    @import "../assets/scss/detail-mobile.scss";
  }
</style>
