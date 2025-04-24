export const barTagAnalysis = {
  title: {
    text: '题目标签分类统计',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['数组', '字符串', '树', '图', '动态规划', '排序', '查找', '数学'],
    axisLabel: {
      interval: 0,
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    name: '题目数量'
  },
  series: [
    {
      name: '题目数量',
      type: 'bar',
      barWidth: '60%',
      data: [45, 38, 32, 18, 25, 22, 30, 15],
      itemStyle: {
        color: function(params) {
          const colorList = ['#5fa0fa', '#67c23a', '#e6a23c', '#f56c6c', '#6f7ad3', '#8e44ad', '#16a085', '#c0392b'];
          return colorList[params.dataIndex];
        }
      },
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
};
