import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  getAllReviews,
  getAllMovies,
  fetchUserReviews,
  fetchUserInfo,
  updateReview,
  deleteReviewByID
} from "../api";
import { useNavigate } from "react-router-dom";

const Account = ({ userId, isAdmin }) => {
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [isActive, setIsActive] = useState({});
  const [editedReview, setEditedReview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin) {
          const usersData = await getAllUsers();
          const reviewsData = await getAllReviews();
          const moviesData = await getAllMovies();
          setUsers(usersData);
          setReviews(reviewsData);
          setMovies(moviesData);
        } else {
          const userInfo = await fetchUserInfo(userId);
          setUser(userInfo);

          const userReviews = await fetchUserReviews(userId);
          setReviews(userReviews);

          const movies = await getAllMovies();
          setMovies(movies);
        }

        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
    handleUpdateReview(isActive);
  }, [userId, isAdmin]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
  };

  const handleEditReview = (value) => {
    setIsActive({ ...value });
    setIsEditingReview(true);
    setEditedReview(value.comment);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReviewByID(reviewId);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };
  const handleUpdateReview = async (reviewData) => {
    try {
      await updateReview(reviewData);
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewData.id
            ? { ...review, comment: reviewData.comment }
            : review
        )
      );
      setIsActive(null);
      setIsEditingReview(false);
    } catch (error) {
      console.error("Error updating review:", error);
      // Add additional error handling logic here
    }
  };

  // const handleUpdateReview = async (reviewData) => {
  //   try {
  //     await updateReview(reviewData); // Update review and return updated review data from database
  //     setReviews({ ...reviews, reviewData }); // Replace review data in state with updated review data
  //     setIsActive(null);
  //     setIsEditingReview(false);
  //   } catch (error) {
  //     console.error("Error updating review:", error);
  //   }
  // };

  const movieName = (movieId) => {
    const movie = movies.find((movie) => movie.id === movieId);
    return movie.title;
  };

  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="container mt-5">
      <h1>{isAdmin ? "Admin Account" : "Account Details"}</h1>
      {isAdmin ? (
        <div>
          <h2>All Users</h2>
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>User Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.isadmin ? "Admin" : "Regular User"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>All Reviews</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Movie</th>
                <th className="text-center">Rating</th>
                <th>Comment</th>
                <th colSpan={2}> </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(reviews) &&
                reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="align-middle">
                      {movieName(review.movie_id)}
                    </td>
                    <td className="align-middle text-center">
                      {review.rating}
                    </td>
                    <td colSpan={3}>
                      <div className="main d-flex gap-3">
                        <div className="d-flex flex-grow-1 justify-content-between">
                          {isEditingReview && review.id === isActive.id ? (
                            <form
                              onSubmit={handleReviewSubmit}
                              className="flex-fill"
                            >
                              <div className="input-group col-auto">
                                <input
                                  type="text"
                                  className="form-control"
                                  defaultValue={review.comment}
                                  onChange={(e) =>
                                    setEditedReview(e.target.value)
                                  }
                                />
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() =>
                                    handleUpdateReview({
                                      ...isActive,
                                      comment: editedReview
                                    })
                                  }
                                >
                                  Submit Update
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="align-self-center">
                                {review.comment}
                              </div>
                              <button
                                onClick={() => handleEditReview(review)}
                                className="btn btn-warning"
                              >
                                Edit Review
                              </button>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="btn btn-danger"
                        >
                          Delete Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">User: {user.username}</h5>
              <p className="card-text">Email: {user.email}</p>
              <p className="card-text">
                User Role: {user.isadmin ? "Admin" : "Regular User"}
              </p>
            </div>
          </div>
          <div>
            <h2>Your Reviews</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th className="text-center">Rating</th>
                  <th>Comment</th>
                  <th colSpan={2}> </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="align-middle">
                      {movieName(review.movie_id)}
                    </td>
                    <td className="align-middle text-center">
                      {review.rating}
                    </td>
                    <td colSpan={3}>
                      <div className="main d-flex gap-3">
                        <div className="d-flex flex-grow-1 justify-content-between">
                          {isEditingReview && review.id === isActive.id ? (
                            <form
                              onSubmit={handleReviewSubmit}
                              className="flex-fill"
                            >
                              <div className="input-group col-auto">
                                <input
                                  type="text"
                                  className="form-control"
                                  defaultValue={review.comment}
                                  onChange={(e) =>
                                    setEditedReview(e.target.value)
                                  }
                                />
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() =>
                                    handleUpdateReview({
                                      ...isActive,
                                      comment: editedReview
                                    })
                                  }
                                >
                                  Submit Update
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="align-self-center">
                                {review.comment}
                              </div>
                              <button
                                onClick={() => handleEditReview(review)}
                                className="btn btn-primary"
                              >
                                Edit Review
                              </button>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="btn btn-danger"
                        >
                          Delete Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
