<template>
  <div>
    <!-- 角色列表 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="AddRolesDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="RolesList" border stripe>
        <!-- 展开列 type="expand"-->
        <el-table-column label type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1===0 ? 'bdtop':'']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close='deleteRolesRight(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2===0 ? '':'bdtop']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="8">
                    <el-tag closable type="success"  @close='deleteRolesRight(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="16">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      type="warning"
                       @close='deleteRolesRight(scope.row,item3.id)'
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="GetRoles(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row.id)"
            >删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="getRightsList(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="AddRolesDialogVisible"
      width="30%"
      @close="AddRolesDialogClosed"
    >
      <el-form :model="AddRolesForm" :rules="AddRolesRules" label-width="100px" ref="AddRolesRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="AddRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="AddRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="EditRolesDialogVisible" width="30%">
      <el-form
        :model="EditRolesForm"
        :rules="EditRolesRules"
        label-width="100px"
        ref="EditRolesRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="EditRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="EditRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="EditRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditConfirmRoles">确 定</el-button>
      </span>
    </el-dialog>


  <!-- 分配权限 -->
  <el-dialog title="分配权限" :visible.sync="RightsDialogVisible" width="30%" @close='setRightsDialogClosed'>
    <!-- 树形控件 -->
    <el-tree
      :data="RightsData"
      show-checkbox
      node-key="id"
      :props="RightsProps"
      default-expand-all
      :default-checked-keys='defKeys'
      ref='treeRef'
      >
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="RightsDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRights">确 定</el-button>
    </span>
  </el-dialog>


  </div>
</template>




<script>
export default {
  data() {
    return {
      RolesList: [], //所有角色列表

      //控制添加角色对话框显示与隐藏
      AddRolesDialogVisible: false,

      AddRolesForm: {
        roleName: "",
        roleDesc: ""
      },
      AddRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 5 到 15 个字符", trigger: "blur" }
        ]
      },

      //编辑
      EditRolesDialogVisible: false,
      EditRolesForm: {},
      EditRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ]
      },

      // 分配权限
      RightsDialogVisible:false,
      RightsData: [],
      RightsProps: {
          children: 'children',
          label: 'authName'//显示的名称字段
        },
        // 默认选中的节点的id值
      defKeys:[],
      // 当前即将分配权限的角色id
      roleId:''
    };
  },
  created() {
    this.GetRolesList();
  },
  methods: {
    async GetRolesList() {
      // 获取角色列表的接口   请求地址：roles
      const res = await this.$http.get("roles");
      console.log(res, "获取角色列表");
      this.RolesList = res.data.data;
    },

    //添加角色
    AddRoles() {
      this.$refs.AddRolesRef.validate(async valid => {
        console.log(valid);
        if (valid) {
          const res = await this.$http.post("roles", this.AddRolesForm);
          console.log(res, "添加用户角色");
          if (res.data.meta.status == 201) {
            this.$message.success("添加成功");
            this.GetRolesList();
            this.AddRolesDialogVisible = false;
          }
        }
      });
    },

    // 监听添加角色弹框关闭事件(重置表单)
    AddRolesDialogClosed() {
      this.$refs.AddRolesRef.resetFields();
    },

    //根据id查询角色
    async GetRoles(id) {
      console.log(id, "角色id");
      // 请求地址roles/:id
      const res = await this.$http.get("roles/" + id);
      console.log(res, "根据id查询用户");
      this.EditRolesForm = res.data.data;
      this.EditRolesDialogVisible = true;
    },

    // 编辑确认提交
    EditConfirmRoles() {
      this.$refs.EditRolesRef.validate(async valid => {
        console.log(valid);
        if (valid) {
          const res = await this.$http.put(
            `roles/${this.EditRolesForm.roleId}`,
            {
              roleName: this.EditRolesForm.roleName,
              roleDesc: this.EditRolesForm.roleDesc
            }
          );
          console.log(res, "确认提交");
          if (res.data.meta.status == 200) {
            this.$message.success("更新成功");
            (this.EditRolesDialogVisible = false), this.GetRolesList();
          }
        }
      });
    },

    // 根据id删除角色
    async deleteRoles(id) {
      console.log(id);
      const confirmResult = await this.$confirm("是否确定删除该角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消");
        const res = await this.$http.delete("roles/" + id);
        if (res.data.meta.status == 200) {
          this.$message.success("删除成功");
          this.GetRolesList();
        }
    },

    // 所有权限列表
    async getRightsList(role){
      this.roleId = role.id
      //请求地址：rights/:type
      const res = await this.$http.get('rights/tree')
      console.log(res,'权限列表')
      if(res.data.meta.status==200){
        this.RightsData = res.data.data
        //递归获取三级节点的id
        this.getLeafKeys(role,this.defKeys)
        this.RightsDialogVisible=true
      }
    },
    // 通过递归的形式获取所有三级权限的id,并保存到defKeys数组中
    getLeafKeys(node,arr){
      //如果当前node节点不包含children属性，则是三级节点
      if(!node.children){
          return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item,arr))
    },
    // 监听分配权限对话框的关闭时间
    setRightsDialogClosed(){
      this.defKeys = []
    },

    // 点击为角色分配权限
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        console.log(keys)
        const idStr = keys.join(',')
        console.log(idStr)
        //发起请求，请求地址：roles/:roleId/rights
        const res = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        console.log(res,'为角色分配权限')
        if(res.data.meta.status==200){
          this.$message.success('分配权限成功')
          this.GetRolesList();
          this.RightsDialogVisible=false
        }
    },
    // 根据id单个删除对应角色权限 
    async deleteRolesRight(role,rightId) {
      console.log(role.id,'角色id')
      console.log(rightId,'权限id')
      const confirmResult = await this.$confirm("是否确定删除该权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消");
        console.log('确认了删除')

        // 接口请求地址：roles/:roleId/rights/:rightId
        const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
        if (res.data.meta.status == 200) {
          this.$message.success("删除成功");
          role.children=res.data.data;
        }
    },
  }
};
</script>




<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>