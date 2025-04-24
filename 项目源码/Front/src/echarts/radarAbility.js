export const radarAbility = {
  title: {
    text: '个人能力图谱',
    left: 'center'
  },
  tooltip: {},
  radar: {
    indicator: [
      { name: '基础知识', max: 100 },
      { name: '算法能力', max: 100 },
      { name: '编程实践', max: 100 },
      { name: '调试能力', max: 100 },
      { name: '代码规范', max: 100 },
      { name: '学习速度', max: 100 }
    ],
    radius: '65%',
    splitNumber: 4,
    axisName: {
      color: '#333'
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(255, 255, 255, 0.5)']
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(200, 200, 200, 0.5)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(200, 200, 200, 0.5)'
      }
    }
  },
  series: [{
    name: '能力评估',
    type: 'radar',
    data: [
      {
        value: [85, 78, 90, 82, 88, 75],
        name: '当前能力',
        areaStyle: {
          color: 'rgba(95, 160, 250, 0.4)'
        },
        lineStyle: {
          width: 2,
          color: '#5fa0fa'
        },
        symbolSize: 6,
        label: {
          show: true,
          formatter: function(params) {
            return params.value;
          }
        }
      },
      {
        value: [95, 90, 95, 90, 95, 90],
        name: '目标能力',
        areaStyle: {
          color: 'rgba(250, 200, 88, 0.2)'
        },
        lineStyle: {
          width: 2,
          type: 'dashed',
          color: '#fac858'
        },
        symbolSize: 6
      }
    ]
  }],
  legend: {
    data: ['当前能力', '目标能力'],
    bottom: 10
  }
};
