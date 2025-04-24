export const pieDifficulty = {
  title: {
    text: '题目难度分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: '10%',
    data: ['简单', '中等', '困难', '挑战']
  },
  series: [
    {
      name: '难度分布',
      type: 'pie',
      radius: '60%',
      center: ['40%', '50%'],
      data: [
        { value: 45, name: '简单', itemStyle: { color: '#67c23a' } },
        { value: 30, name: '中等', itemStyle: { color: '#e6a23c' } },
        { value: 15, name: '困难', itemStyle: { color: '#f56c6c' } },
        { value: 10, name: '挑战', itemStyle: { color: '#909399' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        formatter: '{b}: {d}%'
      },
      labelLine: {
        smooth: 0.2,
        length: 10,
        length2: 20
      }
    }
  ]
};
