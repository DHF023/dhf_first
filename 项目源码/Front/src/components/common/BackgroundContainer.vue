<template>
  <div class="background-container">
    <img :src="currentBg" class="background-image" />
    <div class="bg-switch">
      <el-button
        v-for="(bg, index) in backgrounds"
        :key="index"
        circle
        @click="changeBackground(index)"
      >
        <img :src="bg" class="bg-thumbnail" />
      </el-button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "BackgroundContainer",
  data() {
    return {
      currentBg: require('@/assets/【哲风壁纸】帆船-海景-海洋.png'),
      backgrounds: [
        require('@/assets/【哲风壁纸】帆船-海景-海洋.png'),
        require('@/assets/【哲风壁纸】复古汽车-夏天-户外.png'),
        require('@/assets/【哲风壁纸】街景-风景.png'),
        require('@/assets/【哲风壁纸】清晨-雪山.png')
      ],
      timer: null,
      interval: 5000 // 5秒切换一次
    };
  },
  mounted() {
    this.startAutoChange();
  },
  beforeDestroy() {
    this.stopAutoChange();
  },
  methods: {
    changeBackground(index) {
      this.currentBg = this.backgrounds[index];
    },
    startAutoChange() {
      this.stopAutoChange();
      this.timer = setInterval(() => {
        const currentIndex = this.backgrounds.indexOf(this.currentBg);
        const nextIndex = (currentIndex + 1) % this.backgrounds.length;
        this.changeBackground(nextIndex);
      }, this.interval);
    },
    stopAutoChange() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
};
</script>

<style scoped>
.background-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease;
  background-color: #87CEEB;
}

.bg-switch {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.bg-thumbnail {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
