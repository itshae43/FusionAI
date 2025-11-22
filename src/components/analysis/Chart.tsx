'use client';

import ReactECharts from 'echarts-for-react';
import type { ChartData } from '@/types/analysis';

export function Chart({ chart }: { chart: ChartData }) {
  const getChartOption = () => {
    switch (chart.type) {
      case 'line':
        return {
          title: {
            text: chart.title,
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            top: 30,
            data: chart.elements.map(el => el.label),
          },
          xAxis: {
            type: 'value',
            name: chart.x_label,
            nameLocation: 'middle',
            nameGap: 30,
          },
          yAxis: {
            type: 'value',
            name: chart.y_label,
            nameLocation: 'middle',
            nameGap: 40,
          },
          series: chart.elements.map(el => ({
            name: el.label,
            type: 'line',
            data: el.points,
            smooth: true,
          })),
        };

      case 'bar':
        // Group data by label (x-axis categories)
        const categories = [...new Set(chart.elements.map(el => el.label))];
        const groups = [...new Set(chart.elements.map(el => el.group))];
        
        return {
          title: {
            text: chart.title,
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            top: 30,
            data: groups,
          },
          xAxis: {
            type: 'category',
            data: categories,
            name: chart.x_label,
            nameLocation: 'middle',
            nameGap: 30,
          },
          yAxis: {
            type: 'value',
            name: chart.y_label,
            nameLocation: 'middle',
            nameGap: 40,
          },
          series: groups.map(group => ({
            name: group,
            type: 'bar',
            data: categories.map(cat => {
              const item = chart.elements.find(el => el.label === cat && el.group === group);
              return item ? item.value : 0;
            }),
          })),
        };

      case 'pie':
        return {
          title: {
            text: chart.title,
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            top: 50,
          },
          series: [
            {
              type: 'pie',
              radius: '60%',
              center: ['50%', '60%'],
              data: chart.elements.map(el => ({
                name: el.label,
                value: el.angle,
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        };

      case 'scatter':
        return {
          title: {
            text: chart.title,
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            top: 30,
            data: chart.elements.map(el => el.label),
          },
          xAxis: {
            type: 'value',
            name: chart.x_label,
            nameLocation: 'middle',
            nameGap: 30,
          },
          yAxis: {
            type: 'value',
            name: chart.y_label,
            nameLocation: 'middle',
            nameGap: 40,
          },
          series: chart.elements.map(el => ({
            name: el.label,
            type: 'scatter',
            data: el.points,
            symbolSize: 8,
          })),
        };

      default:
        return {};
    }
  };

  return (
    <div className="border border-gray-200 bg-white rounded-lg p-4">
      <ReactECharts 
        option={getChartOption()} 
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
