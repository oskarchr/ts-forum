import { formatDistanceToNow } from "date-fns";
import { FaRegCommentAlt } from "react-icons/fa";

type ThreadDetailHeaderProps = {
  thread: Thread;
  onCommentIconClick: () => void; 
};

const ThreadDetailHeader: React.FC<ThreadDetailHeaderProps> = ({ thread, onCommentIconClick }) => {
  return (
    <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm mb-6">
      <p className="text-xs font-bold text-gray-600 mb-1">r/{thread.category}</p>
      <div className="flex items-center text-xs text-gray-500 mb-2">
        <span>u/{thread.creator.userName}</span>
        <span className="mx-1">•</span>
        <span>{formatDistanceToNow(new Date(thread.creationDate))} ago</span>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 transition-colors mb-2">
        {thread.title}
      </h2>
      <p className="text-sm text-gray-700">{thread.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
        <div className="flex items-center justify-center bg-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-400 transition-colors cursor-pointer"
             onClick={onCommentIconClick} 
        >
          <FaRegCommentAlt className="text-lg mr-1.5 text-gray-700" />
          <span className="text-sm font-semibold text-gray-700">{thread.commentCount}</span>
        </div>
        {/* Tags here */}
        {thread.tags?.length > 0 && (
            <div className="flex flex-wrap ml-auto justify-end">
              {thread.tags.map(tag => (
                <span 
                  key={tag.id} 
                  className="bg-blue-100 text-blue-700 text-xs font-medium mr-2 px-2.5 py-1 mt-2 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ThreadDetailHeader;
