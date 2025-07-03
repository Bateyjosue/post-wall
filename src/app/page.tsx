"use client";

import Sidebar from "@/components/Sidebar";
import SidebarSheet from "@/components/SidebarSheet";
import PostFeed from "@/components/PostFeed";
import { useState } from "react";
import PostInput from "@/components/PostInput";

type Post = {
  id: string;
  user_id?: string | null;
  message: string;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev.slice(0, 49)]);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row gap-12 p-6 bg-gray-50 dark:bg-zinc-950">
      <SidebarSheet />
      {/* Sidebar on the left (hidden on mobile) */}
      <aside className="hidden md:block w-80 flex-shrink-0">
        <Sidebar />
      </aside>
      {/* Main wall/feed */}
      <section className="flex-1 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">News Feed</h1>
        <PostInput onPost={handleAddPost} />
        <PostFeed />
      </section>
    </main>
  );
}
