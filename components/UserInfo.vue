<template>
  <div>
    <div class="user-msg">
      <div class="icon">头像</div>
      <el-upload class="" action="http://localhost:8888/user/img/addImg" :show-file-list="false"
                 :on-success="handleAvatarSuccess"
                 :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <img v-else-if="user.userIcon" :src="user.userIcon" class="avatar">
        <div v-else class="avatar-uploader">头像</div>
      </el-upload>
    </div>
    <van-cell-group>


      <van-field
        :value="user.userName"
        label="用户名"
        left-icon="manager"
        disabled
      />

      <van-field
        left-icon="phone"
        :value="user.phoneNumber"
        label="手机号"
        disabled
      />
      <van-field
        left-icon="lock"
        :value="user.userPass"
        label="密码"
        disabled
      />
    </van-cell-group>
    <div class="exit">
      <van-button type="info" @click="exit">退出登录</van-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "UserInfo",
        props:{
            user:''
        },
        data() {
            return {
                domain: 'panbingwen',
                value: '',
                imageUrl: ''
            }
        },
        methods: {
            exit() {
                localStorage.removeItem('myinfo');
                this.$emit('killIcon', false);
                this.$emit('noActive', false);
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
            }
        }
    }
</script>

<style lang="scss" scoped>
  .exit{
    float: right;
    van-button{
    }
  }
  .user-msg {
    margin-top: 20px;
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
      margin-left: 40px;

      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid $rgbcolor;
      margin-bottom: -6px;
    }
   .icon{
     margin-left: 20px;
   }

  }

</style>
