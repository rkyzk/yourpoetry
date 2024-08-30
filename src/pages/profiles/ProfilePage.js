import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Profile from "./Profile";
import Poem from "../poems/Poem";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Alert from "react-bootstrap/Alert";

/**
 * Return the content of individual profile pages.
 * Get the data of the profile and the poems written by
 * the profile owner, and set them to variables and pass
 * them down to Profile and Poem component.
 */
function ProfilePage() {
  /** get the profile id from the URL */
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.pk === parseInt(id);
  const [hasLoaded, setHasLoaded] = useState(false);
  /** stores data of a profile */
  const [profileData, setProfileData] = useState({ results: [] });
  /** store data of poems written by the profile owner  */
  const [profilePoems, setProfilePoems] = useState({ results: [] });
  /** stores error messages. */
  const [errMsg, setErrMsg] = useState("");

  /** When the component is mounted, get the data of the profile and the poems,
      set them to variables. */
  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: profile }, { data: profilePoems }] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/poems/?owner__profile=${id}`),
        ]);
        setProfileData({ results: [profile] });
        setProfilePoems(profilePoems);
        setHasLoaded(true);
      } catch (err) {
        setErrMsg("Something went wrong.  Please try again later");
      }
    };
    handleMount();
  }, [id]);

  /** structure the list of poems */
  const poems = (
    <>
      <h4 className="my-3">Poems by this Writer</h4>
      {/* if the data has loaded, display poems using the infinite scroll. */}
      {hasLoaded ? (
        profilePoems.results.length ? (
          <InfiniteScroll
            children={profilePoems.results.map((poem) => (
              <Poem key={poem.id} {...poem} setPoems={setProfilePoems} />
            ))}
            dataLength={profilePoems.results.length}
            loader={<Asset spinner />}
            hasMore={!!profilePoems.next}
            next={() => fetchMoreData(profilePoems, setProfilePoems)}
          />
        ) : (
          <p>No published poems yet</p>
        )
      ) : (
        <Asset />
      )}
    </>
  );

  return (
    <Col md={{ span: 8, offset: 2 }}>
      {is_owner && <h2 className="text-center">My Profile</h2>}
      {errMsg ? (
        <Alert key={errMsg} variant="warning" className="mt-3">
          {errMsg}
        </Alert>
      ) : (
        <>
          <Profile
            {...profileData.results[0]}
            page={"profilePage"}
            setProfiles={setProfileData}
          />
          {poems}
        </>
      )}
    </Col>
  );
}

export default ProfilePage;
