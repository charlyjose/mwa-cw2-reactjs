import React, { Component } from "react"
import { InputGroup, FormControl } from 'react-bootstrap';
import QuestionService from '../../services/question.service';
import AlertModal from "../modals/alert.component";

export default class AddQuestion extends Component {
    constructor(props) {
        super(props)
        this.onChangeQuestion = this.onChangeQuestion.bind(this)
        this.addQuestion = this.addQuestion.bind(this)
        this.newQuestion = this.newQuestion.bind(this)

        this.onChangeOption = this.onChangeOption.bind(this)
        this.addOption = this.addOption.bind(this)
        this.deleteOption = this.deleteOption.bind(this)

        this.reset = this.reset.bind(this)
        this.fillValues = this.fillValues.bind(this)

        this.state = {
            id: null,
            question: '',
            option: '',
            options: [],

            showAlert: false,
            alertMessage: '',
            submitted: false
        }
    }

    onChangeQuestion(e) {
        this.setState({
            question: e.target.value
        })
    }

    onChangeOption(e) {
        this.setState({
            option: e.target.value,
        })
    }

    addOption(e) {
        e.preventDefault()

        if (this.state.option === '') {
            this.setState({
                showAlert: true,
                alertMessage: 'Please enter an option'
            });
            return
        }

        // Each option should be unique
        if (this.state.options.includes(this.state.option)) {
            this.setState({
                showAlert: true,
                alertMessage: 'Each option should be unique'
            });
            return
        }

        else {
            this.setState({
                options: [...this.state.options, this.state.option]
            })
        }
    }

    reset() {
        this.setState({
            question: '',
            option: '',
            options: [],
        })
    }

    fillValues() {
        this.reset()

        this.setState({
            question: 'Question',
            option: 'Option',
        })
    }

    addQuestion() {
        const { question, options } = this.state

        // if (question === '' || options.length === 0) {
        if (question === '' || options.length < 2) {
            this.setState({
                showAlert: true,
                alertMessage: 'Please enter a question and at least two options'
            });
            return
        }

        QuestionService.addQuestion(question, options)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        submitted: true
                    })
                }
                else {
                    this.setState({
                        showAlert: true,
                        alertMessage: response.message
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    showAlert: true,
                    alertMessage: error.message
                })
            })
    }

    newQuestion() {
        this.setState({
            id: null,
            question: '',
            option: '',
            options: [],

            submitted: false
        })
    }

    deleteOption(currentOptionIndex) {
        this.setState({
            options: this.state.options.filter((_, index) => index !== currentOptionIndex)
        })
    }


    render() {
        return (
            <div className="submit-form">
                {this.state.submitted ? (
                    <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="col col-lg-2"></div>
                            <div className="col-md-5">
                                <h4>Question submitted successfully!</h4>
                                <button className="btn btn-success" onClick={this.newQuestion}>
                                    Add New Question
                                </button>
                                <div className="col col-lg-2"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="container">
                            <div className="row justify-content-md-center">
                                <div className="col col-lg-2"></div>
                                <div className="col-md-5">
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="inputGroup-sizing-default">Question</InputGroup.Text>
                                        <FormControl
                                            aria-label="Question"
                                            aria-describedby="inputGroup-sizing-default"
                                            defaultValue={this.state.question}
                                            onChange={this.onChangeQuestion}
                                        />
                                    </InputGroup>

                                    {(this.state.options.length > 0) ? (
                                        <div>
                                            <InputGroup.Text id="inputGroup-sizing-default">Options</InputGroup.Text>
                                            {this.state.options.map((item, index) => {
                                                return (
                                                    <InputGroup className="mb-3">
                                                        <FormControl
                                                            aria-label="Option"
                                                            aria-describedby="inputGroup-sizing-default"
                                                            defaultValue={item}
                                                            onChange={this.onChangeOption}
                                                            key={index}
                                                        />
                                                        <button onClick={() => this.deleteOption(index)} className="btn btn-danger">
                                                            Delete
                                                        </button>
                                                    </InputGroup>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <></>
                                    )}


                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="inputGroup-sizing-default">Option</InputGroup.Text>
                                        <FormControl
                                            aria-label="Option"
                                            aria-describedby="inputGroup-sizing-default"
                                            defaultValue={this.state.option}
                                            onChange={this.onChangeOption}
                                        />
                                        <button onClick={this.addOption} className="btn btn-outline-success btn-sm">
                                            Add Option
                                        </button>
                                    </InputGroup>

                                    <button onClick={this.addQuestion} className="btn btn-success">
                                        Add Question
                                    </button>
                                </div>
                                <div className="col col-lg-2">
                                    <button onClick={this.fillValues} className="btn btn-outline-success btn-sm">
                                        Fill Values
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {
                    this.state.showAlert ?
                        (<AlertModal show={this.state.showAlert} modalHandleClose={() => this.setState({ showAlert: false })} alertMessage={this.state.alertMessage} />)
                        : (
                            <></>
                        )
                }
            </div>
        )
    }
}
