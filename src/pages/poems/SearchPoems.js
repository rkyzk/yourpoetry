import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import PoemsPage from "../poems/PoemsPage";
import btnStyles from "../../styles/Button.module.css";
import Alert from "react-bootstrap/Alert";

/**
 * Display input boxes for search poems.
 * Display search results when 'search' is clicked.
 */
function SearchPoems() {
  // variables for storing input made by users
  const [filterValues, setFilterValues] = useState({
    author: "",
    title: "",
    keyword: "",
    category: "choose...",
    pub_date: "choose...",
  });
  // destructure the filterValues object
  const { author, title, keyword, category, pub_date } = filterValues;
  // variable for storing the final search filter statement
  const [searchFilter, setSearchFilter] = useState("");
  // variable for storing the filter statement
  var filter = "published=1";

  /* If input is made for author, title, keyword and category,
     replace empty spaces at the beginning and the end
     and add to variable 'filter' */
  author.trim() &&
    (filter = filter + `&owner__profile__display_name__icontains=${author}`);
  title.trim() && (filter = filter + `&title__icontains=${title}`);
  keyword.trim() && (filter = filter + `&search=${keyword}`);
  category !== "choose..." && (filter = filter + `&category=${category}`);
  // if published date range is specified, add it to variable 'filter'
  if (pub_date !== "choose...") {
    /** stores the start date for the date range */
    let startDate = "";
    switch (pub_date) {
      case "past 14 days":
        // get the date in YYYY-MM-dd format and set it to startDate.
        startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
          .toISOString()
          .substring(0, 10);
        break;
      case "past 30 days":
        startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
          .toISOString()
          .substring(0, 10);
        break;
      case "past 90 days":
        startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90)
          .toISOString()
          .substring(0, 10);
        break;
      default:
        startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365)
          .toISOString()
          .substring(0, 10);
        break;
    }
    // set the date range to filter
    filter = filter + `&published_at__date__gte=${startDate}`;
  }

  /** set user input to 'filterValues' */
  const handleChange = (event) => {
    setFilterValues({
      ...filterValues,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * If 'search' button is clicked, set the setFilter
   * so the search will begin.
   */
  const handleSearch = () => setSearchFilter(filter);

  return (
    <>
      <Container>
        <h2>
          Search Poems
          <i className="fas fa-search ml-4 mt-2" />
        </h2>
        <Form onSubmit={(event) => event.preventDefault()}>
          <Row>
            <Col lg={4}>
              <Form.Group controlid="author">
                <Form.Label>author contains:</Form.Label>
                <Form.Control
                  value={author}
                  onChange={handleChange}
                  type="text"
                  name="author"
                  className="mr-sm-2"
                  placeholder="author"
                />
              </Form.Group>
            </Col>
            <Col lg={4}>
              <Form.Group controlid="title">
                <Form.Label>title contains:</Form.Label>
                <Form.Control
                  value={title}
                  name="title"
                  onChange={handleChange}
                  type="text"
                  className="mr-sm-2"
                  placeholder="title"
                />
              </Form.Group>
            </Col>
            <Col lg={4}>
              <Form.Group controlid="keyword">
                <Form.Label>title/content contains:</Form.Label>
                <Form.Control
                  value={keyword}
                  name="keyword"
                  onChange={handleChange}
                  type="text"
                  className="mr-sm-2"
                  placeholder="keyword"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={4}>
              <Form.Group contorlid="category">
                <Form.Label className="my-1 mr-2">category</Form.Label>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  id="category"
                  name="category"
                  value={category}
                  onChange={handleChange}
                  custom
                >
                  <option>choose...</option>
                  <option>nature</option>
                  <option>love</option>
                  <option>people</option>
                  <option>humor</option>
                  <option>haiku</option>
                  <option>other</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col lg={4}>
              <Form.Label className="my-1 mr-2">Published date</Form.Label>
              <Form.Group>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  name="pub_date"
                  value={pub_date}
                  id="pub_date"
                  onChange={handleChange}
                  custom
                >
                  <option>choose...</option>
                  <option>past 14 days</option>
                  <option>past 30 days</option>
                  <option>past 90 days</option>
                  <option>past one year</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <Button
          onClick={handleSearch}
          className={`${btnStyles.Button} ${btnStyles.Olive}`}
        >
          search
        </Button>
      </Container>
      <Container className="mt-3">
        {/* If 'search' is clicked but nothing or only spaces are entered,
            display an alert.  If an input has been made, display search results */}
        {searchFilter === "published=1" ? (
          <Alert variant="warning">Please enter at least one field</Alert>
        ) : (
          searchFilter !== "" && <PoemsPage filter={searchFilter} />
        )}
      </Container>
    </>
  );
}

export default SearchPoems;
