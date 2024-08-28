import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Asset from "../../components/Asset";
import Profile from "./Profile";
import styles from "../../styles/FeaturedProfiles.module.css";
import { useFeaturedProfilesData } from "../../contexts/FeaturedProfilesDataContext";

/**
 * Get featured profiles data from FeaturedProfilesDataContext.js
 * and display them.
 */
const FeaturedProfiles = ({ mobile }) => {
  const { featuredProfilesData, errMessage } = useFeaturedProfilesData();
  return (
    <Container className={`${styles.Mobile} ${mobile && "d-lg-none mb-3"}`}>
      <h3 className={`${styles.Heading} text-center`}>Featured profiles</h3>
      {featuredProfilesData.results.length ? (
        <>
          {/* For screen sizes below 768px, display the profiles
              side to side and give 'mobile' props.
              For screen size 768px or above, give 'featured' props. */}
          {mobile ? (
            <Row>
              {featuredProfilesData.results.map((profile) => (
                <Col key={profile.id}>
                  <Profile {...profile} mobile />
                </Col>
              ))}
            </Row>
          ) : (
            featuredProfilesData.results.map((profile) => (
              <Profile key={profile.id} {...profile} imageSize={55} featured />
            ))
          )}
        </>
      ) : errMessage ? (
        <Alert variant="warning">{errMessage}</Alert>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default FeaturedProfiles;
