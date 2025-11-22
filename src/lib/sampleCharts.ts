import type { ChartData } from '@/types/analysis';

// Sample chart data for testing
export const sampleLineChart: ChartData = {
  type: 'line',
  title: 'Sales Trend Over Time',
  x_label: 'Month',
  y_label: 'Revenue ($)',
  elements: [
    {
      label: 'Product A',
      points: [[1, 1200], [2, 1900], [3, 3000], [4, 2800], [5, 3200], [6, 4100]],
    },
    {
      label: 'Product B',
      points: [[1, 800], [2, 1100], [3, 1500], [4, 2200], [5, 2800], [6, 3400]],
    },
  ],
};

export const sampleBarChart: ChartData = {
  type: 'bar',
  title: 'Regional Sales Comparison',
  x_label: 'Region',
  y_label: 'Sales',
  elements: [
    { label: 'North', group: 'Q1', value: 120 },
    { label: 'North', group: 'Q2', value: 150 },
    { label: 'South', group: 'Q1', value: 90 },
    { label: 'South', group: 'Q2', value: 110 },
    { label: 'East', group: 'Q1', value: 140 },
    { label: 'East', group: 'Q2', value: 160 },
    { label: 'West', group: 'Q1', value: 100 },
    { label: 'West', group: 'Q2', value: 130 },
  ],
};

export const samplePieChart: ChartData = {
  type: 'pie',
  title: 'Market Share by Category',
  elements: [
    { label: 'Electronics', angle: 35 },
    { label: 'Clothing', angle: 25 },
    { label: 'Food & Beverage', angle: 20 },
    { label: 'Home & Garden', angle: 15 },
    { label: 'Others', angle: 5 },
  ],
};

export const sampleScatterChart: ChartData = {
  type: 'scatter',
  title: 'Price vs Quantity Analysis',
  x_label: 'Price ($)',
  y_label: 'Quantity Sold',
  elements: [
    {
      label: 'Category A',
      points: [[10, 120], [15, 95], [20, 80], [25, 65], [30, 50]],
    },
    {
      label: 'Category B',
      points: [[10, 100], [15, 110], [20, 105], [25, 95], [30, 85]],
    },
  ],
};
