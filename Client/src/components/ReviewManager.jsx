import React, { useState, useEffect } from "react";
import { fetchMovieReviews, submitReview } from "../api";
import ReviewForm from "./ReviewForm";

const ReviewManager = ({ movieId, userId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const initialReviews = await fetchMovieReviews(movieId);
        setReviews(initialReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (reviewData) => {
    try {
      await submitReview(reviewData);

      const updatedReviews = await fetchMovieReviews(movieId);
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="container">
      {userId && (
        <ReviewForm
          movieId={movieId}
          userId={userId}
          onReviewSubmit={handleReviewSubmit}
        />
      )}

      <div className="mt-1">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Rating: {review.rating}</h5>
                <p className="card-text" style={{ fontSize: "14px" }}>
                  {review.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available</p>
        )}
      </div>
    </div>
  );
};

export default ReviewManager;
