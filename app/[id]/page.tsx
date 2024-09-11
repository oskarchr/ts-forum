'use client';
import { 
  getCommentsFromLocalStorage, 
  getThreadsFromLocalStorage, 
  saveCommentToLocalStorage, 
  saveThreadsToLocalStorage 
} from "@/utils/localStorage";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ThreadDetailHeader from "@/components/threadDetailHeader";
import CommentsSection from "@/components/commentsSection";
import { getLoggedInUser } from "@/utils/auth";

const ThreadPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [thread, setThread] = useState<Thread | QNAThread | null>(null); // Allow for both Thread and QNAThread types
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const commentsRef = useRef<HTMLDivElement>(null);

  const loggedInUser = getLoggedInUser();

  //Typeguard
  const isQNAThread = (thread: Thread | null): thread is QNAThread => {
    return thread !== null && thread.category === "QNA";
  };

  useEffect(() => {
    if (id) {
      const storedThreads = getThreadsFromLocalStorage();
      const selectedThread = storedThreads.find(t => t.id === Number(id));
      setThread(selectedThread || null);

      const threadComments = getCommentsFromLocalStorage(Number(id));
      setComments(threadComments);
    }
  }, [id]);

  const handleAddComment = (newComment: ThreadComment) => {
    saveCommentToLocalStorage(newComment);
    setComments([...comments, newComment]);

    if (thread) {
      const updatedThread = { ...thread, commentCount: thread.commentCount + 1 };
      setThread(updatedThread);

      const storedThreads = getThreadsFromLocalStorage();
      const updatedThreads = storedThreads.map(t => 
        t.id === updatedThread.id ? updatedThread : t
      );
      saveThreadsToLocalStorage(updatedThreads);
    }
  };

  // Handle marking or unmarking the answer
  const handleMarkAsAnswer = (commentId: number) => {
    if (isQNAThread(thread)) {
      const isCurrentlyMarked = thread.commentAnswerId === commentId;

      const updatedThread: QNAThread = {
        ...thread,
        commentAnswerId: isCurrentlyMarked ? undefined : commentId, // Toggle answer mark
        isAnswered: !isCurrentlyMarked // Update the 'isAnswered' state
      };

      setThread(updatedThread);

      const storedThreads = getThreadsFromLocalStorage();
      const updatedThreads = storedThreads.map(t => 
        t.id === updatedThread.id ? updatedThread : t
      );
      saveThreadsToLocalStorage(updatedThreads);
    }
  };

  const toggleThreadLock = () => {
    if (thread) {
      const updatedThread = { ...thread, isLocked: !thread.isLocked };
      setThread(updatedThread);

      const storedThreads = getThreadsFromLocalStorage();
      const updatedThreads = storedThreads.map(t => 
        t.id === updatedThread.id ? updatedThread : t
      );
      saveThreadsToLocalStorage(updatedThreads);
    }
  };

  const handleDeleteThread = () => {
    if (thread) {
      const storedThreads = getThreadsFromLocalStorage();
      const updatedThreads = storedThreads.filter(t => t.id !== thread.id);

      saveThreadsToLocalStorage(updatedThreads);
      router.push('/');
    }
  };

  const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!thread) {
    return <div>Loading...</div>;
  }

  const canManageThread = loggedInUser && (loggedInUser.isModerator || loggedInUser.userName === thread.creator.userName);

  const isQNA = isQNAThread(thread); // Typeguard

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ThreadDetailHeader thread={thread} onCommentIconClick={scrollToComments} />

      {canManageThread && (
        <div className="flex justify-end space-x-4">
          <button 
            onClick={toggleThreadLock} 
            className={`px-4 py-2 text-white rounded ${thread.isLocked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {thread.isLocked ? 'Unlock Thread' : 'Lock Thread'}
          </button>

          <button 
            onClick={handleDeleteThread} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Thread
          </button>
        </div>
      )}

      <div ref={commentsRef}>
        <CommentsSection 
          threadId={thread.id} 
          initialComments={comments} 
          onAddComment={handleAddComment}
          isLocked={thread.isLocked}
          isQNA={isQNA}
          commentAnswerId={isQNA ? thread.commentAnswerId : undefined} // Pass commentAnswerId only for QNA threads
          onMarkAsAnswer={canManageThread && isQNA ? handleMarkAsAnswer : undefined} // Allow marking if it's QNA and user can manage
        />
      </div>
    </div>
  );
};

export default ThreadPage;
