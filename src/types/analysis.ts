export type AnalysisError = {
  name: string;
  message: string;
  traceback: string;
};

// A line chart: multiple labeled lines, each is an array of [x, y] points
export type LineChart = {
  type: 'line';
  title: string;
  x_label: string;
  y_label: string;
  elements: Array<{
    label: string;          // name of the line
    points: [number, number][]; // series of points
  }>;
};

// A bar chart: bars grouped by "group" (e.g., year) and labeled by "label" (e.g., category)
export type BarChart = {
  type: 'bar';
  title: string;
  x_label: string;
  y_label: string;
  elements: Array<{
    label: string;   // x-axis category
    group: string;   // grouping key (e.g. series name)
    value: number;   // bar height
  }>;
};
// A pie chart: slices defined by label + angle/value
export type PieChart = {
  type: 'pie';
  title: string;
  elements: Array<{
    label: string;
    angle: number;   // portion of the pie - can be any numeric value
  }>;
};

// A scatter chart: multiple scatter series, each is a set of points
export type ScatterChart = {
  type: 'scatter';
  title: string;
  x_label: string;
  y_label: string;
  elements: Array<{
    label: string;            // series name
    points: [number, number][]; // scatter points
  }>;
};

// Union of all chart types
export type ChartData = LineChart | BarChart | PieChart | ScatterChart;

// Extend AnalysisResult to optionally include charts/images
export type AnalysisResult = {
  text?: string;
  png?: string;         // base64-encoded PNG for static charts (optional)
  chart?: ChartData;    // structured chart info for interactive rendering
  error?: AnalysisError;  // populated when Python execution fails
};
