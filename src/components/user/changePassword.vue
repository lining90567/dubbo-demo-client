<template>
  <el-dialog title="修改密码" :visible.sync="dialogVisible" width="560px" 
    @open="handleDialogOpen()" v-loading="loading">
    <div slot="title" class="dialog-header">修改密码</div>
    <el-form :model="userModel" :rules="rules" 
      ref="changePasswordForm" label-width="80px" label-position="right" size="small">
      <el-form-item label="用户名">
        <el-col :span="16"><el-input disabled v-model="userModel.name"></el-input></el-col>
      </el-form-item>
      <el-form-item label="登录名">
        <el-col :span="16"><el-input disabled v-model="userModel.loginName"></el-input></el-col>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-col :span="16">
          <el-input type="password" ref="password" v-model="userModel.password" auto-complete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-col :span="16">
          <el-input type="password" v-model="userModel.checkPassword" auto-complete="off"></el-input>
        </el-col>
      </el-form-item>        
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleDialogClose()">取 消</el-button>
      <el-button type="primary" size="small" @click="submitForm('changePasswordForm')">确 定</el-button>
    </span>    
  </el-dialog>
</template>

<script>
import { changePassword } from '@/api/user'

export default {
  name: "change-password",
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入密码'));
      } else {
        if (this.userModel.checkPassword !== '') {
          this.$refs.changePasswordForm.validateField('checkPassword');
        }
        callback()
      }
    }
    var validateCheckPassword = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userModel.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      userModel: {
        id: 0,
        name: '',
        loginName: ''
      },
      dialogVisible: false,
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateCheckPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.doChangePassword()
        } else {
          console.log("error submit!!")
          return false;
        }
      });
    },
    doChangePassword() {
      this.loading = true
      changePassword(this.userModel.id, this.userModel.password)
      .then(response => {
        this.loading = false
        this.dialogVisible = false
      })
      .catch(error => {
        console.log(error.response ? error.response : error.message)
        this.loading = false
        this.$message({
          showClose: true,
          message: '出错了，请按F12查看浏览器日志。',
          type: 'error'
        })         
      })
    },  
    handleDialogClose() {
      this.dialogVisible = false  
    },
    handleDialogOpen() {
      this.$nextTick(() => {
        this.$refs['changePasswordForm'].clearValidate()
        this.$refs['password'].focus()
      })
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$on('openChangePasswordDialog', function(user) {
        this.userModel = user
        this.dialogVisible = true        
      })
    });
  }
};
</script>

<style lang="scss">
.el-dialog {
  text-align: left;
}
.dialog-header {
  width: 100%;
  font-weight: bold;
  padding-bottom: 8px;
  border-bottom: solid 1px #eee;
}
</style>



