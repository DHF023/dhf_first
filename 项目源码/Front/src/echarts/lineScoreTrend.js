export const lineScoreTrend = {
  title: {
    text: '考试成绩趋势',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>得分: {c}分'
  },
  xAxis: {
    type: 'category',
    data: ['第一次月考', '期中考试', '第二次月考', '期末考试'],
    axisLabel: {
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: {
      formatter: '{value}分'
    }
  },
  series: [{
    name: '考试成绩',
    type: 'line',
    data: [78, 85, 82, 88],
    smooth: true,
    lineStyle: {
      width: 3,
      color: '#5fa0fa'
    },
    itemStyle: {
      color: '#5fa0fa'
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: 'rgba(95, 160, 250, 0.3)'
        }, {
          offset: 1,
          color: 'rgba(95, 160, 250, 0.1)'
        }]
      }
    },
    markLine: {
      silent: true,
      data: [{
        type: 'average',
        name: '平均分'
      }],
      lineStyle: {
        color: '#f56c6c'
      }
    }
  }]
};
