import React from "react";
import Container from "react-bootstrap/Container";
import styles from "../../styles/Contact.module.css";

/**
 * Return the content for Contact page.
 */
function Contact() {
  return (
    <Container className={styles.Contact}>
      <h2 className="text-center">Contact</h2>
      <p className="d-flex justify-content-center">
        If you have any inquiries, suggestions or concerns, write to us at
        admin@yourpoetry.com. We'll get back to you as soon as possible.
      </p>
    </Container>
  );
}

export default Contact;
