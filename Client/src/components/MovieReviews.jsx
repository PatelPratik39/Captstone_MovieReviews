import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieReviews } from "../api";

export default function MovieReviews() {
  const [movieReviews, setMovieReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { movieId } = useParams();

  useEffect(() => {
    async function getMovieReviewsHandler() {
      try {
        const MovieReviewData = await fetchMovieReviews(movieId);
        setMovieReviews(MovieReviewData);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }
    getMovieReviewsHandler();
  }, [movieId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <div className="black-background">
      <div className="container">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {movieReviews.map((review, index) => {
            const { movie_id, rating, comment, review_date } = review;
            return (
              <div key={index} className="col">
                <div
                  className="card h-100"
                  style={{ backgroundColor: "#333", color: "white" }}
                >
                  <div className="card-body">
                    <p className="card-text">
                      <strong style={{ color: "yellow" }}>Rating:</strong>{" "}
                      {rating}
                    </p>
                    <p className="card-text">
                      <strong style={{ color: "orange" }}>Review:</strong>{" "}
                      {comment}
                    </p>
                    <p className="card-text">
                      <strong style={{ color: "green" }}>Review Date:</strong>{" "}
                      {review_date}
                    </p>
                  </div>
                  <div className="card-footer"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
