/*!

=========================================================
* GDS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

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
