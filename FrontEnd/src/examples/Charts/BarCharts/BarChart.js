

import React, { Component } from "react";
import Chart from "react-apexcharts";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.barChartData || [],
      chartOptions: props.barChartOptions || {},
    };
  }

  componentDidMount() {
    const { barChartData, barChartOptions } = this.props;

    if (barChartData && barChartOptions) {
      this.setState({
        chartData: barChartData,
        chartOptions: barChartOptions,
      });
    }
  }

  render() {
    const { chartData, chartOptions } = this.state;

    if (!chartData || !chartOptions) {
      return null;
    }

    return (
      <Chart
        options={chartOptions}
        series={chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    );
  }
}

export default BarChart;
