import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosReq } from "../../api/axiosDefaults";
import Poem from "./Poem";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import CommentCreateForm from "../comments/CommentCreateForm";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Comment from "../comments/Comment";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import Alert from "react-bootstrap/Alert";

/**
 * Return content of individual poem pages.
 */
function PoemPage() {
  /** get the poem id from the URL */
  const { id } = useParams();
  /** stores data of the poem */
  const [poem, setPoem] = useState({ results: [] });
  /** stores info about the logged in user. */
  const currentUser = useCurrentUser();
  /** stores profile image of the current user */
  const profile_image = currentUser?.profile_image;
  /** stores comments about the poem */
  const [comments, setComments] = useState({ results: [] });
  /** stores error messages */
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    /** get the data of the poem and the comments and set them to variables */
    const handleMount = async () => {
      try {
        // get the data of the poem and the comments about the poem
        const [{ data: poem }, { data: comments }] = await Promise.all([
          axiosReq.get(`/poems/${id}`),
          axiosReq.get(`/comments/?poem__id=${id}`),
        ]);
        // store the data to 'poem'
        setPoem({ results: [poem] });
        // store the data to 'comments'
        setComments(comments);
      } catch (err) {
        err.response.status === 404 &&
          setErrMsg("Poem with the given ID was not found.");
      }
    };
    handleMount();
  }, [id]);

  return (
    <>
      <Row className="h-100">
        <Col className="mt-3" md={{ span: 8, offset: 2 }}>
          {/* if there are errors, dislay the error message, otherwise display the poem. */}
          {errMsg ? (
            <Alert variant="warning" key={errMsg}>
              {errMsg}
            </Alert>
          ) : (
            <>
              <Poem {...poem.results[0]} setPoems={setPoem} poemPage />
              {/* If logged in, display comment form.
                    If not, display the heading 'Comments' if there are any comments. */}
              {currentUser && (
                <CommentCreateForm
                  profile_id={currentUser.profile_id}
                  profileImage={profile_image}
                  poem={id}
                  setPoem={setPoem}
                  setComments={setComments}
                />
              )}
              {comments.results.length ? (
                <InfiniteScroll
                  children={comments.results.map((comment) => (
                    <Comment
                      key={comment.id}
                      {...comment}
                      setPoem={setPoem}
                      setComments={setComments}
                    />
                  ))}
                  dataLength={comments.results.length}
                  loader={<Asset spinner />}
                  hasMore={!!comments.next}
                  next={() => fetchMoreData(comments, setComments)}
                />
              ) : currentUser ? (
                <>
                  {/* If no comments and if logged in,
                    display the following */}
                  <span>No comments yet, be the first to comment!</span>
                </>
              ) : (
                <>
                  {/* If no comments and if not logged in,
                    display the following */}
                  <span>
                    No comments yet.
                    <Link className="ml-2 mr-2" to="/signin">
                      Sign in
                    </Link>
                    to leave a comment.
                  </span>
                </>
              )}
            </>
          )}
        </Col>
      </Row>
    </>
  );
}

export default PoemPage;
