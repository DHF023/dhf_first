// chart.js
import * as echarts from 'echarts';

export function initChart(dom, option) {
    let myChart = echarts.init(dom);
    myChart.setOption(option);
    return myChart; // 返回图表实例，以便后续可能需要使用
}