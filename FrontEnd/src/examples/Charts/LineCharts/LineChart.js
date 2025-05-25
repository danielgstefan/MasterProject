

import React from "react";
import ReactApexChart from "react-apexcharts";

class LineChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: props.lineChartData || [],
      chartOptions: props.lineChartOptions || {},
    };
  }

  componentDidMount() {
    const { lineChartData, lineChartOptions } = this.props;

    if (lineChartData && lineChartOptions) {
      this.setState({
        chartData: lineChartData,
        chartOptions: lineChartOptions,
      });
    }
  }

  render() {
    const { chartData, chartOptions } = this.state;

    if (!chartData || !chartOptions) {
      return null;
    }

    return (
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type="area"
        width="100%"
        height="100%"
      />
    );
  }
}

export default LineChart;
