import React, { useState } from "react";
import { Review } from "../types"; 

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onReviewSubmitted: (newReview: Review) => void; // Updated to use the comprehensive global type
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  productId,
  onReviewSubmitted,
}: ReviewFormModalProps) {
  const [user, setUser] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.trim() || !comment.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Format current date nicely (e.g., "June 12, 2026")
      const formattedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Local API payload for your MongoDB POST request
      const reviewPayload = { user, rating, comment, date: formattedDate };

      // Make API call to MongoDB backend
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewPayload),
        }
      );

      if (!response.ok) throw new Error("Failed to submit review");
      
      const savedData = await response.json();

      // Construct the complete Review type containing the necessary productId state link
      const completedReview: Review = {
        _id: savedData._id || undefined, // Capture database ID if returned, otherwise fallback safely
        productId: productId,
        user: user,
        rating: rating,
        comment: comment,
        date: formattedDate,
      };

      // Pass the fully typed review back to parent to instantly update UI
      onReviewSubmitted(completedReview);
      
      // Reset form and close
      setUser("");
      setRating(5);
      setComment("");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Could not save review. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(17, 24, 68, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: #EAE0CF;
          border: 1px solid rgba(75, 86, 148, 0.2);
          border-radius: 24px;
          padding: 2.5rem;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 20px 50px rgba(17, 24, 68, 0.3);
          position: relative;
          font-family: 'Jost', sans-serif;
        }
        .modal-close {
          position: absolute;
          top: 20px; right: 20px;
          background: none; border: none;
          font-size: 1.5rem; color: #111844;
          cursor: pointer;
        }
        .modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 300;
          color: #111844; margin-bottom: 1.5rem;
        }
        .modal-title span { color: #4B5694; }
        .form-group { margin-bottom: 1.2rem; }
        .form-label {
          display: block; font-size: 0.68rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #4B5694; margin-bottom: 0.4rem;
        }
        .form-input {
          width: 100%; padding: 10px 14px;
          border-radius: 10px; border: 1px solid rgba(17, 24, 68, 0.2);
          background: rgba(255, 255, 255, 0.5);
          color: #111844; font-size: 0.9rem;
          box-sizing: border-box;
        }
        .form-input:focus {
          outline: none; border-color: #4B5694;
        }
        .rating-stars { display: flex; gap: 8px; font-size: 1.5rem; cursor: pointer; }
        .star { color: rgba(17,24,68,0.2); transition: color 0.2s; }
        .star.active { color: #4B5694; }
        .modal-error { color: #b91c1c; font-size: 0.8rem; margin-bottom: 1rem; }
        .modal-submit {
          width: 100%; height: 48px;
          background: linear-gradient(135deg, #111844, #4B5694);
          color: #EAE0CF; border: none; border-radius: 10px;
          font-size: 0.75rem; letter-spacing: 0.2em;
          text-transform: uppercase; cursor: pointer;
          transition: 0.3s;
        }
        .modal-submit:hover { transform: translateY(-2px); }
        .modal-submit:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>&times;</button>
          
          <h3 className="modal-title">Write a <span>Review</span></h3>
          
          {error && <div className="modal-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                className="form-input"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="e.g., Sophia Vance"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    className={`star ${num <= rating ? "active" : ""}`}
                    onClick={() => setRating(num)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Review Details</label>
              <textarea
                className="form-input"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the notes, sillage, and performance..."
                required
              />
            </div>

            <button type="submit" className="modal-submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}