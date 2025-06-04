import React, { useState } from "react";
import "../assets/css/Review.css";

function Review({ isOpen, onClose, onSubmit, client }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") return;
    onSubmit({ comment, rating, client });
    setComment("");
    setRating(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Rate Your Experience</h2>

        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${
                star <= (hoveredStar || rating) ? "filled" : ""
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={onClose} className="cancel">
            Cancel
          </button>
          <button onClick={handleSubmit} className="submit">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Review;
