export const barSubject = {
  title: {
    text: '各科错误率对比',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: '{b}<br/>错误率: {c}%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    max: 100,
    axisLabel: {
      formatter: '{value}%'
    }
  },
  yAxis: {
    type: 'category',
    data: ['数据结构', '算法设计', '操作系统', '计算机网络', '数据库'],
    axisLabel: {
      interval: 0,
      rotate: 0
    }
  },
  series: [
    {
      name: '错误率',
      type: 'bar',
      data: [18, 25, 12, 15, 10],
      itemStyle: {
        color: function(params) {
          const colorList = ['#f56c6c', '#e6a23c', '#5fa0fa', '#67c23a', '#909399'];
          return colorList[params.dataIndex];
        }
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{c}%'
      }
    }
  ]
};
