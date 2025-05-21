<template>
  <div class="not-found-container">
    <h1>404 - 页面不存在</h1>
    <p>您访问的页面不存在或已被移除</p>
    <router-link to="/" class="home-link">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #ff4757;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.home-link {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #2980b9;
}
</style>
