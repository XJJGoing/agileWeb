<template>
    <div>
      这是一个people的div页面
    </div>
</template>

<script>
    var _this;
    export default {
        name: "people",
        data(){
          return {

          }
        },
       beforeCreate(){
          let userInfo = this.jsCookies.get('userInfo');
          console.log(userInfo)
       }
    }
</script>

<style scoped>

</style>
