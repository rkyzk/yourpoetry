import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/CommentCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";

/**
 * Return comment edit form.
 * Display the current comment and let users
 * update the content.
 * Update the comment in the backend and in the frontend.
 */
function CommentEditForm(props) {
  /** destructure props */
  const { id, content, setShowEditForm, setComments } = props;
  /** stores the content dislayed on the page */
  const [formContent, setFormContent] = useState(content);

  /** set the value entered by users to 'formContent' */
  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  /**
   * Send comment data to the backend.
   * Replace the comment with the updated one
   * in the array storing comments for the front end.
   */
  const handleSubmit = async (event) => {
    // Prevent the form from being submitted.
    event.preventDefault();
    try {
      // Make a put request to update the comment
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });
      // update the comment in the comments array in the frontend.
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                content: formContent.trim(),
                updated_at: "now",
              }
            : comment;
        }),
      }));
      // hide the edit form.
      setShowEditForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button
          className={`${btnStyles.Black} ${styles.Button}`}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </button>
        <button
          className={`${btnStyles.Black} ${styles.Button}`}
          disabled={!content.trim()}
          type="submit"
        >
          save
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;
