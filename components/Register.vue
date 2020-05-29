<template>
  <div>
    <div class="register-pc">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="">
          <el-form-item label="头像">
            <div class="user-msg">

              <el-upload class="" :action="action"
                         :show-file-list="false" :on-success="handleAvatarSuccess"
                         :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <img v-else :src="defaultIcon" class="avatar">
                <!--                <div v-else class="avatar-uploader">头像</div>-->
              </el-upload>
            </div>
          </el-form-item>

          <el-form-item label="昵称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </div>
        <div class="">
          <el-form-item label="手机号" prop="phone" class="phone-input">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="send" size="small" type="primary" @click="send(ruleForm.phone,true)" v-show="timeout">发送验证码
            </el-button>
            <el-button class="send" size="small" type="primary" disabled v-show="!timeout">{{count}}</el-button>
          </el-form-item>
          <el-form-item label="验证码" prop="verify" class="phone-input">
            <el-input v-model="ruleForm.verify" autocomplete="off"></el-input>
          </el-form-item>
        </div>

        <div class="">
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="register-mobile">
      <van-cell-group>
        <div class="user-msg">

          <el-upload class="" :action="action" :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
            <img v-else :src="myicon" class="avatar"/>
          </el-upload>
        </div>
        <van-field v-model="ruleForm.name" required label="用户名" placeholder="请输入用户名">

        </van-field>
        <van-field v-model="ruleForm.phone" required label="手机号" placeholder="请输入手机号">
          <van-button slot="button" size="small" @click="send(ruleForm.phone)" type="info" v-show="timeout">发送验证码
          </van-button>
          <van-button slot="button" size="small" disabled type="info" v-show="!timeout">{{count}}</van-button>

        </van-field>
        <van-field v-model="ruleForm.verify" required label="验证码" placeholder="请输入验证码">

        </van-field>
        <van-field v-model="ruleForm.pass" type="password" label="密码" placeholder="请输入密码" required
                   right-icon="question-o"
                   @click-right-icon="$toast('密码长度为6~10位')"/>

        <div class="btn">
          <van-button type="info" class="confirm" @click="register">注册</van-button>
          <van-button type="default" class="cancel" @click="cancel">取消</van-button>
        </div>

      </van-cell-group>
    </div>
  </div>
</template>

<script>
    import axios from 'axios';
    import {Toast} from 'vant';
    import {arraylist, f} from '../assets/js/checks.js'

    export default {
        props: {
            defaultIcon: ''
        },

        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (value.trim().length == 0) {
                    callback(new Error('请正确输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };

            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var validatePhone = (rule, value, callback) => {
                var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (value === '') {
                    callback(new Error('请输入手机号码'));
                } else if (!reg.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                } else {
                    callback();
                }
            };
            return {
                domain: 'localhost:8888',
                action: 'https://' + this.domain + '/image/userImage',
                myicon: '',
                timeout: true,
                count: '',
                timer: null,
                ruleForm: {
                    pass: '',
                    checkPass: '',
                    name: '',
                    phone: '',
                    verify: ''
                },
                imageUrl: '',
                rules: {
                    pass: [{
                        required: true,
                        validator: validatePass,
                        trigger: 'blur'
                    }],
                    checkPass: [{
                        validator: validatePass2,
                        trigger: 'blur'
                    }],
                    name: [{
                        required: true,
                        message: '请输入昵称',
                        trigger: 'blur'
                    },
                        {
                            required: true,
                            pattern: /^(?!.{11}|^\s*$)/g,
                            message: '请正确输入昵称',
                            trigger: 'blur'
                        }
                    ],
                    phone: [{
                        required: true,
                        validator: validatePhone,
                        trigger: 'blur'
                    },
                    ],
                    verify: [{
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }]

                }
            };

        },
        mounted() {
            this.img()
        },
        methods: {

            img() {
                let _that = this
                axios({
                    method: 'get',
                    url: 'http://localhost:8888/user/defaultIcon'
                }).then(function (res) {
                    if (res.data.code === 0) {
                        _that.myicon = res.data.data.iUrl
                    }
                }).catch((res) => {
                })
            },
            getCode() {
                const TIME_COUNT = 60;
                if (!this.timer) {
                    this.count = TIME_COUNT;
                    this.timeout = false;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--;
                        } else {
                            this.timeout = true;
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                    }, 1000)
                }
            },
            toast(code, msg) {
                switch (code) {
                    case 0:
                        Toast.success({
                            duration: 2000,       // 持续展示 toast
                            message: msg
                        });
                        break;
                    case 13:
                        Toast.fail({
                            duration: 2000,       // 持续展示 toast
                            message: msg
                        });
                        break;
                }

            },
            open2(msg, type) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type,
                    duration: 1500
                });
            },
            cancel() {
                this.$emit('reset', false);
            },

            send(val, pc) {
                let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (val === '') {
                    if (pc) {
                        this.open2('手机号不能为空', 'warning')
                    } else {
                        Toast('手机号不能为空');
                    }
                } else if (!reg.test(val)) {
                    if (pc) {
                        this.open2('请输入正确的手机号', 'warning')
                    } else {
                        Toast('请输入正确的手机号');
                    }
                } else {
                    let _that = this;
                    axios({
                        method: 'post',
                        url: 'http://localhost:8888/user/sendCode',
                        params: {
                            phoneNumber: val
                        },
                        header: {
                            'content-type': 'application/json'
                        }
                    }).then(function (res) {
                        if (res.data.code === 0) {
                            _that.toast(res.data.code, res.data.msg)
                            _that.getCode()
                        } else {
                            _that.toast(res.data.code, res.data.msg)
                        }
                    }).catch((res) => {
                        _that.toast(res.data.code, res.data.msg)
                    })

                }

            },
            Trim(str, is_global) {
                var result;
                result = str.replace(/(^\s+)|(\s+$)/g, "");
                if (is_global.toLowerCase() == "g") {
                    result = result.replace(/\s/g, "");
                }
                return result;
            },

            register() {

                if (this.ruleForm.name === '' || this.ruleForm.name.trim().length < 1) {
                    this.$toast('用户名不能为空');
                } else if (this.ruleForm.phone === '' || this.ruleForm.phone.trim().length < 1) {
                    this.$toast('手机号不能为空');
                } else if (this.ruleForm.verify === '' || this.ruleForm.verify.trim().length < 1) {
                    this.$toast('验证码不能为空');
                } else if (this.ruleForm.pass == '' || this.ruleForm.pass.trim().length < 1) {
                    this.$toast('密码不能为空');
                } else {
                    let content = this.Trim(this.ruleForm.name, 'g')
                    let arr = arraylist()
                    for (let i = 0; i < arr.length; i++) {
                        content = content.replace(new RegExp(arr[i], 'ig'), new Array(arr[i].length).join('*'));
                    }
                    let headerImg;
                    if (this.imageUrl !== '') {
                        headerImg = this.imageUrl
                    } else {
                        headerImg = this.defaultIcon
                    }
                    console.log(headerImg)
                    console.log(content)

                    let _that = this;
                    axios({
                        method: 'POST',
                        url: 'https://localhost:8888/user/register',
                        params: {
                            phoneNumber: _that.ruleForm.phone,
                            userName: content,
                            userPass: _that.ruleForm.pass,
                            verify: _that.ruleForm.verify,
                            userIcon: headerImg
                        },
                        header: {
                            'content-type': 'application/json'
                        }
                    }).then(function (res) {
                        if (res.data.code === 0) {
                            _that.$emit('func', false)
                            _that.toast(res.data.code, res.data.msg)
                            _that.cancel()
                            _that.ruleForm.phone = '',
                                _that.ruleForm.name = '',
                                _that.ruleForm.pass = '',
                                _that.ruleForm.verify = '',
                                -_that.$emit('noActive', false);
                            _that.$emit('changeStatus')
                        } else {
                            _that.toast(res.data.code, res.data.msg)
                        }
                    })

                }

            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let name = this.Trim(this.ruleForm.name, 'g')
                        let arr = arraylist()
                        for (let i = 0; i < arr.length; i++) {
                            name = name.replace(new RegExp(arr[i], 'ig'), new Array(arr[i].length).join('*'));
                        }
                        let headerImg;
                        if (this.imageUrl !== '') {
                            headerImg = this.imageUrl
                        } else {
                            headerImg = this.defaultIcon
                        }
                        let _that = this

                        axios({
                            method: 'POST',
                            url: 'http://localhost:8888/user/register',
                            params: {
                                phoneNumber: _that.ruleForm.phone,
                                userName: name,
                                userPass: _that.ruleForm.pass,
                                verify: _that.ruleForm.verify,
                                userIcon: headerImg
                            },
                            header: {
                                'content-type': 'application/json'
                            }
                        }).then(function (res) {
                            if (res.data.code === 0) {
                                _that.open2(res.data.msg, 'success')
                                let data = {
                                    phone: _that.ruleForm.phone,
                                    pass:_that.ruleForm.pass
                                }
                                _that.$emit('func', data)
                            } else {
                                _that.open2(res.data.msg, 'error')
                            }
                        })
                    } else {
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$emit('reset', false)
            },

            handleAvatarSuccess(res, file) {
                this.imageUrl = res
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
        },

    }
</script>

<style lang="scss" scoped>
  @import "../assets/scss/var.scss";

  @media screen and (min-width: $size) {
    @import "../assets/scss/register.scss";
  }

  @media screen and (max-width: $size) {
    @import "../assets/scss/register-mobile.scss";
  }
</style>
