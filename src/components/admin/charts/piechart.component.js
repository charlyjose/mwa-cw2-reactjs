import React, { Component } from 'react'
import Chart from 'react-google-charts'

const pieOptions = {
  title: 'Question',
  pieHole: 0.4,
}

class PieChart extends Component {
  render() {
    pieOptions.title = this.props.title
    return (
      <div className="container mt-5">
        <Chart
          width={'600px'}
          height={'320px'}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={this.props.pieData}
          options={pieOptions}
          rootProps={{ 'data-testid': '3' }}
        />
      </div>
    )
  }
}

export default PieChart