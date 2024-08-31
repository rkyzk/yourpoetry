import styles from "./App.module.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/poems/Home";
import NavBar from "./components/NavBar";
import NavBarSecond from "./components/NavBarSecond";
import Container from "react-bootstrap/Container";
import SignInForm from "./pages/auth/SignInForm";
import SignUpForm from "./pages/auth/SignUpForm";
import PoemCreateForm from "./pages/poems/PoemCreateForm";
import PoemPage from "./pages/poems/PoemPage";
import PoemEditForm from "./pages/poems/PoemEditForm";
import PoemsPage from "./pages/poems/PoemsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import ProfilePage from "./pages/profiles/ProfilePage";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfilesPage from "./pages/profiles/ProfilesPage";
import PoemsPageWithProfiles from "./pages/poems/PoemsPageWithProfiles";
import Contact from "./pages/other_pages/Contact";
import SearchPoems from "./pages/poems/SearchPoems";
import SearchProfiles from "./pages/profiles/SearchProfiles";
import FooterComponent from "./components/FooterComponent";
import PoemsByCategories from "./pages/poems/PoemsByCategories";
import AlertComponent from "./components/AlertComponent";
import ModalComponent from "./components/ModalComponent";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id;

  return (
    <div className={styles.App}>
      <NavBar />
      <NavBarSecond />
      <AlertComponent />
      <Container className={styles.Main}>
        <Routes>
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/poems/create" element={<PoemCreateForm />} />
          <Route path="/poems/:id" element={<PoemPage />} />
          <Route path="/poems/:id/edit" element={<PoemEditForm />} />
          <Route path="/profiles/:id" element={<ProfilePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search-poems" element={<SearchPoems />} />
          <Route path="/search-profiles" element={<SearchProfiles />} />
          <Route
            path="/my-poems"
            element={
              <PoemsPage
                filter={`owner__profile=${profile_id}&ordering=-created_at&`}
                message="You haven't wrriten any poems yet."
                heading="My Poems"
              />
            }
          />
          <Route
            path="/liked"
            element={
              <PoemsPage
                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
                heading="Poems I like"
                message="You haven't liked any poems yet."
              />
            }
          />
          <Route
            path="/new-poems"
            element={<PoemsPageWithProfiles page={"newPoems"} />}
          />
          <Route
            path="/popular-poems"
            element={<PoemsPageWithProfiles page={"popularPoems"} />}
          />
          <Route path="/poems-by-categories" element={<PoemsByCategories />} />
          <Route
            exact
            path="/profiles/:id/following"
            element={
              <ProfilesPage
                filter={`owner__followed__owner__profile=${profile_id}&ordering=-owner__following__created_at&`}
                message="You haven't followed anyone."
                page={"profilesPage"}
              />
            }
          />
          <Route path="/profiles/:id/edit" element={<ProfileEditForm />} />
          <Route
            path="/profiles/:id/edit/username"
            element={<UsernameForm />}
          />
          <Route
            path="/profiles/:id/edit/password"
            element={<UserPasswordForm />}
          />
          <Route element={<h1>Page not found</h1>} />
        </Routes>
      </Container>
      <FooterComponent />
      <ModalComponent />
    </div>
  );
}

export default App;
