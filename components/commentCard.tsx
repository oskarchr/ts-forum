import React from "react";
import { formatDistanceToNow } from "date-fns";

type CommentCardProps = {
  comment: ThreadComment;
  isAnswer: boolean;
  canMarkAsAnswer?: boolean; 
  onMarkAsAnswer?: () => void;
};

const CommentCard: React.FC<CommentCardProps> = ({ comment, isAnswer, canMarkAsAnswer, onMarkAsAnswer }) => {
  const creationDate = comment.creationDate ? new Date(comment.creationDate) : new Date();

  return (
    <div 
      className={`bg-gray-100 p-3 rounded-lg mb-2 ${isAnswer ? 'border-4 border-green-500' : 'border border-gray-300'}`}
    >
      <div className="flex items-center text-xs text-gray-500 mb-1">
        <span>u/{comment.creator.userName}</span>
        <span className="mx-1">•</span>
        <span>{formatDistanceToNow(creationDate)} ago</span>
      </div>
      <p className="text-sm text-gray-800">{comment.content}</p>
      
      {canMarkAsAnswer && (
        <button 
          onClick={onMarkAsAnswer}
          className="text-blue-500 text-xs mt-2 underline"
        >
          {isAnswer ? "Unmark as Answer" : "Mark as Answer"}
        </button>
      )}
    </div>
  );
};

export default CommentCard;
