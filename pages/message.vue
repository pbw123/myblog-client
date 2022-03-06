<template>
	<div class="home">
		<div class="msg-left">
      <div class="type"  :class="[!$store.state.night?'type':'n-type']">
				欢迎留言
			</div>
      <div class="divider">
        <el-divider></el-divider>
      </div>

      <div class="com">
        <Comment :comments="messages" :msg="msg"  :num="messages.length"></Comment>
      </div>
		</div>

	</div>
</template>

<script>

  import Comment from '~/components/Comment.vue'
  export default {
      name: 'message',
      head(){
          return {
             title:'留言'
          }
      },
      components: {
          Comment
      },
      data() {
          return {
              msg: {
                  count:'',
                  kind: '留言'
              }
          }
      },
      methods: {
      },
      async asyncData({ $axios }) {
          const msg = await $axios.$get('http://localhost:8888/message/getAllMessage')
          return {messages:msg.data}
      }
  }

</script>

<style lang="scss" scoped>
	@import "../assets/scss/var.scss";
	@media screen and (min-width:$size) {
		@import "../assets/scss/message.scss";
	}
	@media screen and (max-width:$size) {

		.type {
			font-size: 26px;
			font-family: "microsoft yahei";
			color: #474645;
			font-weight: bold;
			border-bottom: 5px solid rgb(219, 109, 76);
		}

		.com{
			margin-top: -60px;
		}

	}

</style>
