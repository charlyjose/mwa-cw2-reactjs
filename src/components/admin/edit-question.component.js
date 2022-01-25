import React, { Component } from "react"
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import AlertModal from "../modals/alert.component";
import QuestionService from '../../services/question.service';

export default class EditQuestion extends Component {
  constructor(props) {
    super(props)
    this.onChangeQuestion = this.onChangeQuestion.bind(this)

    this.deleteOption = this.deleteOption.bind(this)
    this.onChangeOption = this.onChangeOption.bind(this)
    this.addOption = this.addOption.bind(this)
    this.onChangeNewOption = this.onChangeNewOption.bind(this)

    this.update = this.update.bind(this)


    this.state = {
      currentQuestion: this.props.currentQuestion,
      show: this.props.show,
      editHandleClose: this.props.editHandleClose,
      option: '',
      options: this.props.currentQuestion.options,

      showAlert: false,
      alertMessage: '',
      submitted: false
    }
  }


  update(e) {
    e.preventDefault()

    const question = this.state.currentQuestion
    const options = this.state.options.map(option => option.Text)

    QuestionService.updateQuestion(question.id, question.Text, options)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            submitted: true
          })
          window.location.reload()
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

  onChangeQuestion(e) {
    const currentQuestion = this.state.currentQuestion
    currentQuestion.Text = e.target.value
    this.setState({
      currentQuestion: currentQuestion
    })
  }

  deleteOption = (optionId) => {
    // Delete options only if the option there are three or more options
    if (this.state.options.length > 2) {
      // Delete the option with the given id
      const options = this.state.options.filter((option) => {
        return option.id !== optionId
      })

      this.setState({
        options: options
      })
    }
    // If there are less than three options, show an alert
    else {
      this.setState({
        showAlert: true,
        alertMessage: 'You must have at least two options'
      })
    }
  }

  onChangeOption = (e, optionId) => {
    // Find the option with the given id
    const currentOption = this.state.options.find(option => option.id === optionId)
    currentOption.Text = e.target.value

    // Update the option with the given id
    const options = this.state.options.map((option) => {
      if (option.id === optionId) {
        return currentOption
      }
      return option
    })

    this.setState({
      options: options
    })
  }

  onChangeNewOption = (e) => {
    this.setState({
      option: e.target.value
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
    if (this.state.options.find(option => option.Text === this.state.option)) {
      this.setState({
        showAlert: true,
        alertMessage: 'Each option should be unique'
      });
      return
    }

    // Add the option to options
    else {
      // Id as a random number
      const options = this.state.options
      options.push({ id: Math.floor(Math.random() * 1000) + 1, Text: this.state.option })

      this.setState({
        options: options
      })
    }
  }

  render() {
    return (
      <>
        <Modal
          backdrop="static"
          keyboard={false}
          show={this.state.show}
          onHide={this.state.editHandleClose}
          centered >

          <Modal.Header closeButton>
            <Modal.Title>Update Question</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default">Question</InputGroup.Text>
              <FormControl
                aria-label="Question"
                aria-describedby="inputGroup-sizing-default"
                defaultValue={this.state.currentQuestion.Text}
                onChange={e => this.onChangeQuestion(e)}
              />
            </InputGroup>

            {(this.state.options.length > 0) ? (
              <div>
                <InputGroup.Text id="inputGroup-sizing-default">Options</InputGroup.Text>
                {this.state.options.map((option, index) => {
                  return (
                    <InputGroup className="mb-3">
                      <FormControl
                        aria-label="Option"
                        aria-describedby="inputGroup-sizing-default"
                        defaultValue={option.Text}
                        onChange={e => this.onChangeOption(e, option.id)}
                        key={index}
                      />

                      <button onClick={() => this.deleteOption(option.id)} className="btn btn-danger">
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
                onChange={this.onChangeNewOption}
              />
              <button onClick={this.addOption} className="btn btn-outline-success btn-sm">
                Add Option
              </button>
            </InputGroup>


          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.state.editHandleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={e => this.update(e)}>Save</Button>
          </Modal.Footer>
        </Modal>


        {
          this.state.showAlert ?
            (<AlertModal show={this.state.showAlert} modalHandleClose={() => this.setState({ showAlert: false })} alertMessage={this.state.alertMessage} />)
            : (
              <></>
            )
        }
      </>

    )
  }
}
