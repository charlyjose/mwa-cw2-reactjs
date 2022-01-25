import React, { useState } from "react"
import { Button, Card } from 'react-bootstrap';
import EditQuestion from "./edit-question.component"
import DeleteQuestion from "./delete-question.component"
import QuestionService from "../../services/question.service";
import AlertModal from "../modals/alert.component";

const QuestionView = ({ currentQuestion }) => {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const hideEditModal = () => {
        setShowEdit(false);
    }

    const showEditModal = () => {
        setShowEdit(true);
    }

    const showDeleteModal = () => {
        setShowDelete(true);
    }

    const hideDeleteModal = () => {
        setShowDelete(false);
    }

    const handleError = () => {
        if (!showAlert) {
            window.location.reload();
        }
    }

    const deleteQuestion = () => {
        const id = currentQuestion.id
        // Call Question Delete API
        QuestionService.deleteQuestion(id)
            .then((response) => {
                if (response.status === 200) {
                    currentQuestion = null;
                }
                else {
                    setShowAlert(true);
                    setAlertMessage(response.message);
                    handleError();
                }
                window.location.reload();
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <Card style={{
                width: '18rem',
                backgroundColor: "#E6FEFF",
                borderColor: "#00E4FF"
            }}>
                <Card.Body>
                    <Card.Title>{currentQuestion.Text}</Card.Title>

                    {(showEdit) ? (
                        <EditQuestion
                            show={showEdit}
                            currentQuestion={currentQuestion}
                            editHandleClose={hideEditModal}
                        />
                    ) : (
                        <></>
                    )}


                    <DeleteQuestion
                        show={showDelete}
                        deleteHandleClose={hideDeleteModal}
                        deleteContent={deleteQuestion}
                    />

                    <Button variant="primary" size="sm" onClick={showEditModal}>
                        Edit
                    </Button>

                    <span> </span>
                    <Button variant="danger" size="sm" onClick={showDeleteModal}>
                        Delete
                    </Button>

                    <Card.Text>
                        <span className="badge bg-primary" >Total Responses: {currentQuestion.responses}</span>
                    </Card.Text>

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
    );
}

export default QuestionView;