import React, { Component } from "react"
import { Button } from "react-bootstrap"
import { ArrowRepeat } from 'react-bootstrap-icons'
import QuestionView from "./question-view-admin.component"
import QuestionService from '../../services/question.service';
import SurveyService from "../../services/survey.service";
import PieChart from "../admin/charts/piechart.component"

export default class QuestionListAdmin extends Component {
    constructor(props) {
        super(props)
        this.refreshData = this.refreshData.bind(this)
        this.setActiveQuestion = this.setActiveQuestion.bind(this)

        this.showEditModal = this.showEditModal.bind(this)
        this.hideEditModal = this.hideEditModal.bind(this)
        this.showDeleteModal = this.showDeleteModal.bind(this)
        this.hideDeleteModal = this.hideDeleteModal.bind(this)

        this.simulateNetworkRequest = this.simulateNetworkRequest.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.reload = this.reload.bind(this)

        this.state = {
            currentQuestion: null,
            currentIndex: -1,
            searchTerm: "",
            showEdit: false,
            showDelete: false,
            isLoading: false,

            currentOptionResponses: [],
            showSurvey: false,

            questions: [],
            options: [],
        }
    }

    componentDidMount() {
        QuestionService.getAllQuestions().then(
            (response) => {
                this.setState({
                    questions: response.data.consulations.Questions,
                })
            },
            (error) => {
                console.log(error)
            }
        )
    }

    simulateNetworkRequest() {
        let promise = new Promise((resolve) => setTimeout(resolve, 2000))
        this.setState({ isLoading: false })
        return promise
    }

    handleClick = () => {
        this.setState({ isLoading: true })
        this.simulateNetworkRequest()
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    reload = () => {
        window.location.reload(false)
    }

    showEditModal = () => {
        this.setState({ showEdit: true });
    }

    hideEditModal = () => {
        this.setState({ showEdit: false });
    }

    showDeleteModal = () => {
        this.setState({ showDelete: true });
    }

    hideDeleteModal = () => {
        this.setState({ showDelete: false });
    }

    refreshData() {
        this.setState({
            currentQuestion: null,
            currentIndex: -1,
        })
    }

    setActiveQuestion(selectedQuestion, index) {
        const question = selectedQuestion
        // Call Options API
        QuestionService.getQuestionOptions(question.id).then(
            (response) => {
                question.options = response.data.Options
                this.setState({
                    currentQuestion: question,
                    currentIndex: index
                })
            }
        )

        SurveyService.getTotalResponses(question.id).then(
            (response) => {
                question.responses = response.data.responses
                this.setState({
                    currentQuestion: question,
                    currentIndex: index
                })
            }
        )

        // get responses data for current select question
        SurveyService.getQuestionResponse(question.id).then(
            (response) => {
                // create list of options with their responses
                const answers = response.data.Answers
                let optionResponses = [['Option', 'Votes']]
                let counter = 0
                // loop through each answer and add to optionResponses
                answers.forEach(answer => {
                    // get option Text from options list
                    let optionText = this.state.currentQuestion.options.find(option => option.id === answer.id).Text
                    optionResponses.push([optionText, parseInt(answer.count)])
                    // if answer count is greater than 0, show survey
                    counter += answer.count > 0 ? (counter + 1) : 0
                })

                // if counter is greater than 0, show survey
                this.setState({
                    showSurvey: counter > 0 ? true : false,
                })

                question.optionResponses = optionResponses

                this.setState({
                    currentQuestion: question,
                    currentIndex: index,
                    currentOptionResponses: optionResponses
                })
            }
        )
    }

    render() {
        const { currentQuestion, currentIndex } = this.state
        const questions = this.state.questions

        return (
            <div className="list row">
                <div className="col-md-6">
                    <div className="row align-items-start">
                        {questions.length > 0 ? (
                            <>
                                <div className="col-md-6">
                                    <h4>Questions <Button variant="outline-light" style={{ color: "black" }} onClick={this.reload}>
                                        <ArrowRepeat color="black"></ArrowRepeat>&nbsp; Reload</Button>
                                    </h4>
                                </div>
                                <div className="col-md-3">
                                </div>

                            </>
                        ) : (
                            <div className="col-md-6">
                                <h4>No Questions</h4>
                            </div>
                        )}
                    </div>

                    <ul className="list-group"
                        style={{
                            maxHeight: "750px",
                            marginBottom: "10px",
                            overflowY: "scroll"
                        }} >

                        {questions &&
                            questions.map((question, index) => (
                                <li
                                    className={
                                        "list-group-item list-group-item-action " +
                                        (index === currentIndex ? " active" : "")
                                    }
                                    style={{
                                        backgroundColor: (index === currentIndex ? "#E6FEFF" : "white"),
                                        color: "#000",
                                        borderColor: "#00E4FF"
                                    }}
                                    onClick={() => this.setActiveQuestion(question, index)}
                                    key={index} >

                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">{question.Text}</h5>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>

                <div className="col-md-6">
                    {currentQuestion ? (
                        <>
                            <QuestionView currentQuestion={currentQuestion} />
                            {this.state.showSurvey ? (
                                <PieChart pieData={this.state.currentOptionResponses} title={currentQuestion.Text} />
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <div>
                            <br />
                            {questions.length > 0 ? (
                                <p>Please click on a Question...</p>
                            ) : (<></>)}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
