<template>
    <div class="container">
      这是新布局
      <nuxt/>
    </div>
</template>

<script>
    export default {
        name: "newLayout"
    }
</script>

<style lang="scss" scoped>
  .container{
    position: absolute;
    height: 100%;
    width: 100%;
    top:0;
    left: 0;
    overflow-y: auto;
    background-color: red;//背景色为白色
    background-image: url("../assets/imgs/banner1.jpg") ;
    background-repeat:no-repeat;
    background-size:cover;
  }
</style>
