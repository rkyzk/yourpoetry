import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useAlert } from "../../contexts/AlertContext";
import axios from "axios";
import { useRedirect } from "../../hooks/useRedirect";
import tree from "../../assets/media/tree.jpg";

/**
 * Return sign up form.
 */
const SignUpForm = () => {
  /** Redirect logged in users. */
  useRedirect("loggedIn");
  /** stores info about which pages the user has visited. */
  const navigate = useNavigate();
  // import alert context and setters for alert & show
  const { showAlert } = useAlert();
  /** registerData will store data entered by users. */
  const [registerData, setRegisterData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  /** destructure 'registerData' */
  const { username, password1, password2 } = registerData;
  /** stores errors */
  const [errors, setErrors] = useState({});

  /**
   * Set the data entered by users to
   * 'registerData.'
   */
  const handleChange = (event) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Send the data entered by users to the backend.
   * Redirect the user to signin page.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("hi");
    try {
      await axios.post("dj-rest-auth/registration/", registerData);
      showAlert("Your account has been made.");
      navigate("/signin");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Row>
      <Col className="d-none d-lg-flex justify-content-end" lg={{ span: 6 }}>
        <img className="TreeImg" src={tree} alt="tree" />
      </Col>
      <Col
        className="my-auto pl-lg-3 d-lg-flex justify-content-lg-start"
        lg={{ span: 6, offset: 0 }}
        md={{ span: 8, offset: 2 }}
      >
        <Container style={{ width: "360px" }}>
          <h1 className={styles.Header}>sign up</h1>
          <Form
            onSubmit={handleSubmit}
            style={{ textAlign: "center", marginBottom: "5px" }}
          >
            <Form.Group controlId="username">
              <Form.Label className="d-none">username</Form.Label>
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
              <Alert variant="warning" key={idx} className="mt-1">
                {message}
              </Alert>
            ))}
            <Form.Group controlId="password1" className="mt-1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password1?.map((message, idx) => (
              <Alert variant="warning" key={idx} className="mt-1">
                {message}
              </Alert>
            ))}
            <Form.Group controlId="password2" className="mt-1">
              <Form.Label className="d-none">Confirm password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Confirm password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password2?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Large} ${btnStyles.Olive} mt-2`}
              type="submit"
            >
              Sign up
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
          <Link className={styles.Link} to="/signin">
            Already have an account?{" "}
            <span className={styles.TextColor}>Sign in</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
};

export default SignUpForm;
