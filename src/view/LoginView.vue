<template>
  <el-container>

    <!--aside 左侧-->
    <el-aside width="200px">
      <img src="../assets/loginBox.png">
      <p class="imgText">
        欢迎使用动力云客管理系统
      </p>
    </el-aside>

    <!--main 右侧-->
    <el-main>
      <div class="loginBox">
        <div class="loginTitle">立 即 登 录</div>

        <el-form ref="LoginRefForm" :model="user" label-width="auto" :rules="loginRules">
          <el-form-item prop="loginAct">
            <el-input v-model="user.loginAct" placeholder="用户名" clearable/>
          </el-form-item>

          <el-form-item prop="loginPwd">
            <el-input type="password" v-model="user.loginPwd" placeholder="密码" show-password/>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="login">登 录</el-button>
          </el-form-item>

          <el-form-item>
            <el-checkbox value="记住我" name="rememberMe">记住我</el-checkbox>
            <el-link href="">忘记密码？</el-link>
          </el-form-item>
        </el-form>
      </div>

    </el-main>

  </el-container>
</template>

<script>
import {doPost} from "../http/httpRequest.js";
import {messageTip} from "../util/util.js";

export default {
  name: "LoginView",

  //定义页面使用的变量
  data() {
    return {
      /*      //对象变量定义，是{}
            form: {},
            //字符串变量定义是''
            name: '',
            //数字变量定义是0
            age: 0,
            //数组变量定义是[]
            arr: [],
            //list集合对象定义是[{}]
            userList: [{}]
            */

      user: {
        //临时设置用户名和密码，便于开发
        loginAct: "admin",
        loginPwd: "aaa111"
      },
      //定义登录表单验证规则
      loginRules: {
        //定义账号验证规则，规则可以有多个所以是数组
        loginAct: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        //定义密码验证规则，规则可以有多个所以是数组
        loginPwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur'},
        ],
      },

    }
  },

  //页面上需要使用功能的js函数，都在methods属性中定义
  methods: {
    //登录函数
    login() {
      //提交前验证输入框的合法性
      this.$refs.LoginRefForm.validate((isValid) => {
        //isValid是验证后的结果，true为验证通过
        if (isValid) {
          //FormData就像java的map，一个key一个value,通过formData.append()来添加数据
          let formData = new FormData();
          formData.append("loginAct", this.user.loginAct);
          formData.append("loginPwd", this.user.loginPwd);

          //验证通过可以提交登录,此处是封装了axios的方法，也可以直接使用axios.post
          doPost("/api/login", formData).then((resp) => {
            console.log(resp);
            //===必须类型和值都相等，而==的话类型可以不相同，即数字200和字符串"200"
            if (resp.data.code === 200) {
              //登录成功
              messageTip("登录成功",'success');
              //跳转系统的主页面
              window.location.href = "/dashboard";
            } else {
              //登录失败
              messageTip("用户名或密码错误",'error')
            }

          })

        }
      })
    },
  },


}
</script>


<style scoped>
.el-container {
  background: #c2e59c; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #64b3f4, #c2e59c); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #64b3f4, #c2e59c); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}

.el-aside {
  //background: #4682B4;
  width: 45%;
  text-align: center;
}

.el-main {
  //background: #4682B4;
  height: calc(100vh);
  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  height: 620px;
  margin-top: 100px;
}

.imgText {
  color: white;
  font-size: 28px;
}

.el-form {
  width: 50%;
  margin: auto;
}

.loginTitle {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: bold;
}

.el-button {
  width: 100%;
}

.loginBox {
  height: 35%;
  width: 50%;
  background: #87CEFA;
  border-radius: 13px;
}

.el-link {
  margin-left: auto;
}

</style>