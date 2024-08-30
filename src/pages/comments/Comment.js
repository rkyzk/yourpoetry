import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "../../styles/Comment.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import CommentEditForm from "./CommentEditForm";
import { axiosRes } from "../../api/axiosDefaults";

/**
 * Return Comment component.
 */
const Comment = (props) => {
  /** destructure props */
  const {
    profile_id,
    profile_image,
    owner,
    created_at,
    updated_at,
    content,
    id,
    setPoem,
    setComments,
  } = props;

  /** get info about the logged in user. */
  const currentUser = useCurrentUser();
  /** is_owner is set to true if the user is the owner. */
  const is_owner = currentUser?.username === owner;
  /** showEditForm will be set true if the edit form should be displayed. */
  const [showEditForm, setShowEditForm] = useState(false);

  /**
   * Delete comment in the backend.
   * Adjust the comment count in the front end.
   */
  const handleDeleteComment = async () => {
    try {
      // send request to delete the comment with the id.
      await axiosRes.delete(`/comments/${id}`);
      // set the comment count of the poem 1 less.
      setPoem((prevPoem) => ({
        results: [
          {
            ...prevPoem.results[0],
            comments_count: prevPoem.results[0].comments_count - 1,
          },
        ],
      }));
      // delete the comment from the comments array.
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <hr />
      <Card>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Card.Body className="align-self-center ml-2">
          <Row>
            <Col sm={5}>
              <span className={styles.Owner}>{owner}</span>
            </Col>
            {/* If the comment has been edited, label 'edited' */}
            {updated_at !== created_at ? (
              <Col sm={7}>
                <span className={`${styles.Time}`}>{created_at}</span>
                <span className={`${styles.Time} ml-3`}>edited</span>
              </Col>
            ) : (
              <Col sm={7}>
                <span className={`${styles.Time}`}>{created_at}</span>
              </Col>
            )}
          </Row>
          {/* If showEditForm is true, show the edit form. */}
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              profileImage={profile_image}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Card.Body>
        {/* Display three dots for the owner, if the edit form is not displayed. */}
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDeleteComment={handleDeleteComment}
          />
        )}
      </Card>
    </>
  );
};

export default Comment;
