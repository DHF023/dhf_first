<template>
  <div class="rank">
    <div class="header">

    </div>
    <div class="main">

    </div>
  </div>
</template>

<script>
import { competitionProblems } from "@/data/competition-problems.js";

export default {
  name: 'rank',
  props: ['id'],
  data() {
    return {
      competitionProblems: competitionProblems,
    }
  },
  methods: {

  }
};
</script>

<style scoped>
.rank {
  min-height: 100vh;
  overflow: auto;
  margin-top: 10px;
  margin-bottom: 20px;
}

.header {

}

.main {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  min-height: 100vh;
  width: 60%;
  margin-left: 300px;
  margin-bottom: 50px;
}
</style>
