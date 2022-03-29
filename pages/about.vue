<template>
  <div>
    <div class="type"  :class="[!$store.state.night?'type':'n-type']">
      开发历程
    </div>
    <div class="divider">
      <el-divider></el-divider>
    </div>
    <div class="block" style="">
      <el-timeline>
        <el-timeline-item
          v-for="(item,index) in list" :key="index"
          :timestamp="changeTime(item.time)" placement="top"
          size="large">
          <el-card :class="[!$store.state.night?'card':'n-card']">
            <p>{{item.content}}</p>
          </el-card>
          </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
<script>
    export default {
        head(){
            return {
                title:'关于'
            }
        },
        data() {
            return {
             list:[{
               time:'2022-2-28',
               content:"项目部署"
             },{
               time:'2022-2-27',
               content:"前端开发"
             },{
               time:'2022-2-26',
               content:"后端开发"
             },{
               time:'2022-2-25',
               content:"表结构设计"
             }
             ]
            };
        },
        /*async asyncData({$axios}) {
            let domain='panbingwen'
            const obj = await $axios.$get('http://localhost:8888/timeline/getTimelineList')
            return {list:obj.data}
        },*/
        methods:{
            changeTime(value) {
                let date = new Date(value);
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let minute = date.getMinutes();
                let second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
            },
        }
    };
</script>

<style scoped>
  .divider{
    margin-top: -10px;
  }
</style>
