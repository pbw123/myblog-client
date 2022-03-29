<template>
  <div>
    <el-form v-show="!love" :model="ruleForm" status-icon :rules="rules"
             ref="ruleForm2"
             class="demo-ruleForm">
      <div class="input-pc">
        <div class="phone">
          <el-form-item label="手机号" prop="phone" class="phone-input"
                        :label-width="formLabelWidth">
            <el-input v-model="ruleForm.phone" autocomplete="off"
                      @keyup.enter.native="submitForm('ruleForm2')"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="pass" :label-width="formLabelWidth">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password
                      @keyup.enter.native="submitForm('ruleForm2')"></el-input>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth">
            <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
            <el-button @click="resetForm('ruleForm2')">取消</el-button>
            <span @click="update" style="cursor: pointer">忘记密码？</span>
            <span @click="goRegister" style="cursor: pointer">去注册</span>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-form v-show="love" :model="form" status-icon :rules="rules" ref="ruleForm" label-width="100px"
             class="demo-ruleForm">
      <div class="input-pc">
        <el-form-item label="头像">
          <div class="user-msg">
            <div v-show="disabled">
              <img :src="imageUrl" class="avatar">
            </div>
            <div v-show="!disabled">
              <el-upload class="" :action="'https://'+this.action+'/image/userImage'"
                         :show-file-list="false" :on-success="handleAvatarSuccess"
                         :before-upload="beforeAvatarUpload">
                <img v-if="uploadImg" :src="uploadImg" alt="" class="avatar">
                <img v-else :src="imageUrl" class="avatar">
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="名称" class="phone-input" prop="name">
          <el-input v-model="form.name" autocomplete="off" :disabled="disabled"
                    @keyup.enter.native="confirmUpdateInfo('ruleForm')"></el-input>
        </el-form-item>
        <div class="phone">
          <el-form-item label="手机号" class="phone-input">
            <el-input :value="phone" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="form.pass" autocomplete="off"
                      @keyup.enter.native="confirmUpdateInfo('ruleForm')"
                      show-password :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="exit('ruleForm')">退出登录</el-button>
            <el-button @click="updateInfo()" v-show="disabled">修改信息</el-button>
            <el-button type="primary" @click="confirmUpdateInfo('ruleForm')" v-show="!disabled">确定修改</el-button>

          </el-form-item>

        </div>
      </div>
    </el-form>

    <van-cell-group>
      <div class="input-mobile">
        <div class="container">

          <div class="input">
            <van-field
              @keyup.enter.native="login"
              v-model="ruleForm.phone"
              label="用户名"
              placeholder="请输入手机号"
              required
              right-icon="question-o"
              @click-right-icon="$toast('用户名必须是手机号')"
            />
            <van-field
              @keyup.enter.native="login"
              type="password"
              v-model="ruleForm.pass"
              label="密码"
              placeholder="请输入密码"
              required
              right-icon="question-o"
              @click-right-icon="$toast('密码必须是数字、字母、下划线')"
            />
          </div>

          <div class="btn">
            <van-button type="info" class="confirm" @click="login">登录</van-button>
            <van-button type="default" class="cancel" @click="cancel">取消</van-button>
            <span class="forget" @click="update">忘记密码？</span>
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
        created() {
            this.form.name = this.name
            this.form.pass = this.pass
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
                // action: 'localhost:8888',
                // action: 'api.qinbinin.cn',
                action: 'api.panbingwen.cn',
                uploadImg: '',
                disabled: true,
                formLabelWidth: '80px',
                dialogVisible: false,
                dialogFormVisible: false,
                ruleForm: {
                    pass: '',
                    phone: ''
                },
                form: {
                    pass: '',
                    name: ''
                },
                rules: {
                    // pass: [
                    //     {required: true, validator: validatePass, trigger: 'blur'}
                    // ],
                    phone: [{
                        required: true,
                        validator: validatePhone,
                        trigger: 'blur'
                    }],
                    pass: [
                        {
                            required: true,
                            message: '请输入密码名',
                            trigger: 'blur'
                        },
                        {
                            required: true,
                            validator: validatePass,
                            trigger: 'blur'
                        }
                    ],
                    name: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                        {
                            required: true,
                            pattern: /^(?!.{11}|^\s*$)/g,
                            message: '请正确输入用户名',
                            trigger: 'blur'
                        }
                    ]
                }

            };
        },
        methods: {
            inputInfo(val) {
                this.ruleForm.phone = val.phone
                this.ruleForm.pass = val.pass
            },
            confirmUpdateInfo(formName) {
                this.disabled = true
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let user = JSON.parse(localStorage.getItem('myinfo'))
                        let icon = this.imageUrl
                        if (this.uploadImg) {
                            icon = this.uploadImg
                        }
                        let _that = this

                        axios({
                            method: 'POST',
                            url: 'https://localhost:8888/userManager/updateUser',
                            params: {
                                userId: user.userId,
                                userName: _that.form.name,
                                pass: _that.form.pass,
                                userIcon: icon
                            },
                            header: {
                                'content-type': 'application/json'
                            }
                        }).then(function (res) {
                            if (res.data.code === 0) {
                                _that.open('修改成功', 'success')
                                // _that.$refs[formName].resetFields();
                                _that.$emit('icon', _that.uploadImg)
                            } else {
                                _that.uploadImg = ''
                                _that.open(res.data.msg, 'warning')
                            }
                        }).catch(function (res) {
                            _that.uploadImg = ''
                            _that.open(res.data.msg, 'error')
                        });
                    } else {
                        return false
                    }
                });
            },

            updateInfo() {
                this.disabled = false
            },
            goRegister() {
                this.$emit('goRegister')
            },
            update() {
                this.$emit('update')
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
            loginReq(formName) {
                let _that = this
                axios({
                    method: 'POST',
                    url: 'http://localhost:8888/user/login',

                    data: {
                        phoneNumber: _that.ruleForm.phone,
                        userPass: _that.ruleForm.pass
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(function (res) {
                    if (res.data.code === 200) {
                        _that.open(res.data.msg, 'success')
                        // that.toast(res.data.code,res.data.msg)
                        _that.$refs[formName].resetFields();
                        _that.$emit('reset', false);
                        _that.$emit('icon', res.data.data.userIcon);
                        _that.$emit('reloadArt', res.data.data.userId)
                        localStorage.setItem('myinfo', JSON.stringify(res.data.data));

                    } else {
                        _that.open(res.data.msg, 'warning')
                    }
                }).catch((res) => {
                    _that.toast(res.data.code, res.data.msg)
                })

            },
            login() {
                if (this.ruleForm.phone === '' || this.ruleForm.pass.trim().length < 1) {
                    this.$toast('手机号不能为空');
                } else if (this.ruleForm.pass == '' || this.ruleForm.pass.trim().length < 1) {
                    this.$toast('密码不能为空');
                } else {
                    this.loginReq('ruleForm')
                }
            },
            cancel() {
                this.$emit('reset', false);
            },
            findPass() {
                this.$emit('findPass', true);
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
            open(msg, type) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type,
                    offset: 300,
                    duration: 1500
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loginReq(formName)
                    } else {
                        return false
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$emit('reset', false)
                this.disabled = true
            },
            handleAvatarSuccess(res, file) {
                this.uploadImg = res
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
  ;

    .user-msg {
      display: flex;
      align-items: center;
      margin-left: 20px;

      $rgbcolor: rgb(231, 72, 81) !global;

      .avatar-uploader {
        font-size: 16px;
        color: $rgbcolor;
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border: 1.5px solid $rgbcolor;
        border-radius: 50%;
        background-color: rgb(255, 251, 240);
      }

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 2px solid $rgbcolor;
        margin-bottom: -6px;
      }
    }

  }

  @media screen and (max-width: $size) {
    .input-pc {
      display: none;
    }
  ;
    .container {
      position: relative;

      .btn {
        position: absolute;
        /*right: 0;*/
        margin-top: 20px;
      }
    }
    .forget {
      font-size: 16px;
      color: dodgerblue;
    }

  }
</style>
