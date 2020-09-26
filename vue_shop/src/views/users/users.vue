<template>
  <div>
    <!-- 用户列表 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
            <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="usersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatuChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="usersEdit(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="usersDelete(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="SetRights(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10,30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户弹框 -->
    <el-dialog title="添加用户" :visible.sync="AdddialogVisible" width="30%" @close="AdddialogClosed">
      <el-form :model="AddForm" :rules="AddFormRules" ref="AddFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="AddForm.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="AddForm.mobile" clearable></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="AdddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="30%">
      <el-form :model="EditForm" label-width="100px" :rules="EditFormRules" ref="EditFormRef">
        <el-form-item label="用户名">
          <el-input v-model="EditForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="EditForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="EditForm.mobile" clearable></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="SetRightsDialogVisible" width="30%" class="SetRights">
      <div>当前的用户：{{userInfo.username}}</div>
      <div>当前的角色：{{userInfo.role_name}}</div>
      <div>
        <span>分配新角色：</span>
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
            v-for="item in SetRightsoptions"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


  <script>
export default {
  data() {
    // 邮箱验证
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      } else {
        callback(new Error("请输入正确的邮箱格式"));
      }
    };

    // 自定义手机号验证
    var checkMible = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMiblel = /^1[3456789]\d{9}$/;

      if (regMiblel.test(value)) {
        // 合法的手机号
        return callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };

    return {
      value: true, //状态开关

      queryInfo: {
        //接口参数
        query: "",
        pagenum: 1, //当前页码
        pagesize:10 //当前每页显示多少条数据
      },
      usersList: [], //用户列表
      total: 0,

      //控制添加用户对话框的显示与隐藏
      AdddialogVisible: false,

      //控制修改用户对话框的显示与隐藏
      editdialogVisible: false,

      // 添加用户表单数据
      AddForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },

      // 修改用户表单数据
      EditForm: {},

      // 添加用户表单数据必填项验证
      AddFormRules: {
        //对应prop名称
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入密邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMible, trigger: "blur" }
        ]
      },

      // 修改用户表单数据必填项验证
      EditFormRules: {
        //对应prop名称
        email: [
          { required: true, message: "请输入密邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMible, trigger: "blur" }
        ]
      },

      // 控制分配权限对话框
      SetRightsDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo:{},
      SetRightsoptions: [],
      //已选中的角色id值
      selectRoleId:''
        
    };
  },

  created() {
    this.getUsersList();
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      this.usersList = res.data.users;
      this.total = res.data.total;
      console.log(res, "用户列表");
    },

    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUsersList();
    },

    //监听页码值的变化
    handleCurrentChange(newPage) {
      console.log(newPage, "当前页码");
      this.queryInfo.pagenum = newPage;
      this.getUsersList();
    },

    //监听switch开关状态的变化
    async userStatuChanged(e) {
      console.log(e);
      // 请求地址 users/:uId/state/:type
      const res = await this.$http.put(`users/${e.id}/state/${e.mg_state}`);
      console.log(res, "用户状态修改");
      if (res.data.meta.status !== 200) {
        e.mg_state = !e.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },

    // 监听添加用户弹框关闭事件(重置表单)
    AdddialogClosed() {
      this.$refs.AddFormRef.resetFields();
    },

    //添加用户
    AddUser() {
      this.$refs.AddFormRef.validate(async vaild => {
        console.log(vaild);
        if (vaild) {
          const res = await this.$http.post("users", this.AddForm);
          console.log(res, "添加用户");
          if (res.data.meta.status == 201) {
            this.$message.success("添加成功");
            this.AdddialogVisible = false;
            this.getUsersList();
          }
        }
      });
    },

    // 根据id查询用户
    async usersEdit(id) {
      console.log(id, "用户id");
      // const res = await this.$http.get(`users/${id}`)
      const res = await this.$http.get("users/" + id);
      console.log(res, "根据id查询用户");
      this.EditForm = res.data.data;
      this.editdialogVisible = true;
    },

    // 修改用户信息并提交
    EditUserInfo() {
      this.$refs.EditFormRef.validate(async vaild => {
        console.log(vaild);
        if (vaild) {
          //请求地址：users/:id
          const res = await this.$http.put(`users/${this.EditForm.id}`, {
            email: this.EditForm.email,
            mobile: this.EditForm.mobile
          });
          console.log(res, "修改信息提交");
          if (res.data.meta.status == 200) {
            this.$message.success("更新成功");
            this.editdialogVisible = false;
            this.getUsersList();
          }
        }
      });
    },

    // 根据id删除单条用户信息
    async usersDelete(id) {
      const res = await this.$http.delete(`users/${id}`);
      console.log(res, "删除");
      if (res.data.meta.status == 200) {
        this.$message.success("删除成功！");
        this.getUsersList();
      }
    },

    // 分配角色
    async SetRights(userInfo){
      console.log(userInfo)
      // 在展示对话框之前获取所有角色列表
      const res =await this.$http.get('roles')
      console.log(res,'获取角色列表')
      
      this.SetRightsoptions=res.data.data
      this.SetRightsDialogVisible=true
      this.userInfo=userInfo
    },
    // 点击确定按钮给用户分配角色 请求地址：users/:id/role
    async saveRolesInfo(){
     
      const res = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoleId})
       console.log(this.selectRoleId,'角色id')
      console.log(res,'点击确定按钮给用户分配角色')
      if(res.data.meta.status==200){
        this.$message.success('设置角色成功')
        this.SetRightsDialogVisible=false;
        this.getUsersList();
      }
    }
  }
};
</script>



<style lang="less" scoped>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 12px;
}
.SetRights{
  div{
    margin-bottom: 15px;
  }
}
</style>



   