import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import { useAlert } from "../../contexts/AlertContext";

/**
 * Get the profile data, display and edit form,
 * take in input entered by users, make a post request
 * to update the data.
 */
const ProfileEditForm = () => {
  /** get the logged in user's info */
  const currentUser = useCurrentUser();
  /** get the function to set the current user info */
  const setCurrentUser = useSetCurrentUser();
  /** get the profile id from the URL */
  const { id } = useParams();
  /** instantiate history object to store info on
      which URLs the user has visited. */
  const navigate = useNavigate();
  /** stores the info of uploaded image file. */
  const imageFile = useRef();
  const { showAlert } = useAlert();

  /** stores the profile data */
  const [profileData, setProfileData] = useState({
    display_name: "",
    about_me: "",
    favorites: "",
    image: "",
  });
  /** destructure the profileData object. */
  const { display_name, about_me, favorites, image } = profileData;
  /** stores erros */
  const [errors, setErrors] = useState({});

  /** When the component mounts, get the profile data from the backend
      and stores them in 'profileData' */
  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { display_name, about_me, favorites, image } = data;
          setProfileData({ display_name, about_me, favorites, image });
        } catch (err) {
          showAlert("Something went wrong.  Please try again.");
        }
      } else {
        /** in case the user is not the owner of the profile,
            redirect to "Home". */
        navigate("/");
      }
    };

    handleMount();
  }, [currentUser, navigate, id]);

  /**
   * Take in the data entered by the users and store them in 'profileData'.
   */
  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  /** Send the data entered by the user to the backend
      so the profile will be updated. */
  const handleSubmit = async (event) => {
    event.preventDefault();
    /** create a new form data instance */
    const formData = new FormData();
    /** stores the data entered by the user to formData */
    formData.append("display_name", display_name);
    formData.append("about_me", about_me);
    formData.append("favorites", favorites);

    /** If image file has been uploaded, store the data in 'formData' */
    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      /** sned the updated data to the backend */
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      /** set the profile image to the currentUser */
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      /** Go back to 'My Profile' page. */
      navigate(-1);
      showAlert("Your profile has been updated.");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>display name</Form.Label>
        <Form.Control
          as="textarea"
          value={display_name}
          onChange={handleChange}
          name="display_name"
          rows={1}
        />
      </Form.Group>
      {errors?.display_name?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Tell us a few things about yourself</Form.Label>
        <Form.Control
          as="textarea"
          value={about_me}
          onChange={handleChange}
          name="about_me"
          rows={6}
        />
      </Form.Group>
      {errors?.about_me?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>favorite poems/poets</Form.Label>
        <Form.Control
          as="textarea"
          value={favorites}
          onChange={handleChange}
          name="favorites"
          rows={6}
        />
      </Form.Group>
      {errors?.favorites?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
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
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container>
            <Form.Group>
              {image && (
                <figure>
                  <Image src={image} fluid />
                </figure>
              )}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.File
                id="image-upload"
                ref={imageFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setProfileData({
                      ...profileData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;
