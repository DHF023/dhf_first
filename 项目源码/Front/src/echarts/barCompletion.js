export const barCompletion = {
  title: {
    text: '题目完成情况',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['选择题', '填空题', '判断题', '编程题', '综合题'],
    axisLabel: {
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    max: 100,
    axisLabel: {
      formatter: '{value}%'
    }
  },
  series: [
    {
      name: '完成率',
      type: 'bar',
      data: [85, 72, 90, 65, 78],
      itemStyle: {
        color: function(params) {
          const colorList = ['#5fa0fa', '#67c23a', '#e6a23c', '#f56c6c', '#909399'];
          return colorList[params.dataIndex];
        }
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%'
      }
    }
  ]
};
