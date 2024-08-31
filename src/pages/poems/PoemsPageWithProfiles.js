import React from "react";
import FeaturedProfiles from "../profiles/FeaturedProfiles";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PoemsPage from "../poems/PoemsPage";

/**
 * Return the content for "New Poems" and "Popular Poems."
 */
function PoemsPageWithProfiles({ page }) {
  /** startDate will hold the start date when filtering by date range */
  var startDate;
  /** stores filter */
  var filter;
  /** the heading */
  var heading;

  // For new poems page, filter poems by published in the past 14 days
  if (page === "newPoems") {
    // get the date 14 days ago in YYYY-MM-dd format
    startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
      .toISOString()
      .substring(0, 10);
    filter = `published=1&published_at__date__gte=${startDate}&ordering=-published_at`;
    heading = "New Poems (published in the past 14 days)";
  }
  /* For popular poems page, filter poems published in the past 30 days
     and order them by descending number of likes. */
  if (page === "popularPoems") {
    // get the date 30 days ago in YYYY-MM-dd format
    startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
      .toISOString()
      .substring(0, 10);
    filter = `published=1&published_at__date__gte=${startDate}&ordering=-likes_count`;
    heading = "Popular Poems (published in the past 30 days)";
  }

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <FeaturedProfiles mobile />
        <PoemsPage filter={filter} heading={heading} />
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <FeaturedProfiles />
      </Col>
    </Row>
  );
}

export default PoemsPageWithProfiles;
