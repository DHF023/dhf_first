export const lineWeek = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [5, 7, 4, 4, 3, 6, 10],
            type: 'line',
            smooth: true
        }
    ]
};