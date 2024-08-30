import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import styles from "../../styles/PoemCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useAlert } from "../../contexts/AlertContext";

/**
 * Display the poem to the user and let them
 * update the title, content and category.
 * Send the API the updated data
 * returns Form
 */
function PoemEditForm() {
  const [errors, setErrors] = useState({});
  // poemData will store poem data entered by users
  const [poemData, setPoemData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const { title, content, category } = poemData;
  // variable 'published' tells if the poem has been published.
  const [published, setPublished] = useState(false);
  // 'publish' will be set true, if user decides to publish the poem
  const [publish, setPublish] = useState(false);
  const navigate = useNavigate();
  // get id from the URL
  const { id } = useParams();
  // set flash message
  var msg = "The change has been saved";
  const { showAlert } = useAlert();

  useEffect(() => {
    /** Get the data of the poem from the backend and display it on the edit form. */
    const handleMount = async () => {
      try {
        // get poem data from the backend
        const { data } = await axiosReq.get(`/poems/${id}`);
        // destructure the poem data
        const { title, content, category, is_owner, published } = data;
        // if the poem has been published, set published true
        published && setPublished(true);
        /* if the current user is the owner, request the API to update the poem
           otherwise redirect to "Home" */
        is_owner ? setPoemData({ title, content, category }) : navigate("/");
      } catch (err) {
        showAlert("Somethings went wrong. Please try again.");
      }
    };
    handleMount();
  }, [navigate, id]);

  /* Set data entered by users to variable 'poemData' */
  const handleChange = (event) => {
    setPoemData({
      ...poemData,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Send data entered by users to the backend
   * to update the poem.
   */
  const handleSubmit = async (event) => {
    // prevent the form from being submitted.
    event.preventDefault();
    // instantiate FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    /* If the poem was already published,
       or if it has just been published, set published true */
    (publish || published) && formData.append("published", true);
    // If the poem has been newly published, set the following message.
    publish && (msg = "Your poem has been published.");

    try {
      // Send the new data to the backend to update the poem.
      await axiosReq.put(`/poems/${id}`, formData);
      // redirect to the pome page.
      navigate(`/poems/${id}`);
      showAlert(msg);
    } catch (err) {
      // if error is not 401, set error messages
      err.response?.status !== 401 && setErrors(err.response?.data);
    }
  };

  const textFields = (
    <div className="ml-2">
      <h2>Revise your Poem</h2>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          name="content"
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          className={`${styles.Category} ml-3`}
          name="category"
          value={category}
          onChange={handleChange}
          custom
        >
          <option>nature</option>
          <option>love</option>
          <option>people</option>
          <option>humor</option>
          <option>haiku</option>
          <option>other</option>
        </Form.Control>
      </Form.Group>
      {errors?.category?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Olive}`}
        type="submit"
      >
        save
      </Button>
      {/* If not pusbliehd, display 'publish' button. */}
      {!published && (
        <Button
          className={`${btnStyles.Button} ${btnStyles.Olive} ml-2`}
          onClick={() => setPublish(true)}
          type="submit"
        >
          publish
        </Button>
      )}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Olive} ml-2`}
        onClick={() => navigate(-1)}
      >
        cancel
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <div>{textFields}</div>
      </Container>
    </Form>
  );
}

export default PoemEditForm;
