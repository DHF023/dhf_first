export const lineAccuracy = {
  title: {
    text: '正确率趋势',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}%'
    }
  },
  series: [
    {
      name: '正确率',
      type: 'line',
      data: [85, 82, 83, 87, 88, 85, 90],
      smooth: true,
      lineStyle: {
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
      }
    }
  ]
};
