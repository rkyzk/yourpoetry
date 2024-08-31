import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Profile from "./Profile";
import { axiosReq } from "../../api/axiosDefaults";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Asset from "../../components/Asset";
import Alert from "react-bootstrap/Alert";

/**
 * Get the data of profiles specified by the filter statement.
 * Pass the data down to the Profile component so the individual
 * profile component can be structured.
 * Return the list of profiles.
 */
function ProfilesPage(props) {
  /** destructure the props. 'message' is what gets displayed
      when there's no matching profile */
  const { filter, message, page } = props;
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profiles, setProfiles] = useState({ results: [] });
  const [errMsg, setErrMsg] = useState("");

  /** When the component is mounted, profiles data will be fetched.
      and set to the variable 'profiles' so they can be passed down to
      the profile component.  */
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/?${filter}`);
        setProfiles(data);
        setHasLoaded(true);
      } catch (err) {
        setErrMsg("Something went wrong.  Please try again later.");
      }
    };
    setHasLoaded(false);
    fetchProfiles();
  }, [filter, setProfiles]);

  return (
    <Row>
      <Col lg={{ span: 8, offset: 2 }}>
        {page === "profilesPage" && (
          <h2 className="text-center">Poets I'm following</h2>
        )}
        {errMsg ? (
          <Alert key={errMsg} variant="warning" className="mt-3 text-center">
            {errMsg}
          </Alert>
        ) : hasLoaded ? (
          <>
            {profiles.results.length ? (
              <InfiniteScroll
                children={profiles.results.map((profile) => (
                  <Profile
                    key={profile.id}
                    {...profile}
                    imageSize={80}
                    page={page}
                    setProfiles={setProfiles}
                  />
                ))}
                dataLength={profiles.results.length}
                loader={<Asset spinner />}
                hasMore={!!profiles.next}
                next={() => fetchMoreData(profiles, setProfiles)}
              />
            ) : (
              <>
                {/* If no matching profiles are found, dislay the message. */}
                <p className="text-center">{message}</p>
              </>
            )}
          </>
        ) : (
          <Container>
            {/* Display the spinner before the data is loaded. */}
            <Asset spinner />
          </Container>
        )}
      </Col>
    </Row>
  );
}

export default ProfilesPage;
