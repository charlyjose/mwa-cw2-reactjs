import React, { useState } from "react"
import { Button, Card, Form } from 'react-bootstrap';
import SurveyService from "../../services/survey.service";
import AlertModal from "../modals/alert.component";

const QuestionView = ({ currentQuestion }) => {
    const [selectedOptionId, setSelectedOptionId] = useState(-1);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const vote = () => {
        if (selectedOptionId === -1) {
            setShowAlert(true);
            setAlertMessage("Please select an option to vote!");
        } else {
            SurveyService.vote(currentQuestion.id, selectedOptionId).then(
                (response) => {
                    if (response.status === 200) {
                        window.location.reload();
                    } else {
                        setShowAlert(true);
                        setAlertMessage(response.message);
                    }
                });
        }
    }

    return (
        <>
            <div>
                <Card style={{
                    width: '18rem',
                    backgroundColor: "#E6FEFF",
                    borderColor: "#00E4FF"
                }}>
                    <Card.Body>
                        <Card.Title>{currentQuestion.Text}</Card.Title>
                        <Form>
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="mb-3">
                                    <Form.Check
                                        type="radio"
                                        name="options"
                                        label={option.Text}
                                        onChange={() => setSelectedOptionId(option.id)}
                                    />
                                </div>
                            ))}
                        </Form>
                        <Button variant="primary" size="sm" onClick={vote}>
                            Vote
                        </Button>

                        {
                            showAlert ?
                                (<AlertModal show={showAlert} modalHandleClose={() => setShowAlert(false)} alertMessage={alertMessage} />)
                                : (
                                    <></>
                                )
                        }

                    </Card.Body>
                </Card>
                <br />
            </div>
        </>
    );
}

export default QuestionView;