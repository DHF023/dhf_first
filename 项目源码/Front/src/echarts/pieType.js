export const pieType = {
  title: {
    text: '题目类型分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['选择题', '判断题', '填空题']
  },
  series: [
    {
      name: '题目类型',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 335, name: '选择题' },
        { value: 310, name: '判断题' },
        { value: 234, name: '填空题' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};
