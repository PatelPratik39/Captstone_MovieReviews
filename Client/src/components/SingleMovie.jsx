import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovie, fetchMovieReviews, submitReview } from "../api";
import ReviewManager from "./ReviewManager";

const SingleMovie = ({ token, userId }) => {
  const [movie, setMovie] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const { movieId } = useParams();

  useEffect(() => {
    async function fetchMovieData() {
      try {
        const movieData = await fetchMovie(movieId);
        setMovie(movieData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchMovieData();
  }, [movieId]);

  useEffect(() => {
    async function calculateAverageRating() {
      try {
        const reviews = await fetchMovieReviews(movieId);
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        setAverageRating(avgRating);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    calculateAverageRating();
  }, [movieId]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      await submitReview(reviewData);
      const updatedReviews = await fetchMovieReviews(movieId);
      const totalRating = updatedReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating =
        updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;
      setAverageRating(avgRating);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="bg-dark">
      <div className="black-background" style={{ backgroundColor: "#222" }}>
        <div className="container py-1">
          <h2 className="my-4 text-light" style={{ color: "cyan" }}>
            About This Movie
          </h2>
          {movie ? (
            <div className="row">
              <div className="col-md-4">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="img-fluid shadow-lg rounded"
                />
              </div>
              <div className="col-md-7">
                <div className="card bg-dark text-light border-light">
                  <div className="card-body col-md-">
                    <h2 className="text-light">{movie.title}</h2>
                    <p>
                      <i className="fas fa-film" style={{ color: "green" }}></i>{" "}
                      Category:{" "}
                      <span style={{ color: "green" }}>{movie.category}</span>
                    </p>
                    <p>
                      <i
                        className="fas fa-calendar-alt"
                        style={{ color: "orange" }}
                      ></i>{" "}
                      Release Date:{" "}
                      <span style={{ color: "orange" }}>
                        {movie.release_date}
                      </span>
                    </p>
                    <p>
                      <i
                        className="fas fa-align-left"
                        style={{ color: "cyan" }}
                      ></i>{" "}
                      Movie Plot:{" "}
                      <span style={{ color: "cyan" }}>{movie.plot}</span>
                    </p>
                    <p>
                      <i
                        className="fas fa-star"
                        style={{ color: "yellow" }}
                      ></i>{" "}
                      Average Rating:{" "}
                      <span style={{ color: "yellow" }}>{averageRating}</span>
                    </p>
                  </div>
                  <div className="card-footer">
                    <ReviewManager movieId={movieId} userId={userId} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleMovie;
