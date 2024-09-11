'use client';

import { useEffect, useState } from "react";
import { getThreadsFromLocalStorage } from "../utils/localStorage";
import Link from "next/link";
import ThreadCard from "@/components/threadCard";
import { FiSearch } from "react-icons/fi";

const Home = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [searchQuery, setSearchQuery] = useState("");  // State to track search input

  useEffect(() => {
    const storedThreads = getThreadsFromLocalStorage();
    setThreads(storedThreads);
  }, []);


  const filteredThreads = searchQuery.trim() === "" 
  ? threads // Return all threads when search is empty
  : threads.filter(thread =>
      thread.tags && Array.isArray(thread.tags) && 
      thread.tags.some(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by tag"
          className="border rounded-full pl-10 pr-3 py-2 w-full text-sm text-white bg-gray-800"
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Link 
        href="/create-thread" 
        className="inline-block my-4 text-white bg-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Create a New Thread
      </Link>
      <ul className="space-y-4">
        {filteredThreads
          .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
          .map(thread => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
      </ul>
    </div>
  );
};

export default Home;