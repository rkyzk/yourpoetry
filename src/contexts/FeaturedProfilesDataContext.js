import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";

const FeaturedProfilesDataContext = createContext();
const SetFeaturedProfilesDataContext = createContext();

export const useFeaturedProfilesData = () =>
  useContext(FeaturedProfilesDataContext);
export const useSetFeaturedProfilesData = () =>
  useContext(SetFeaturedProfilesDataContext);

/**
 * Return featured profiles data.
 */
export const FeaturedProfilesDataProvider = ({ children }) => {
  const currentUser = useCurrentUser();
  /** stores data about featured profiles. */
  const [featuredProfilesData, setFeaturedProfilesData] = useState({
    results: [],
  });
  /** stores an error message. */
  const [errMessage, setErrMessage] = useState("");

  /** Get data about featured profiles and store them in 'featuredProfilesData' */
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/profiles/?featured_flag=1");
        setFeaturedProfilesData(data);
      } catch (err) {
        setErrMessage("There was an error. The profiles couldn't be loaded.");
      }
    };
    handleMount();
  }, [currentUser]);

  return (
    <FeaturedProfilesDataContext.Provider
      value={{ featuredProfilesData, errMessage }}
    >
      <SetFeaturedProfilesDataContext.Provider value={setFeaturedProfilesData}>
        {children}
      </SetFeaturedProfilesDataContext.Provider>
    </FeaturedProfilesDataContext.Provider>
  );
};
