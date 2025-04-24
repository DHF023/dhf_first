export const pieErrorAnalysis = {
  title: {
    text: '错题类型分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['概念理解错误', '计算错误', '审题错误', '公式记忆错误', '逻辑错误']
  },
  series: [
    {
      name: '错题类型',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {d}%'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: true
      },
      data: [
        { value: 45, name: '概念理解错误', itemStyle: { color: '#5fa0fa' } },
        { value: 25, name: '计算错误', itemStyle: { color: '#f56c6c' } },
        { value: 15, name: '审题错误', itemStyle: { color: '#e6a23c' } },
        { value: 10, name: '公式记忆错误', itemStyle: { color: '#67c23a' } },
        { value: 5, name: '逻辑错误', itemStyle: { color: '#909399' } }
      ]
    }
  ]
};
