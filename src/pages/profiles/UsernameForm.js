import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import { useAlert } from "../../contexts/AlertContext";

/**  */
const UsernameForm = () => {
  /** stores username */
  const [username, setUsername] = useState("");
  /** stores errors */
  const [errors, setErrors] = useState({});
  /** stores data about which URLs the user has visited. */
  const navigate = useNavigate();
  /** get the id from the URL */
  const { id } = useParams();
  /** get the info of the current user */
  const currentUser = useCurrentUser();
  /** get the function to set current user info. */
  const setCurrentUser = useSetCurrentUser();
  const { showAlert } = useAlert();

  /** When the component is mounted, if the edit page
      belongs to the current user, set username. */
  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      /** If a wrong user is trying to access the edit page
          redirect to "Home" */
      navigate("/");
    }
  }, [currentUser, navigate, id]);

  /**
   * Make a put request to update the username in the backend.
   * Update the username in the currenUser object on the frontend.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put("/dj-rest-auth/user/", {
        username,
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      /** Go back to the previous page, "My Profile" */
      navigate(-1);
      showAlert("Your usename has been updated.");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container>
          <Form onSubmit={handleSubmit} className="my-2">
            <Form.Group>
              <Form.Label>Change username</Form.Label>
              <Form.Control
                placeholder="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Olive}`}
              onClick={() => navigate(-1)}
            >
              cancel
            </Button>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Olive}`}
              type="submit"
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;
