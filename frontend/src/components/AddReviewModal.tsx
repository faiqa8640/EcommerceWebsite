import { useState } from "react";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onReviewSubmitted: () => Promise<void>;
}

export default function AddReviewModal({ isOpen, onClose, productId, onReviewSubmitted }: AddReviewModalProps) {
  const [reviewUser, setReviewUser] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewUser.trim() || !reviewComment.trim()) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: reviewUser,
          rating: reviewRating,
          comment: reviewComment,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      await onReviewSubmitted();
      
      // Reset form states
      setReviewUser("");
      setReviewRating(5);
      setReviewComment("");
      onClose(); 
    } catch (err) {
      console.error(err);
      alert("Could not post your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Backdrop Overlay (Blurs background, fades in)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Content Box */}
      <div 
        className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
        
        {/* Header */}
        <h3 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight">
          Share Your Experience
        </h3>
        
        {/* Form */}
        <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
          
          {/* Input: Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Your Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-gray-400 text-gray-800" 
              placeholder="e.g., Jane Doe"
              value={reviewUser} 
              onChange={(e) => setReviewUser(e.target.value)}
              required 
            />
          </div>

          {/* Input: Rating */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Rating</label>
            <select 
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-800 cursor-pointer"
              value={reviewRating} 
              onChange={(e) => setReviewRating(Number(e.target.value))}
            >
              <option value={5}>5 Stars - Outstanding</option>
              <option value={4}>4 Stars - Very Good</option>
              <option value={3}>3 Stars - Good</option>
              <option value={2}>2 Stars - Weak</option>
              <option value={1}>1 Star - Poor</option>
            </select>
          </div>

          {/* Input: Comment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Review Comment</label>
            <textarea 
              rows={4} 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-gray-400 text-gray-800 resize-none" 
              placeholder="Describe the notes, performance, drydown, or overall vibe..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full mt-2 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-gray-900/10"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Post Review"}
          </button>
        </form>
      </div>
    </div>
  );
}