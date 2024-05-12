import { useState } from "react";

const ReviewForm = ({ onReviewSubmit, movieId, userId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      movie_id: Number(movieId),
      user_id: userId,
      rating: rating,
      comment: comment,
      review_date: new Date().toISOString()
    };
    try {
      await onReviewSubmit(reviewData);
      console.log(reviewData);
      alert("Review submitted successfully!");

      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);

      alert("Failed to submit review. Please try again later.");
    }
  };

  return (
    <fieldset
      className="ReviewForm col-md-7"
      style={{
        backgroundColor: "#222",
        padding: "20px",
        marginTop: "20px",
        color: "white"
      }}
    >
      <h5 style={{ color: "white" }}>Rate this Movie:</h5>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{ color: "white" }}>Rating:</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
            className="form-control form-control-sm"
            style={{ width: "50px" }}
          />
        </div>
        <p> </p>
        <div className="form-group col-md-9">
          <label style={{ color: "white" }}>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-control"
            rows="3"
            placeholder="Write your comment..."
            style={{ marginBottom: "10px", width: "100%" }}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Review
        </button>
      </form>
    </fieldset>
  );
};

export default ReviewForm;
