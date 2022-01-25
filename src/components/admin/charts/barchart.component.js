import React, { Component } from "react";
import Chart from "react-google-charts";
import AlertModal from "../../modals/alert.component";
import SurveyService from "../../../services/survey.service";

export default class BarChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAlert: false,
      alertMessage: "",

      survey: [],
      data: [],
    }
  }

  componentDidMount() {
    SurveyService.getSurveyResponse().then(
      (response) => {
        this.setState({
          survey: response.data.survey,
        })

        // Populate data array with question and response
        let data = []
        data.push(['Question', 'Responses'])
        for (let i = 0; i < this.state.survey.length; i++) {
          data.push([this.state.survey[i].question, parseInt(this.state.survey[i].count)])
        }
        this.setState({
          data: data,
        })
      },
      (error) => {
        console.log(error)
        this.setState({ showAlert: true, alertMessage: "Error fetching survey" })
      }
    )
  }

  render() {
    return (
      <div className="container mt-5">
        <Chart
          width={'1000px'}
          height={'900px'}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={this.state.data}
          options={{
            title: 'Total Responses for each question',
            chartArea: { width: '50%' },
            isStacked: true,
            hAxis: {
              title: 'Total Response',
              minValue: 0,
            },
            vAxis: {
              title: 'Question',
            },
          }}
          rootProps={{ 'data-testid': '3' }}
        />

        {
          this.state.showAlert ?
            (<AlertModal show={this.state.showAlert} modalHandleClose={() => this.setState({showAlert: false})} alertMessage={this.state.alertMessage} />)
            : (
              <></>
            )
        }
      </div>
    )
  }
}
