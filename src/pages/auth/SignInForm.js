import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import { setTokenTimestamp } from "../../utils/utils";
import { useRedirect } from "../../hooks/useRedirect";
import { useAlert } from "../../contexts/AlertContext";
import flowers from "../../assets/media/flowers.png";

/**
 * Return the sign in form.
 */
function SignInForm() {
  /** get the function to set current user info to a variable. */
  const setCurrentUser = useSetCurrentUser();
  /** Redirect logged in users. */
  useRedirect("loggedIn");
  /** 'signInData' will store data entered by users  */
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  /** destructure 'signInData' */
  const { username, password } = signInData;
  /** stores info about which pages the user has visited. */
  const navigate = useNavigate();
  /** stores errors */
  const [errors, setErrors] = useState({});
  // import alert context and setters for alert & show
  const { showAlert } = useAlert();

  /** set data entered by users to 'signInData'. */
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Post the data entered by users to the backend.
   * If posting is successful, set 'currentUser' the data
   * of logged in user.  Set the token time stamp and
   * redirect to "Home."
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("dj-rest-auth/login/", signInData);
      // set the data of the logged in user to 'currentUser'.
      setCurrentUser(data.user);
      // set token time statmp.
      setTokenTimestamp(data);
      showAlert(`Successfully signed in as ${data.user.username}`);
      navigate("/");
    } catch (err) {
      // Set errors in 'errors'
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className="pt-4">
      <Col className="d-none d-lg-flex justify-content-end" lg={{ span: 6 }}>
        <img className={styles.FlowerImg} src={flowers} alt="wild flowers" />
      </Col>
      <Col
        className="my-auto pl-lg-3 d-lg-flex justify-content-lg-start"
        lg={{ span: 6, offset: 0 }}
        md={{ span: 8, offset: 2 }}
      >
        <Container style={{ width: "360px" }}>
          <h1 className={styles.Header}>sign in</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username" className="mt-1">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Form.Group controlId="password" className="mt-1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Large} ${btnStyles.Olive} mt-2`}
              type="submit"
            >
              Sign in
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
          <Link className={`${styles.Link} mt-2`} to="/signup">
            Don't have an account?{" "}
            <span className={styles.TextColor}>Sign up now!</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
}

export default SignInForm;
