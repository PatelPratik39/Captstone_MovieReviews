import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchUserReviews } from "../api";

export default function UserReviews({ userId }) {
  const [userReviews, setUserReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUserReviewsHandler() {
      try {
        const UserReviewData = await fetchUserReviews(userId);
        setUserReviews(UserReviewData);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }
    getUserReviewsHandler();
  }, [userId]);

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
          {userReviews.map((userReview) => {
            const { rating, comment, review_date } = userReview;
            return (
              <div key={userId} className="col">
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
