<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
  >
    <span>{{ message }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"><span style="color: #333">{{ cancelText }}</span></el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    onConfirm: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      loading: false
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    handleClose(done) {
      if (this.loading) return
      done()
    },
    async handleConfirm() {
      this.loading = true
      try {
        await this.onConfirm()
        this.visible = false
      } catch (error) {
        console.error('Confirm action failed:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
