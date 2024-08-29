import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import styles from "../styles/NavBarSecond.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { useLocation } from "react-router-dom";

/**
 * Return the second navigation bar (one on the left side of the page).
 * The component will be displayed on all pages except for
 * signup and signin pages.
 * Render different nav link items depending on the logged in status.
 */
const NavBarSecond = () => {
  /** stores info on the logged in user. */
  const currentUser = useCurrentUser();
  /** get the URL of the current page. */
  const { pathname } = useLocation();
  /** expanded tells wheather the menu bar is expanded/not.
      setExpanded will change the expanded value.
      ref stores info of the element if inside the menu has been clicked */
  const [poemsMenu, setPoemsMenu] = useState(false);
  /** On signin and singup pages set hide true so this component won't appear. */
  let hide = pathname === "/signin" || pathname === "/signup";
  const [expanded, setExpanded] = useState(false);

  /** close poems menu */
  const handleClosePoemsMenu = () => {
    setTimeout(() => {
      setPoemsMenu(false);
      document.removeEventListener("mouseup", handleClosePoemsMenu);
    }, 100);
  };

  /** if the poems menu is closed, open it. */
  const handlePoemsMenu = () => {
    if (poemsMenu === false) {
      setPoemsMenu(true);
      /** add an eventlistener so the poems menu closes 
        after the next click (anywhere on the page) */
      document.addEventListener("mouseup", handleClosePoemsMenu);
    }
  };

  /** close the burger menu */
  const handleCloseBurger = (event) => {
    if (
      event.target.id !== "poems-dropdown" &&
      event.target.id !== "dropdown-icon"
    ) {
      setTimeout(() => {
        setExpanded(false);
        document.removeEventListener("mouseup", handleCloseBurger);
      }, 100);
    }
  };

  /** open the burger menu if it's closed. */
  const handleToggle = () => {
    if (expanded === false) {
      setExpanded(true);
      // add an event listener after the next click
      document.addEventListener("mouseup", handleCloseBurger);
    }
  };

  return (
    !hide && (
      <Navbar
        expanded={expanded}
        className={styles.NavBarSecond}
        expand="md"
        fixed="top"
      >
        <Navbar.Toggle
          aria-controls="basic-navbar-second-nav"
          onClick={() => handleToggle()}
        >
          <i className="fa-solid fa-bars"></i>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-second-nav">
          <Nav className={`${styles.NavToggle} text-left`}>
            <button
              className={`${styles.NavLink} ${styles.PoemsDropdown}`}
              id="poems-dropdown"
              onClick={() => handlePoemsMenu()}
            >
              Poems
              <i
                className="fa fa-angle-down ml-2"
                aria-hidden="true"
                id="dropdown-icon"
              ></i>
            </button>
            {poemsMenu && (
              <div className={`${styles.PoemsMenu} py-2`}>
                <div>
                  <NavLink
                    className={styles.NavDropdownItem}
                    to="/new-poems"
                    id="new-poems"
                  >
                    New Poems
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    className={styles.NavDropdownItem}
                    to="/popular-poems"
                    id="popular-poems"
                  >
                    Popular Poems
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    className={styles.NavDropdownItem}
                    to="/poems-by-categories"
                    id="poems-by-cat"
                  >
                    Poems by Categories
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    className={styles.NavDropdownItem}
                    to="/search-poems"
                    id="search-poems"
                  >
                    Search Poems
                  </NavLink>
                </div>
              </div>
            )}
            {/* if user is logged in, display the link 'Write Poems' */}
            {currentUser && (
              <NavLink
                className={`${styles.NavLink} ${styles.NavItems} mt-2`}
                to="/poems/create"
              >
                Write Poems
              </NavLink>
            )}
            <NavLink
              className={`${styles.NavLink} ${styles.NavItems} mt-2`}
              to="/search-profiles"
            >
              Search Profiles
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  );
};

export default NavBarSecond;
