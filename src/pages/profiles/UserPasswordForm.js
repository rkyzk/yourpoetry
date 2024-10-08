import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import { useAlert } from "../../contexts/AlertContext";

/**
 *
 */
const UserPasswordForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();
  /** stores the passwords */
  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  /** destructure the userData */
  const { new_password1, new_password2 } = userData;
  const [errors, setErrors] = useState({});
  const { showAlert } = useAlert();

  /** taken in the user input and set the new passwords to 'userData' */
  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  /** If 'cancel' is clicked, go back to "My Profile" page. */
  const handleCancel = () => {
    /** go back to "My Profile" */
    navigate(-1);
    showAlert("Update canceld.");
  };

  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      // redirect user if they are not the owner of this profile
      navigate("/");
    }
  }, [currentUser, navigate, id]);

  /** Make a post request to change the password. */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.post("/dj-rest-auth/password/change/", userData);
      /** redirect to "My Profile" */
      navigate(-1);
      showAlert("You password has been changed.");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>New password</Form.Label>
              <Form.Control
                placeholder="new password"
                type="password"
                value={new_password1}
                onChange={handleChange}
                name="new_password1"
              />
            </Form.Group>
            {errors?.new_password1?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Form.Group>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                placeholder="confirm new password"
                type="password"
                value={new_password2}
                onChange={handleChange}
                name="new_password2"
              />
            </Form.Group>
            {errors?.new_password2?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Olive}`}
              onClick={handleCancel}
            >
              cancel
            </Button>
            <Button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Olive}`}
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UserPasswordForm;
