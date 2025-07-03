"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import PostInput from "@/components/PostInput";
import PostFeed from "@/components/PostFeed";
import Sidebar from "@/components/Sidebar";
import SidebarSheet from "@/components/SidebarSheet";

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
    <main className="flex min-h-screen">
      <SidebarSheet />
      <section className="flex-1 ml-0 md:ml-80 p-4">
        <h1 className="pl-12 md:pl-0 text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">News Feed</h1>
        <PostInput onPost={handleAddPost} />
        <PostFeed />
      </section>
    </main>
  );
}
