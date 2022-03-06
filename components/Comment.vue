<template>
  <div>
    <el-card :class="[!$store.state.night?'card':'n-card']">
      <div class="comment">
        <!--      用户头像、用户信息、登录注册入口-->
        <div class="header">
          <div class="user-msg" @click="getMyInfo">
            <img v-show="have" :src="imageUrl" class="avatar">
            <img v-show="!have"
                 :src="logo"
                 class="avatar">
          </div>

        </div>
        <!-- 手机端的用户头像、用户信息、登录注册入口-->
        <div class="mobile">
          <div class="user-msg" @click="checkLogin">
            <img v-show="have" :src="imageUrl" class="avatar">
            <img v-show="!have"
                 src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571225705217&di=d1e1a7dd3ee5e530dcb593486d15e468&imgtype=0&src=http%3A%2F%2Fwww.t-chs.com%2FtuhsJDEwLmFsaWNkbi5jb20vaTEvMTc3ODU4NDQzMC9PMUNOMDFNQUUxTloxaWF6M0VaUHMzdl8hITE3Nzg1ODQ0MzAkOQ.jpg"
                 class="avatar">
          </div>


          <!--      手机端底部弹框-->
          <van-action-sheet
            v-model="show"
            :actions="actions"
            @select="onSelect"
            cancel-text="取消"
          />
          <!--手机端登录弹框-->
          <van-popup v-model="isLogin"
                     :style="{ height: '25%',width:'90%' }">
            <!--        登录组件-->
            <Login @reset="reset" @killIcon="rmIcon" @icon="getUserIcon" @update="update"></Login>
          </van-popup>
          <!--      手机端修改密码-->
          <van-popup v-model="isUpdate"
                     :style="{ height: '25%',width:'90%' }">
            <!--        登录组件-->
            <NewPass @hiddenSon="hiddenSon" @changeStatus="changeStatus"></NewPass>
          </van-popup>
          <!--手机端登录用户的信息-->
          <van-popup
            v-model="showInfo"
            position="bottom"
          >
            <!--     手机端登录用户信息-->
            <UserInfo :user="user" @noActive="noActive" @reloadArt="reloadArt"></UserInfo>
          </van-popup>

          <!--      手机端注册弹框-->
          <van-popup v-model="isRegister"
                     :style="{ height: '300px',width:'90%' }">
            <!--        登录组件-->
            <Register @reset="reset" @changeStatus="changeStatus"></Register>
          </van-popup>
        </div>

        <!--登录侧方弹框-->
        <el-drawer @closed="clear"
                   size="26%"
                   :title="title"
                   :visible.sync="drawer"
                   :direction="direction">
          <Login :class="[isVisible?look:'']" @func="getMsgFormSon" @reset="drawer =false" @goRegister="goRegister"
                 :love="love" :name="myinfo.name" :phone="myinfo.phone" :pass="myinfo.pass"
                 :imageUrl="myinfo.userIcon" @icon="getUserIcon" @killIcon="rmIcon" ref="login"
                 :data="data" @reloadArt="reloadArt" @noActive="noActive" @update="drawer3=true"
                 style="padding-right: 40px"></Login>

          <el-drawer @closed="clearRegister"
                     size="26%"
                     :direction="direction"
                     title="注册"
                     :append-to-body="true"
                     :before-close="handleClose"
                     :visible.sync="drawer2">
            <Register @func="getMsgFormSon" @reset="drawer2 =false" ref="register"
                      @goLogin="goLogin"
                      :defaultIcon="userIcon" style="padding-right: 40px"></Register>
          </el-drawer>
          <el-drawer @closed="clearPass"
                     size="26%"
                     title="修改密码"
                     :visible.sync="drawer3"
                     :direction="direction">
            <NewPass @reset="drawer3=false" ref="newPass" @loginInfo="loginInfo"
                     style="padding-right: 40px"></NewPass>
          </el-drawer>

        </el-drawer>


        <!--      评论或留言输入框-->
        <div class="comment-content">
        <textarea ref="com" :class="[this.$store.state.night?night:'']" placeholder="既然来了,就说几句吧" v-model="textarea"
                  :maxlength="maxLength"></textarea>

          <div class="len">您还可以输入{{len}}个字</div>
        </div>
        <!--      评论或留言提交按钮-->
        <div class="comment-commit">
          <!--        <div class="say">畅所欲言</div>-->
          <el-button class="say" type="danger" @click="subMsg" v-show="aId===undefined">畅所欲言</el-button>
          <el-button class="say" type="danger" @click="subCom" v-show="aId!==undefined">畅所欲言</el-button>

        </div>
      </div>
      <!--    评论或留言-->
      <div class="comment-bar">
        <div class="bar-left">{{msg.kind}}</div>
        <div class="bar-right">
          <!--        评论或留言数量-->
          <span class="count">{{num}}</span>
          <span class="tiao">条{{msg.kind}}</span>
        </div>
      </div>
      <!--    所有评论-->
      <div class="comment-list" :style="{'color':$store.state.night?'white':''}">
        <div class="tip"></div>
        <!--      每一个评论-->
        <div class="comment-item" v-for="(item,index) in comments" :key="index">
          <div class="divider" :style="{'display':index===0?'none':''}">
            <el-divider></el-divider>
          </div>
          <div class="main">
            <!--        评论者头像-->
            <div class="item-left">
              <img :src="item.userIcon"/>
            </div>
            <div class="item-right">
              <div class="right-top">
                <!--            评论者名字-->
                <div class="user-name">{{item.userName}}</div>
                <!--            评论时间-->
              </div>
              <!--          评论内容-->
              <div class="right-content">{{item.content}}</div>
              <div class="right-bottom">
                <div class="time">{{item.time}}</div>

                <!--            回复或删除评论按钮-->
                <div class="reply">
                  <div class="del" v-show="item.aId!==undefined&myinfo.userId===item.uId">
                    <span @click="del(3,item.cId)">删除</span>
                  </div>
                  <div class="del" v-show="item.mId!==undefined&item.uId===myinfo.userId">
                    <span @click="del(1,item.mId)">删除</span>
                  </div>
                  <!--              评论一级回复-->
                  <div v-show="item.aId!==undefined&item.uId!==myinfo.userId" class="ry">
                    <span @click="reply2(item.cId)">
                       <img v-show="$store.state.night" src="../assets/imgs/reply2.png"
                            alt="" style="width: 30px">
                         <img v-show="!$store.state.night" src="../assets/imgs/reply.png"
                              alt="" style="width: 30px">
                    </span>
                  </div>
                  <!--              留言一级回复-->
                  <div v-show="item.mId!==undefined&item.uId!==myinfo.userId" class="ry">
                    <span @click="reply2(item.mId)">
                       <img v-show="$store.state.night" src="../assets/imgs/reply2.png"
                            alt="" style="width: 30px">
                         <img v-show="!$store.state.night" src="../assets/imgs/reply.png"
                              alt="" style="width: 30px">
                    </span>
                  </div>

                </div>
              </div>
              <!--          评论框-->
              <div v-show="item.mId===one||item.cId===one" class="msg-reply-input">
                <div class="reply-textarea">
                <textarea class="textarea"
                  placeholder="发表你的看法" v-model="replyTextarea"
                  :maxlength="maxLength"></textarea>
                </div>
                <div class="reply-input">
                  <el-button @click="one=''">取消</el-button>
                  <div class="btn">
                    <el-button v-show="item.aId!==undefined"
                               @click="subReply(item.cId,item.uId,replyTextarea)" type="danger">回复
                    </el-button>
                  </div>

                  <div class="btn">
                    <el-button v-show="item.mId!==undefined"
                               type="danger" @click="subMsgReply(item.mId,item.uId,replyTextarea)">回复
                    </el-button>
                  </div>

                </div>

              </div>

              <div v-for="(re,index2) in item.replyList" :key="index2" class="children">
                <div class="child-left">
                  <img :src="re.userIcon" alt="">
                </div>
                <div :class="[$store.state.night?'n-child':'child-right']">
                  <div class="child-detail">
                    <span class="name">{{re.userName}}</span>
                    <span class="black" style="">回复</span>
                    <span class="name">{{re.replyUserName}}</span>
                    <span class="black">：</span>
                    <span class="r-content black">{{re.content}}</span>
                  </div>
                  <div class="child-reply">
                    <div class="child-time black">{{timeFn(re.time)}}</div>
                    <!--            回复或删除评论-->
                    <div class="child-btn">
                      <!--  评语子删除-->
                      <div v-show="item.aId!==undefined&myinfo.userId===re.userId" class="child-del">
                        <span @click="del(4,re.id)" class="black">删除</span>
                      </div>
                      <!-- 留言子删除-->
                      <div v-show="item.aId===undefined&myinfo.userId===re.userId" class="child-del">
                        <span @click="del(2,re.id)" class="black">删除</span>
                      </div>
                      <!--   文章评论子回复 -->
                      <div v-show="item.aId!==undefined&myinfo.userId!==re.userId" class="child-ry">
                        <span @click="reply(re.id)" class="black">
                          <img v-show="$store.state.night" src="../assets/imgs/reply2.png"
                           alt="" style="width: 30px">
                         <img v-show="!$store.state.night" src="../assets/imgs/reply.png"
                              alt="" style="width: 30px">
                        </span>
                      </div>
                      <!--                  留言子回复-->
                      <div v-show="item.mId!==undefined&re.userId!==myinfo.userId" class="child-ry">
                        <span @click="reply(re.id)" class="black">
                        <img v-show="$store.state.night" src="../assets/imgs/reply2.png"
                             alt="" style="width: 30px">
                         <img v-show="!$store.state.night" src="../assets/imgs/reply.png"
                              alt="" style="width: 30px">
                        </span>
                      </div>

                    </div>
                  </div>
                  <div v-show="re.id===id" class="msg-reply-input">
                    <div class="reply-textarea">
                <textarea class="textarea" :style="{'color':$store.state.night?'white':''}"
                  placeholder="发表你的看法" v-model="replyTextarea"
                  :maxlength="maxLength" style="width: 600px"></textarea>
                    </div>
                    <div class="reply-input">
                      <div class="btn">
                        <el-button @click="id=''">取消</el-button>
                      </div>
                      <div class="btn">
                        <el-button v-show="item.aId!==undefined"
                                   @click="subReply(item.cId,re.userId,replyTextarea)" type="danger">回复
                        </el-button>
                      </div>

                      <div class="btn">
                        <el-button v-show="item.mId!==undefined"
                                   type="danger" @click="subMsgReply(item.mId,re.userId,replyTextarea)">回复
                        </el-button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>


        </div>

      </div>
    </el-card>
  </div>

</template>

<script>
    import ax from 'axios';
    import Register from '~/components/Register.vue'
    import Login from '~/components/Login.vue'
    import NewPass from '~/components/NewPass.vue'
    import UserInfo from '~/components/UserInfo.vue'
    import {arraylist, f} from '../assets/js/checks.js'
    import logo from '../assets/imgs/login.png'
    export default {
        props: {
            comments: Array,
            msg: Object,
            num: '',
            aId: '',
        },
        data() {

            return {
                logo: logo,
                domain: 'panbingwen',
                // domain: 'qinbinbin',
                title: '登录',
                drawer: false,
                drawer2: false,
                drawer3: false,
                direction: 'ltr',
                d2: '',
                replyTextarea: '',
                one: '',
                id: '',
                showInfo: false,
                user: {},
                innerVisible: false,
                isNewPass: false,
                data: '',
                have: true,
                myinfo: {
                    name: '',
                    phone: '',
                    pass: '',
                    userIcon: '',
                    userId: ''
                },
                dialogFormVisible: false,
                isVisible: false,
                active: 'active',
                defaultClass: 'defaultClass',
                look: 'look',
                formLabelWidth: '120px',
                imageUrl: '',
                userIcon: '',
                textarea: '',
                maxLength: 150,
                len: 150,
                show: false,
                isLogin: false,
                isUpdate: false,
                isRegister: false,
                night: 'night',
                love: false,
                actions: [
                    {name: '登录'},
                    {name: '注册'}
                ]
            }
        },
        watch: {
            textarea() {
                this.len = this.maxLength - this.textarea.length
            }
        },
        components: {
            UserInfo,
            Register,
            Login,
            NewPass
        },
        methods: {
            loginInfo(val) {
                this.$refs.login.inputInfo(val)
            },
            handleClose(done) {
                done();
            },
            clear() {
                this.$refs.login.resetForm('ruleForm2')
            },
            clearRegister() {
                this.$refs.register.resetForm('ruleForm')
            },
            clearPass() {
                this.$refs.newPass.resetForm('ruleForm')
            },
            goLogin() {
                this.drawer = false
                let that = this
                this.title = "登录"
                setTimeout(function () {
                    that.drawer = true
                    that.isVisible = false
                }, 400);
            },
            goRegister() {
                this.drawer2 = true
                let number = Math.floor(Math.random()*5);
                this.userIcon=this.$store.state.icons[number].iUrl
            },
            removeComChild(id) {
                var _that = this
                ax({
                    method: 'get',
                    url: 'http://localhost:8888/comment/delReply?id=' + id

                }).then(function (res) {
                    if (res.data.code === 0) {
                        // _that.open2(res.data.msg,'success')
                        let art = JSON.parse(localStorage.getItem('data'))
                        // art.comments.replyList.push(res.data.data)
                        // art.comments.unshift(res.data.data)
                        art.comments.forEach(function (value, index, arr) {
                            value.replyList.forEach(function (val, idx) {
                                if (val.id === id) {
                                    value.replyList.splice(idx, 1)
                                }

                            })
                        })
                        localStorage.setItem('data', JSON.stringify(art))
                        _that.refresh()

                    } else {
                        // _that.open2(res.data.msg,'warning')
                    }
                }).catch((res) => {
                    // _that.open2(res.data.msg,'error')

                })
            },
            removeMsgChild(id) {
                let _that = this
                ax({
                    method: 'get',
                    url: 'http://localhost:8888/message/delMsgReply?id=' + id

                }).then(function (res) {
                    if (res.data.code === 0) {
                        _that.open2(res.data.msg, 'success')
                        _that.refresh()
                        // _that.delLocal(id)
                    } else {
                        _that.open2(res.data.msg, 'warning')
                    }
                }).catch((res) => {
                    _that.open2(res.data.msg, 'error')

                })
            },
            timeFn(d1) { //di作为一个变量传进来
                //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
                var dateBegin = new Date(d1.replace(/-/g, "/")); //将-转化为/，使用new Date
                var dateEnd = new Date(); //获取当前时间
                var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
                var m = Math.floor(dateDiff / (24 * 3600 * 1000 * 30))//计算出相差月数
                if (m > 0) {
                    return m + '月前'
                }
                var dayDiff = dateDiff % (24 * 3600 * 1000 * 30); //计算出相差天数
                var d = Math.floor(dayDiff / (24 * 3600 * 1000))
                if (d > 0) {
                    return d + '天前'
                }
                var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
                let hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
                if (m === 0 && d === 0 && hours !== 0) {
                    return hours + '小时前'
                }
                //计算相差分钟数
                var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
                var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
                if (m === 0 && d === 0 && hours === 0 && minutes !== 0) {
                    return minutes + '分钟前'
                }
                if (m === 0 && d === 0 && hours === 0 && minutes === 0) {
                    return '刚刚'
                }

                //计算相差秒数
                var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
                var seconds = Math.round(leave3 / 1000)
                if (m === 0 && d === 0 && hours === 0 && minutes === 0 && seconds !== 0) {
                    return '刚刚'
                }
            },

            subMsgReply(pId, rId, content) {
                let user = JSON.parse(localStorage.getItem('myinfo'));
                if (user == null) {
                    this.open2("请先登录", "warning");
                    this.drawer=true
                    return;
                } else if (content === '' || content.trim().length == 0) {
                    this.open2("请输入回复内容", "warning");
                } else {
                    if (user.isForbid == 1) {
                        this.open2("账号异常",'warning')
                        return;
                    }
                    let _that = this;
                    ax({
                        method: 'post',
                        url: 'http://localhost:8888/message/addMsgReply',
                        params: {
                            pid: pId,
                            uId: user.userId,
                            replyUserId: rId,
                            content: content
                        }
                    }).then(function (res) {
                        if (res.data.code === 0) {
                            _that.open2(res.data.msg,'success')
                            _that.replyTextarea = ''
                            _that.refresh()
                        } else {
                            _that.open2(res.data.msg, 'warning')
                        }
                    }).catch((res) => {
                        _that.open2(res.data.msg, 'error')
                    })
                }
            },
            subReply(cId, rId, content) {
                let user = JSON.parse(localStorage.getItem('myinfo'));
                if (user == null) {
                    this.open2("请先登录", 'warning');
                    this.drawer=true
                    return;
                } else if (content === '' || content.trim().length == 0) {
                    this.open2("请输入回复内容", 'warning');
                } else {
                    if (user.isForbid == 1) {
                        this.open2("账号异常",'warning')
                        return;
                    }
                    let _that = this;
                    ax({
                        method: 'post',
                        url: 'http://localhost:8888/comment/addReply',

                        params: {
                            cId: cId,
                            uId: user.userId,
                            replyUserId: rId,
                            content: content
                        }
                    }).then(function (res) {
                        if (res.data.code === 0) {
                            _that.open2(res.data.msg, 'success')
                            _that.replyTextarea = ''
                            let art = JSON.parse(localStorage.getItem('data'))
                            // art.comments.replyList.push(res.data.data)
                            // art.comments.unshift(res.data.data)

                            art.comments.forEach(function (value, index, arr) {
                                if (value.cId === res.data.data.cId) {
                                    value.replyList.push(res.data.data);
                                }
                            })
                            localStorage.setItem('data', JSON.stringify(art))
                            _that.refresh()
                        } else {
                            _that.open2(res.data.msg, 'warning')
                        }
                    }).catch((res) => {
                        _that.open2(res.data.msg, 'error')
                    })

                }
            },
            update() {
                this.isLogin = false
                this.isUpdate = true
                this.isNewPass = true
                this.drawer = false
                let that = this
                setTimeout(function () {
                    that.drawer2 = true
                }, 500)

            },
            changeStatus() {
                this.isLogin = true,
                    this.isRegister = false
                this.isUpdate = false
            },
            checkLogin() {
                let user = JSON.parse(localStorage.getItem('myinfo'));
                if (user === null) {
                    return this.show = true;
                }
                this.user = user
                this.showInfo = true
            },
            hiddenSon(data) {
                this.innerVisible = data
                this.isUpdate = false
                this.isNewPass = false
                this.drawer2 = false
            },
            reloadArt(data) {
                this.$emit('reloadDetail', data);
            },
            noActive(data) {
                this.$emit('noActive', data)
                this.showInfo = data
                this.have = false
            },
            te() {
                this.$emit('reloadCom');
            },
            delLocal(id) {
                var art = JSON.parse(localStorage.getItem('data'))
                art.comments.forEach((item, index) => {
                    if (item.cId === id) {
                        art.comments.splice(index, 1)
                        localStorage.setItem('data', JSON.stringify(art))
                        this.$emit('updateNum', art.comments.length)
                    }
                })
            },

            removeCom(id) {
                var _that = this
                ax({
                    method: 'get',
                    url: 'http://localhost:8888/comment/removeCom?id=' + id

                }).then(function (res) {
                    if (res.data.code === 0) {
                        _that.refresh()
                        _that.open2(res.data.msg, 'success')
                        _that.delLocal(id)
                    } else {
                        _that.open2(res.data.msg, 'warning')
                    }
                }).catch((res) => {
                    _that.open2(res.data.msg, 'error')

                })
            },
            subCom() {
                var _that = this
                var user = JSON.parse(localStorage.getItem('myinfo'));
                if (user === null) {
                    _that.open2('请先登录', 'warning')
                    _that.drawer = true
                    return false;
                } else if (this.textarea.trim().length == 0 || this.textarea === '') {
                    _that.open2('内容不能为空', 'warning')
                } else {
                    if (user.isForbid == 1) {
                        this.open2("账号异常",'warning')
                        return;
                    }
                    let content = this.Trim(this.textarea, 'g')
                    let arr = arraylist()
                    for (let i = 0; i < arr.length; i++) {
                        content = content.replace(new RegExp(arr[i], 'ig'), new Array(arr[i].length).join('*'));
                    }
                    ax({

                        url: 'https://localhost:8888/comment/addCom',

                        method: 'POST',
                        params: {
                            content: content,
                            uId: user.userId,
                            aId: this.aId
                        },
                        header: {
                            'content-type': 'application/json'
                        }
                    }).then(function (res) {
                        if (res.data.code === 0) {
                            _that.textarea = ''
                            _that.open2(res.data.msg, 'success')
                            var art = JSON.parse(localStorage.getItem('data'))
                            //  art.comments.push(res.data.data)
                            art.comments.unshift(res.data.data)
                            localStorage.setItem('data', JSON.stringify(art))
                            _that.$emit('updateNum', art.comments.length)
                            _that.refresh()

                        } else {
                            _that.open2(res.data.msg, 'warning')
                        }
                    }).catch((res) => {
                        _that.open2(res.data.msg, 'error')
                    });
                }

            },
            reply(id) {
                this.id = id
                this.one = ''
                this.replyTextarea = ''
            },
            reply2(one) {
                this.one = one
                this.id = ''
                this.replyTextarea = ''
            },
            del(code,id) {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    switch (code) {
                        case 1:
                            this.removeMsg(id)
                            break;
                        case 2:
                            this.removeMsgChild(id)
                            break;
                        case 3:
                            this.removeCom(id)
                            break;
                        case 4:
                            this.removeComChild(id)
                            break;
                    }
                }).catch(() => {

                });

            },
            removeMsg(id) {
                var _that = this
                ax({
                    method: 'get',
                    url: 'http://localhost:8888/message/removeMsg?id=' + id
                }).then(function (res) {
                    if (res.data.code === 0) {
                        _that.refresh()
                        _that.open2(res.data.msg, 'success')
                    } else {
                        _that.open2(res.data.msg, 'warning')
                    }
                })
            },
            close() {
                this.$refs.login.resetForm('ruleForm2');
                this.$refs.register.resetForm('ruleForm');

            },
            onSelect(item) {
                this.show = false;
                if (item.name === '登录') {
                    this.isLogin = true;
                } else if (item.name === '注册') {
                    this.isRegister = true
                }
            },

            getMsgFormSon(val) {
                this.isVisible = false
                this.drawer2 = false
                this.$refs.register.resetForm('ruleForm')
                this.$refs.login.inputInfo(val)
            },
            reset() {
                this.isLogin = false
                this.isRegister = false
            },
            getMyInfo() {
                var myinfo = JSON.parse(localStorage.getItem('myinfo'))
                if (myinfo === null) {
                    this.love = false;
                    this.drawer = true
                    // this.dialogFormVisible = true;
                } else {
                    this.myinfo.name = myinfo.userName
                    this.myinfo.phone = myinfo.phoneNumber
                    this.myinfo.pass = myinfo.userPass
                    this.myinfo.userIcon = myinfo.userIcon
                    this.love = true;
                    this.isVisible = false
                    this.drawer = true
                    this.title = ''
                    // this.dialogFormVisible = true;
                }
            },
            getUserIcon(data) {
                this.imageUrl = data
                this.have = true
            },
            rmIcon() {
                this.have = false;
            },
            open2(msg, type) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type,
                    // offset: 300,
                    duration: 2000
                });
            },

            refresh() {
                this.$router.replace({
                    path: '/refresh',
                    query: {
                        t: Date.now()
                    }
                })
            },
            Trim(str, is_global) {
                var result;
                result = str.replace(/(^\s+)|(\s+$)/g, "");
                if (is_global.toLowerCase() == "g") {
                    result = result.replace(/\s/g, "");
                }
                return result;
            },


            subMsg() {
                var _that = this
                var user = JSON.parse(localStorage.getItem('myinfo'));
                if (user === null) {
                    _that.open2('请先登录', 'warning')
                    _that.drawer = true
                    return false;
                } else if (this.textarea.trim().length == 0 || this.textarea === '') {
                    _that.open2('内容不能为空', 'warning')
                } else {
                    if (user.isForbid == 1) {
                        this.open2("账号异常",'warning')
                        return;
                    }
                    let content = this.Trim(this.textarea, 'g')
                    let arr = arraylist()
                    for (let i = 0; i < arr.length; i++) {
                        content = content.replace(new RegExp(arr[i], 'ig'), new Array(arr[i].length).join('*'));
                    }
                    ax({

                        url: 'http://127.0.0.1:8888/message/insertMessage',
                        method: 'POST',
                        params: {
                            content: content,
                            userId: user.userId
                        },
                        header: {
                            'content-type': 'application/json'
                        }
                    }).then(function (res) {
                        if (res.data.code === 0) {
                            _that.textarea = ''
                            _that.open2(res.data.msg, 'success')
                            _that.refresh()
                        } else {
                            _that.textarea = ''
                            _that.open2(res.data.msg, 'warning')
                        }
                    }).catch((res) => {
                        _that.open2(res.data.msg, 'error')
                    });
                }
            }
            ,
            loadmyinfo() {
                var myinfo = JSON.parse(localStorage.getItem('myinfo'))
                if (myinfo === null) {
                    this.have = false;
                } else {
                    this.imageUrl = myinfo.userIcon;
                    this.myinfo.userId = myinfo.userId
                    this.have = true
                }
            }

        },
        mounted() {
            this.loadmyinfo()
        }
        ,
        filters: {
            sensitiveFilter(value) {
                return value + '这是过滤器'
            }
        }
    }
</script>

<style lang="scss" scoped>
  @import "../assets/scss/var.scss";

  @media screen and (min-width: $size) {
    @import "../assets/scss/comment.scss";
  }

  @media screen and (max-width: $size) {
    @import "../assets/scss/comment-mobile.scss";
  }
</style>
