import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ProfilesPage from "./ProfilesPage";

/**
 * Take in the search query entered by the user
 * and display a list of profiles that match the query.
 */
function SearchProfiles() {
  /** stores query input by the user */
  const [query, setQuery] = useState("");
  /** 'search' will be set to true one second after
       a query has been entered. */
  const [search, setSearch] = useState(false);

  /**
   * Set search true if the user has entered a query
   * and hasn't changed the input for a second
   * (in order to prevent the search from running before
   * the user has finished typing.)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      query.trim() !== "" && setSearch(true);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <Row className="h-100">
      <Col className="p-2">
        <h3 className="text-center">Search Profiles</h3>
        <Row>
          <Col
            md={{ span: 6, offset: 3 }}
            sm={{ span: 8, offset: 2 }}
            xs={{ span: 10 }}
          >
            <Form className="mb-3" onSubmit={(event) => event.preventDefault()}>
              <Form.Control
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                className="mr-sm-2"
                placeholder="name contains..."
              />
            </Form>
          </Col>
          <Col xs={1}>
            <i className={`fas fa-search mt-2`} />
          </Col>
        </Row>
        {/* Look for profiles that match the query only
            if 'search' is set true and query has a content. */}
        {search && query && (
          <ProfilesPage
            filter={`search=${query}`}
            message="No profiles found with the name."
            page={"search"}
          />
        )}
      </Col>
    </Row>
  );
}

export default SearchProfiles;
