import styles from "../styles/FooterComponent.module.css";

/**
 * Return Footer component with links to
 * facebook, twitter and instagram
 */
const FooterComponent = () => {
  return (
    <div className={`${styles.FooterBg} pt-2`}>
      <ul className={`${styles.SocialNW} d-flex justify-content-center`}>
        <li>
          <a
            href={"https://www.facebook.com"}
            target="_blank"
            rel="noreferrer"
            aria-label="Visit our facebook page (opens in a new tab)"
          >
            <i className={`${styles.SocialNW} fa-brands fa-facebook`}></i>
          </a>
        </li>
        <li>
          <a
            href={"https://www.twitter.com"}
            target="_blank"
            rel="noreferrer"
            aria-label="Visit our Twitter page (opens in a new tab)"
          >
            <i className={`${styles.SocialNW} fa-brands fa-twitter ml-2`}></i>
          </a>
        </li>
        <li>
          <a
            href={"https://www.instagram.com"}
            target="_blank"
            rel="noreferrer"
            aria-label="Visit our Instagram page (opens in a new tab)"
          >
            <i className={`${styles.SocialNW} fa-brands fa-instagram ml-2`}></i>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default FooterComponent;
