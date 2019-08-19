<template>
  <div class="footer-info">
    <p>© {{fromYear}} {{year}} JOYEA. All rights reserved</p>
  </div>
</template>

<script>
    export default {
        name: "footer",
        data(){
          return {
            year:"",
            fromYear:"2019"
          }
        },
        created(){
          let date = new Date();
          let nowYear = date.getFullYear();
          if(nowYear.toString() !== this.fromYear){
             this.year = ' - '+nowYear
          }else{
            this.year = "";
          }
        }
    }
</script>

<style scoped>
  .footer-info{
    position: absolute;
    top: 100%;
    bottom: 0;
    width: 100%;
    height: 95px;
    display: flex;
    margin-bottom: 0;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    opacity: 1;
    color: darkgray;
  }
</style>
