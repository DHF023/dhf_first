export const pieDifficulty = {
    title: {
        text: '不同难度题目完成情况',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
                { value: 49, name: '入门' },
                { value: 23, name: '普及-' },
                { value: 15, name: '普及/提高-' },
                { value: 12, name: '普及+/提高' },
                { value: 9, name: '提高+/省选-' },
                { value: 5, name: '省选/NOI-' },
                { value: 1, name: 'NOI/NOI+/CTSC' },
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