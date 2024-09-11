import React from "react";
import { useState } from "react";
import CommentCard from "./commentCard";
import { getLoggedInUser } from "@/utils/auth";

type CommentsSectionProps = {
  threadId: number;
  initialComments: ThreadComment[];
  onAddComment: (comment: ThreadComment) => void;
  isLocked: boolean;
  isQNA: boolean; 
  commentAnswerId?: number; // The ID of the marked answer, if any
  onMarkAsAnswer?: (commentId: number) => void; // Function to mark/unmark answers
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ threadId, initialComments, onAddComment, isLocked, isQNA, commentAnswerId, onMarkAsAnswer }) => {
  const [comments, setComments] = useState<ThreadComment[]>(initialComments);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddComment = () => {
    const currentUser = getLoggedInUser();

    if (!currentUser) {
      setError("You must be logged in to comment");
      return;
    }

    if (commentContent.trim() === "") {
      setError("Comment cannot be empty");
      return;
    }

    const newComment: ThreadComment = {
      id: Date.now(),
      thread: threadId,
      content: commentContent,
      creationDate: new Date().toISOString(),
      creator: currentUser
    };

    setComments([...comments, newComment]);
    onAddComment(newComment);
    setCommentContent("");
    setError(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Comments</h2>
      <ul>
        {comments.map(comment => (
          <CommentCard 
          key={comment.id} 
          comment={comment} 
          isAnswer={isQNA && comment.id === commentAnswerId} // Mark if it's the answer
          canMarkAsAnswer={!!onMarkAsAnswer && !isLocked} // Can mark if the handler exists and thread isn't locked
          onMarkAsAnswer={() => onMarkAsAnswer && onMarkAsAnswer(comment.id)} // Call mark/unmark handler
          />
        ))}
      </ul>

      <textarea
        placeholder={isLocked ? "Thread is locked. No more comments allowed." : "Add a comment"}
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        className="w-full border rounded p-2 mt-4 text-black"
        disabled={isLocked}
      />
      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleAddComment}
        className={`mt-2 px-4 py-2 text-white rounded hover:bg-blue-600 ${isLocked ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'}`}
        disabled={isLocked}
      >
        Add Comment
      </button>
    </div>
  );
};

export default CommentsSection;
