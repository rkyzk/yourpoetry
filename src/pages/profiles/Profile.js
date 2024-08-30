import React from "react";
import styles from "../../styles/Profile.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import { axiosRes } from "../../api/axiosDefaults";
import { useSetFeaturedProfilesData } from "../../contexts/FeaturedProfilesDataContext";

/**
 * Return Profile component.
 * Depending on the page, return different elements.
 */
const Profile = (props) => {
  /** destructure props */
  const {
    id,
    user_id,
    owner,
    image,
    display_name,
    followers_count,
    poems_count,
    /** if the current user is following the profile,
        following_id will be present, otherwise 'none'. */
    following_id,
    imageSize = 55,
    created_at,
    about_me,
    favorites,
    mobile,
    featured,
    setProfiles,
    page,
  } = props;
  /** Get logged in user info */
  const currentUser = useCurrentUser();
  /** is_owner is set to True if the logged in user owns the profile. */
  const is_owner = currentUser?.username === owner;
  /** Get the function to set featured profiles data. */
  const setFeaturedProfilesData = useSetFeaturedProfilesData();

  /** Send a post request to make Follower object
      of the user and the followed profile.
      Adjust the followers count in the front end. */
  const handleFollow = async () => {
    try {
      /** create a Follower object in the backend to record which user followed
          which profile. */
      const { data } = await axiosRes.post("/followers/", {
        followed: user_id,
      });

      /** adjust the follower count in the profile component on the front end. */
      setProfiles &&
        setProfiles((prevProfiles) => ({
          ...prevProfiles,
          results: prevProfiles.results.map((profile) => {
            return profile.user_id === user_id
              ? {
                  ...profile,
                  followers_count: profile.followers_count + 1,
                  following_id: data.id,
                }
              : profile;
          }),
        }));
      /** adjust the followers count in the featured profiles component
          on the front end. */
      featured &&
        setFeaturedProfilesData((prevProfiles) => ({
          ...prevProfiles,
          results: prevProfiles.results.map((profile) => {
            return profile.user_id === user_id
              ? {
                  ...profile,
                  followers_count: profile.followers_count + 1,
                  following_id: data.id,
                }
              : profile;
          }),
        }));
    } catch (err) {
      console.log(err);
    }
  };

  /** Send a delete request of the Follower object
      of the user and the profile.
      Adjust the followers count in the front end. */
  const handleUnfollow = async () => {
    try {
      /** delete the Follower object in the backend. */
      await axiosRes.delete(`/followers/${following_id}`);
      /** on "Poets I'm following" page, remove the profile from the list. */
      page === "profilesPage" &&
        setProfiles((prevProfiles) => ({
          ...prevProfiles,
          results: prevProfiles.results.filter((profile) => {
            return profile.user_id !== user_id;
          }),
        }));
      /** on "Search Profiles" and individual profile pages,
          adjust the followers_count.  */
      (page === "search" || page === "profilePage") &&
        setProfiles((prevProfiles) => ({
          ...prevProfiles,
          results: prevProfiles.results.map((profile) => {
            return profile.user_id === user_id
              ? {
                  ...profile,
                  followers_count: profile.followers_count - 1,
                  following_id: null,
                }
              : profile;
          }),
        }));
      /** Adjust the followers_count in the featured profiles component. */
      featured &&
        setFeaturedProfilesData((prevProfiles) => ({
          ...prevProfiles,
          results: prevProfiles.results.map((profile) => {
            return profile.user_id === user_id
              ? {
                  ...profile,
                  followers_count: profile.followers_count - 1,
                  following_id: null,
                }
              : profile;
          }),
        }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className="mb-1">
      <Card.Body>
        {mobile ? (
          <>
            {/* In the featured profiles component on screen sizes below md,
                display the following */}
            <Row className={`${styles.Mobile} justify-content-center`}>
              <Link className={styles.ProfileLink} to={`/profiles/${id}`}>
                <Avatar src={image} height={45} />
                <div>
                  <p className={`ml-2 mb-0 ${styles.MobileName}`}>
                    {display_name}
                  </p>
                  <span className={`ml-2 ${styles.CountsText}`}>
                    {poems_count} poems
                  </span>
                </div>
              </Link>
            </Row>
          </>
        ) : featured ? (
          <>
            {/* In the featured profiles component for large screen,
                display the following. */}
            <Card className="align-items-center border-0">
              <Row>
                <Col xs={4}>
                  <Link className={styles.ProfileLink} to={`/profiles/${id}`}>
                    <Avatar src={image} height={imageSize} />
                  </Link>
                </Col>
                <Col xs={8}>
                  <Link className={styles.ProfileLink} to={`/profiles/${id}`}>
                    <h4 className={`${styles.FeaturedName}`}>{display_name}</h4>
                  </Link>
                  <span className={`${styles.ProfileText}`}>
                    {poems_count} poems
                  </span>
                  <span className={`${styles.ProfileText} ml-2`}>
                    {followers_count} followers
                  </span>
                </Col>
              </Row>
            </Card>
          </>
        ) : (
          <>
            {/* ProfilePage */}
            <Row style={{ height: "100px" }} className="pt-2">
              <Col xs={4}>
                <Avatar src={image} height={80} className={`${styles.Img}`} />
              </Col>
              {/* display the user info (the name, the date joinged etc)
                next to the avatar for screen sizes above 490px
                className ProfileInfo won't be displayed below 490px. */}
              <Col xs={7} className={styles.ProfileInfo}>
                <Link className={styles.ProfileLink} to={`/profiles/${id}`}>
                  <h3 className={`${styles.ProfileName}`}>{display_name}</h3>
                </Link>
                <p className={`${styles.ProfileText} mb-0`}>
                  Member since {created_at}
                </p>
                <span className={`${styles.ProfileText}`}>
                  {poems_count} poems
                </span>
                <span className={`${styles.ProfileText} ml-2`}>
                  {followers_count} followers
                </span>
              </Col>
              <Col>{is_owner && <ProfileEditDropdown id={id} />}</Col>
            </Row>
            <div className="mt-3 ml-3">
              {/* display the user info (the name, the date joinged etc)
                below the avatar for screen sizes below 490px
                className ProfileInfoSmall will be displayed only below 490px. */}
              <div className={`${styles.ProfileInfoSmall}`}>
                <Link className={styles.ProfileLink} to={`/profiles/${id}`}>
                  <h3 className={`${styles.ProfileName}`}>{display_name}</h3>
                </Link>
                <p className={`${styles.ProfileText} mb-0`}>
                  Member since {created_at}
                  <br />
                  {poems_count} poems
                  <span className="ml-2">{followers_count} followers</span>
                </p>
              </div>
              {/* On individual profile page, display about me and favorites. */}
              {page === "profilePage" && about_me && about_me !== "null" && (
                <p className={`${styles.ProfileLabel} mt-3`}>
                  <span className="text-muted">About me:</span>
                  <br />
                  {about_me}
                </p>
              )}
              {page === "profilePage" && favorites && favorites !== "null" && (
                <p className={`${styles.ProfileLabel} mt-3`}>
                  <span className="text-muted">My favorites:</span>
                  <br />
                  {favorites}
                </p>
              )}
            </div>
          </>
        )}
        {/* if not mobile, if logged in, and if the owner of the profile,
            display 'You!' tag.  If not the owner, display follow/unfollow
            buttons.  (If following_id exists, display 'unfollow,' otherwise
            'follow.'  */}
        {!mobile &&
          currentUser &&
          (is_owner ? (
            <div className="mt-2">
              <span className={`${btnStyles.You} ml-4`}>You!</span>
            </div>
          ) : following_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.LightBlue} mt-2 ml-4`}
              onClick={() => handleUnfollow()}
            >
              unfollow
            </Button>
          ) : (
            <Button
              className={`${btnStyles.Button} ${btnStyles.Black} mt-2 ml-4`}
              onClick={() => handleFollow()}
            >
              follow
            </Button>
          ))}
      </Card.Body>
    </Card>
  );
};

export default Profile;
