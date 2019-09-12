<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="user-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input placeholder="请输入用户名" v-model="queryStr" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="queryUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click="showUserAddDialog">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" stripe>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column label="用户状态" width="800">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row.id, scope.row.mg_state)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="360">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="showUserEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delUserById(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="curPage" @current-change="changePage">
    </el-pagination>

    <!-- 弹出添加用户表单 -->
    <el-dialog title="添加用户" :visible.sync="userAddDialog" @close="closeUserAddDialog">
      <el-form :model="userAddForm" :rules="userAddRules" ref="userAddForm">
        <el-form-item label="用户名" prop="username" label-width="120px">
          <el-input v-model="userAddForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="120px">
          <el-input v-model="userAddForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="120px">
          <el-input v-model="userAddForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" label-width="120px">
          <el-input v-model="userAddForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户表单 -->
    <el-dialog title="编辑用户" :visible.sync="userEditDialog" @close="closeUserEditDialog">
      <el-form :model="userEditForm" :rules="userEditRules" ref="userEditForm">
        <el-form-item label="用户名" prop="username" label-width="120px">
          <el-input :value="userEditForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="120px">
          <el-input v-model="userEditForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" label-width="120px">
          <el-input v-model="userEditForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  created() {
    this.getUserList()
  },

  methods: {
    //  获取用户列表数据
    getUserList(curPage = 1) {
      this.$http
        .get('/users', {
          // headers: {
          //   Authorization: localStorage.getItem('token')
          // },
          params: {
            pagenum: curPage,
            pagesize: this.pageSize,
            query: this.queryStr || ''
          }
        })
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            // console.log(res.data)
            this.userList = data.users
            this.total = data.total
            this.curPage = data.pagenum
          }
        })
    },

    changePage(curPage) {
      this.getUserList(curPage)
    },

    queryUserList() {
      this.getUserList()
    },

    changeUserState(id, curState) {
      this.$http
        .put(`/users/${id}/state/${curState}`)
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.$message({
              type: 'success',
              message: data.mg_state === 0 ? '禁用成功' : '启用成功',
              duration: 1000
            })
          } else {
            this.$message({
              type: 'error',
              message: meta.msg,
              duration: 1000
            })
          }
        })
    },

    showUserAddDialog() {
      this.userAddDialog = true
    },

    addUser() {
      this.$refs.userAddForm.validate(valid => {
        if (valid) {
          this.$http.post('/users', this.userAddForm).then(res => {
            const { meta } = res.data
            if (meta.status === 201) {
              this.userAddDialog = false
              this.getUserList()
            }
          })
        } else {
          return false
        }
      })
    },

    closeUserAddDialog() {
      this.$refs.userAddForm.resetFields()
    },

    delUserById(id) {
      this.$confirm('确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`users/${id}`).then(res => {
          console.log(res)
          const { meta } = res.data
          if (meta.status === 200) {
            this.$message({
              type: 'success',
              message: meta.msg
            })
            // this.getUserList()

            const index = this.userList.findIndex(item => item.id === id)
            this.userList.splice(index, 1)
            const totalPage = Math.ceil(this.userList.length / this.pageSize)
            if (this.curPage > totalPage) {
              this.getUserList(--this.curPage)
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    editUser() {
      this.$refs.userEditForm.validate(valid => {
        if (valid) {
          const { id, email, mobile } = this.userEditForm
          this.$http
            .put(`/users/${id}`, {
              email,
              mobile
            })
            .then(res => {
              const { data, meta } = res.data
              if (meta.status === 200) {
                //  更新用户数据
                const editUser = this.userList.find(item => item.id === id)
                // editUser.email = data.email
                // editUser.mobile = data.mobile
                //  关闭对话框
                this.userEditDialog = false
              }
            })
        } else {
          console.log('failed')
          return false
        }
      })
    },

    showUserEditDialog(curUser) {
      this.userEditDialog = true
      // this.userEditForm = curUser
      for (var key in curUser) {
        this.userEditForm[key] = curUser[key]
      }
    },

    closeUserEditDialog() {
      this.$refs.userEditForm.resetFields()
    }
  },

  data() {
    return {
      userList: [],
      pageSize: 3,
      curPage: 1,
      total: 0,
      queryStr: '',
      //  用户添加对话框的展示
      userAddDialog: false,
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      userAddRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ]
      },

      //  控制编辑用户对话框的展示和隐藏
      userEditDialog: false,
      userEditForm: {
        id: -1,
        username: '',
        email: '',
        mobile: ''
      },
      userEditRules: {
        mobile: [
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }
        ]
      }
    }
  }
}
</script>

<style>
.user-breadcrumb {
  font-size: 18px;
  line-height: 40px;
  background-color: #d4dae0;
  padding-left: 10px;
  margin-bottom: 10px;
}
</style>
