import React from "react";
import Modal from "react-modal";
import ReactStars from "react-rating-stars-component";

Modal.setAppElement("#root"); // Needed for accessibility

const RateUsModal = ({ isOpen, onClose }) => {
  const handleRating = (newRating) => {
    console.log("Rated:", newRating);
    // You could send to backend here
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Rate Us">
      <h2>Enjoying the site?</h2>
      <p>We’d love your feedback. Please rate us!</p>
      <ReactStars
        count={5}
        size={30}
        onChange={handleRating}
        activeColor="#ffd700"
      />
      <button onClick={onClose}>Not now</button>
    </Modal>
  );
};

export default RateUsModal;
