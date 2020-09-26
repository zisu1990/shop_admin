<template>
  <div class="login-container">
    <div class="login-box">
      <!-- logo区域 -->
      <div class="avater-box">
        <img src="../assets/logo.png" alt srcset>
      </div>

      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login-form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-s-goods"
            placeholder="请输入密码"
            show-password
          >></el-input>
        </el-form-item>

        <el-form-item class="bts">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>




<script>
export default {
  name: "login",
  data() {
    return {
      //登录表单
      loginForm: {
        username: "admin",
        password: "123456"
      },

      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {


    //登录
     login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);   //后台返回数据primise,需要加await与async异步优化
        console.log(res);
        if(res.meta.status !==200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)   //$message是Message弹框

        // 将token保存在sessionStorage中（localStorage是除非用户显示在浏览器提供的UI上清除localStorage信息，否则这些信息将永远存在，sessionStorage应在当前网站打开期间生效）
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
     });
    },



    //重置
    resetLoginForm() {
      //console.log(this)
      this.$refs.loginFormRef.resetFields();
    }
  }
};
</script>




<style lang="less" scoped>
.login-container {
  background: #2a4b6c;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avater-box {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
  }
}
.bts {
  display: flex;
  justify-content: flex-end;
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>

