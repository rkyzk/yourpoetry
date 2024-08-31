import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { axiosReq } from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ModalComponent.module.css";
import btnStyles from "../styles/Button.module.css";
import { useModal } from "../contexts/ModalContext";
import { useAlert } from "../contexts/AlertContext";

/**
 * Return Confirmation modal.
 */
const ModalComponent = () => {
  const { objId, showModal, hideModal } = useModal();

  /** history of visited pages */
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  /** Create Modal text */
  let modalText = `Are you sure you want to delete your poem?
                   You won't be able to retrieve the data.`;

  /** delete a poem from the backend,
      hide confirmation modal and send the user to 'My Poems' page. */
  const handleDeletePoem = async () => {
    try {
      await axiosReq.delete(`/poems/${objId}`);
      hideModal();
      navigate("/my-poems");
      showAlert("Your poem has been deleted.");
    } catch (err) {
      showAlert("Something went wrong.  Please try again.");
    }
  };

  return (
    <>
      {/* The modal will appear if showModal is true */}
      {showModal && (
        <Modal show={showModal}>
          <Modal.Body closeButton>
            <span className={styles.Text}>{modalText}</span>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Olive}`}
              onClick={handleDeletePoem}
            >
              delete
            </Button>
            {/* hideConfirmationModal will set 'show' false. */}
            <Button
              onClick={() => hideModal(false)}
              className={`${btnStyles.Button} ${btnStyles.Olive}`}
            >
              cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ModalComponent;
