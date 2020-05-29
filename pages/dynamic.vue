<template>
  <div class="container">
    <div class="article">
      <Article type="所有文章" :articles="articles"></Article>
    </div>
  </div>
</template>

<script>
    import Article from '~/components/Article.vue'
    export default {
        head(){
            return {
                title:'动态'
            }
        },
        components: {
            Article
        },
        data(){
            return{
                articles:''
            }
        },
        async asyncData({ $axios }) {
            const obj = await $axios.$get('http://localhost:8888/article/articleList')
            return { articles:obj.data }
        }
    }
</script>

<style>

</style>
