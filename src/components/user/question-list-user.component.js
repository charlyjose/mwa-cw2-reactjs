import React, { Component } from "react"
import { Button } from "react-bootstrap"
import { ArrowRepeat } from 'react-bootstrap-icons'
import QuestionView from "./question-view-user.component"
import SurveyService from '../../services/survey.service';
import QuestionService from '../../services/question.service';

export default class QuestionListUser extends Component {
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

            questions: [],
            options: [],
        }
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

    componentDidMount() {
        SurveyService.getQuestionsNotVoted().then(
            (response) => {
                this.setState({
                    questions: response.data.questions,
                })
            },
            (error) => {
                console.log(error)
            }
        )
    }

    refreshData() {
        this.setState({
            currentQuestion: null,
            currentIndex: -1,
        })
    }

    setActiveQuestion(question, index) {
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
                                    <h4>Questions <Button variant="outline-light" style={{ color: "black" }} onClick={this.reload}><ArrowRepeat color="black"></ArrowRepeat>&nbsp; Reload</Button></h4>
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
                        <QuestionView currentQuestion={currentQuestion} />
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
