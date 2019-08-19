<template>
 <div>
    <div id="login"
         v-loading="isLoading"
         element-loading-text="登录中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <form @submit.prevent="toLogin">
        <p>JOYEA_Agile项目管理平台</p>
        <el-input name="userId" v-model="userId" placeholder="请输入账户"/>
        <el-input name="userPwd" v-model="userPwd" type="password" placeholder="请输入密码"/>
        <div class="button">
          <el-button native-type="reset" type="warn">重置</el-button>
          <el-button native-type="submit" type="success">登录</el-button>
        </div>
      </form>
    </div>
   <div style="position: relative;width:100%;height:600px;">
     <Footer></Footer>
   </div>
 </div>
</template>

<script>
  import {userQuery} from '../js/api';
  import Footer from './Footer';
  var _this;
  export default {
    components:{
      Footer
    },
    name: "Login",
    data(){
      return {
        userId:""  ,     //用户的id
        userPwd:"",      //用户的密码
        isLoading:""     //是否加载
      }
    },
    beforeCreate(){
      let userInfo = this.jsCookies.get('userInfo');
      if(userInfo){
         this.$router.push({
            path:"/manager"
         })
      }else{
        this.$message({
             type:'warning',
             message:"身份过期,请重新登录"
        })
      }
    },
    methods:{

      //检查认证登录
      toLogin:function () {
        _this = this;
        if(this.userId&&this.userPwd){
          this.isLoading = true;
          this.axios.post(userQuery,{
            username:this.userId,
            password:this.userPwd,
            })
            .then(function (response) {
              console.log(response);
              if(response.data.data.records.length){
                _this.isLoading = false;
                let userInfo = response.data.data.records[0];
                let date = new Date().getTime();
                let newDate = date+(1000*60);
                console.log("到期时间",newDate);
                _this.jsCookies.set('userInfo',userInfo,{expires:newDate});
                _this.$router.push({
                  path:'/manager',
                })
              }else{
                  _this.isLoading = false;
                  const h = _this.$createElement;
                  _this.$message({
                    message:h('p',null,[
                      h('span',null,'提示'),
                      h('i',{style:'color:red'},'  账号或者密码错误')
                    ])
                  })

              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }else{
           this.$alert("请输入信息","注意",{
             confirmButtonText:"确认",
             callback:action => {
               this.$message({
                 type:'warning',
                 message:"请注意输入的格式"
               })
             }
           })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @loginWidth:300px;
  @loginHeight:300px;
  #login{
    width:@loginWidth;
    height:@loginHeight;
    position: absolute;
    left: 50%;
    margin-left: -@loginWidth/2;
    top:50%;
    margin-top: -@loginHeight/2;
    z-index: 1;
    .el-input{
      margin-top: 30px;
    }
    p{
      animation: change 2s  ease-in  infinite ;
      font-size: 18px;
      color: cornsilk;
      font-weight: bold
    }
    div{
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
  }
  //字体发亮
  @keyframes change {
    0%{ text-shadow: 0 0 20px #E52C05}
    50%{ text-shadow: 0 0 40px #E52C05}
    100%{ text-shadow: 0 0 10px #E52C05}
  }

</style>
