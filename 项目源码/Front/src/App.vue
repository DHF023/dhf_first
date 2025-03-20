<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
document.body.style.overflow = 'hidden'; // 或 'scroll' 等其他值
</script>
<style>
@media screen and (max-width: 768px) {
  .el-form-item__label {
    width: 100% !important;
    text-align: left !important;
  }
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>