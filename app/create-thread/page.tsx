"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getThreadsFromLocalStorage,
  saveThreadsToLocalStorage,
} from "@/utils/localStorage";
import { getLoggedInUser } from "@/utils/auth";

const CreateThread = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ThreadCategory>("THREAD");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const currentUser = getLoggedInUser();

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    const normalizedTag = tagInput.trim().toLowerCase();
    
    if (normalizedTag && !tags.map(tag => tag.toLowerCase()).includes(normalizedTag)) {
      setTags([...tags, tagInput.trim()]); 
      setTagInput(""); 
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove)); 
  };

  const handleSubmit = () => {
    if (!currentUser) {
      setError("You need to be logged in");
      return;
    }

    if (!title || !description) {
      setError("Fields cannot be empty");
      return;
    }

    const threads = getThreadsFromLocalStorage();
    const newThread: Thread = {
      id: Date.now(),
      title,
      category,
      creationDate: new Date().toISOString(),
      description,
      creator: currentUser as User,
      commentCount: 0,
      isLocked: false,
      tags: tags.map((tag, index) => ({ id: index, name: tag })),  // Convert to ThreadTag[]
    };

    threads.push(newThread);
    saveThreadsToLocalStorage(threads);

    // setTitle("");
    // setCategory("THREAD");
    // setDescription("");
    // setTags([]);  // Clear tags
    // setError(null);

    router.push(`/${newThread.id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
          Create New Thread
        </h1>

        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md text-black"
            placeholder="Enter the title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            className="w-full p-3 border border-gray-300 rounded-md text-black"
            value={category}
            onChange={(e) => setCategory(e.target.value as ThreadCategory)}
          >
            <option value="THREAD">THREAD</option>
            <option value="QNA">QNA</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            className="w-full p-3 border border-gray-300 rounded-md text-black"
            placeholder="Enter the description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Tags Input */}
        <div className="mb-6">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tags
          </label>
          <div className="flex space-x-2">
            <input
              id="tags"
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-md text-black"
              placeholder="Enter a tag"
              value={tagInput}
              onChange={handleTagInput}
            />
            <button
              onClick={handleAddTag}
              className="p-3 bg-blue-500 text-white rounded-md"
            >
              Add Tag
            </button>
          </div>
          <div className="mt-4">
            {tags.map((tag) => (
              <span key={tag} className="inline-block bg-gray-400 p-2 rounded mr-2 mb-2">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Display error message if exists */}
        {error && <p className="text-red-500 mb-6 font-semibold">{error}</p>}

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Create Thread
        </button>
      </div>
    </div>
  );
};

export default CreateThread;