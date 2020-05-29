<template>
  <div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
             class="demo-ruleForm input-pc">
      <div class="">
        <div class="">
          <el-form-item label="手机号" prop="phone" class="phone-input" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.phone" autocomplete="off"
                      @keyup.enter.native="submitForm('ruleForm')"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button class="send" size="small" type="primary" @click="send(ruleForm.phone,true)" v-show="timeout">发送验证码</el-button>
            <el-button class="send" size="small" type="info" v-show="!timeout">{{count}}</el-button>

          </el-form-item>
          <el-form-item label="验证码" prop="verify" class="phone-input" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.verify" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass" :label-width="formLabelWidth">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"
                      @keyup.enter.native="submitForm('ruleForm')"></el-input>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth">
            <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <van-cell-group class="input-mobile">
      <div class="">
        <div class="container">
          <div class="input">
            <van-field
              @keyup.enter.native="change"
              v-model="ruleForm.phone"
              required label="手机号" placeholder="请输入手机号"
              right-icon="question-o"
              @click-right-icon="$toast('必须是正确的手机号')">
              <van-button slot="button" size="small" @click="send(ruleForm.phone,false)"
                          type="info" v-show="timeout">发送验证码
              </van-button>
              <van-button slot="button" size="small"
                          disabled type="info" v-show="!timeout">{{count}}
              </van-button>

            </van-field>

            <van-field v-model="ruleForm.verify" required label="验证码" placeholder="请输入验证码">
            </van-field>

            <van-field
              @keyup.enter.native="change"
              type="password"
              v-model="ruleForm.pass"
              label="新密码"
              placeholder="请输入新密码"
              required
              right-icon="question-o"
              @click-right-icon="$toast('密码必须是数字、字母、下划线')"
            />
          </div>

          <div class="btn">
            <van-button type="info" class="confirm" @click="change">修改</van-button>
            <van-button type="default" class="cancel" @click="resetForm('ruleForm')">取消</van-button>
          </div>
        </div>
      </div>


    </van-cell-group>

  </div>
</template>

<script>
    import axios from 'axios';
    import {Toast} from 'vant';

    export default {
        props: {
            love: Boolean,
            name: String,
            phone: String,
            pass: String,
            imageUrl: String,
        },

        data() {

            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (value.trim().length == 0) {
                    callback(new Error('请正确输入密码'));
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
                domain: 'panbingwen',
                // domain: 'qinbinbin',
                formLabelWidth: '80px',
                timeout: true,
                count: '',
                timer: null,
                dialogFormVisible: false,
                isMobile: false,
                ruleForm: {
                    pass: '',
                    phone: '',
                    verify: ''
                },
                rules: {
                    pass: [
                        {required: true, validator: validatePass, trigger: 'blur'}
                    ],
                    phone: [{
                        required: true,
                        validator: validatePhone,
                        trigger: 'blur'
                    }],
                    verify: [{
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }]
                }
            };
        },
        methods: {
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
            send(val,pc) {

                let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (val === '') {
                    if (pc) {
                       this.open2('手机号不能为空','warning')
                    } else {
                        Toast('手机号不能为空');
                    }
                } else if (!reg.test(val)) {
                    if (pc) {
                        this.open2('请输入正确的手机号','warning')
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
                            if (pc) {
                                _that.open2(res.data.msg, 'warning')
                            } else {
                                _that.toast(res.data.code, res.data.msg)
                            }
                            _that.getCode()
                        } else {
                            if (pc) {
                                _that.open2(res.data.msg, 'warning')
                            } else {
                                _that.toast(res.data.code, res.data.msg);
                            }
                        }
                    }).catch((res) => {
                        _that.toast(res.data.code, res.data.msg)
                    })

                }

            },

            findPass() {

            },
            exit(formName) {
                localStorage.removeItem('myinfo');
                this.$refs[formName].resetFields();
                this.$emit('reset', false);
                this.$emit('killIcon', false);
                this.$emit('noActive', false);
                this.ruleForm.phone = ''
                this.ruleForm.pass = ''

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
            open2(msg,type) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            updateReq() {
                let _that=this
                axios({
                    method: 'POST',
                    url: 'http://localhost:8888/user/updatePass',

                    params: {
                        code: _that.ruleForm.verify,
                        newPass: _that.ruleForm.pass,
                        phone: _that.ruleForm.phone
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(function (res) {
                    if (res.data.code === 0) {
                        if (_that.isMobile) {
                            _that.toast(res.data.code, res.data.msg)
                               setTimeout(()=>{
                                   _that.$emit('changeStatus')
                               },2000)
                        } else {
                            _that.open2(res.data.msg,'success');
                                _that.$emit('reset');
                                let data={
                                    phone:_that.ruleForm.phone,
                                    pass:_that.ruleForm.pass
                                }
                            _that.$emit('loginInfo',data);

                        }
                    } else {
                        if (_that.isMobile) {
                            _that.toast(res.data.code, res.data.msg)
                        } else {
                            _that.open2(res.data.msg,'error')
                        }
                    }
                })

            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.updateReq()
                        // this.$refs[formName].resetFields();

                    } else {
                        return false
                    }
                });
            },
            change() {
                if (this.ruleForm.phone === '' || this.ruleForm.phone.trim().length < 1) {
                    this.$toast('手机号不能为空');
                } else if (this.ruleForm.verify === '' || this.ruleForm.verify.trim().length < 1) {
                    this.$toast('验证码不能为空');
                } else if (this.ruleForm.pass == '' || this.ruleForm.pass.trim().length < 1) {
                    this.$toast('密码不能为空');
                } else {
                    this.isMobile=true
                    this.updateReq()
                }

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$emit('reset', false);
            },
            handleAvatarSuccess() {

            },
            beforeAvatarUpload() {

            }

        }


    }
</script>

<style lang="scss" scoped>
  @import "../assets/scss/var.scss";

  @media screen and (min-width: $size) {
    .input-mobile {
      display: none;
    }
  }

  @media screen and (max-width: $size) {
    .input-pc {
      display: none;
    }
  }
</style>
