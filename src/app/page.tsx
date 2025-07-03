"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import PostInput from "@/components/PostInput";
import PostFeed from "@/components/PostFeed";
import SidebarSheet from "@/components/SidebarSheet";
import { supabase } from "../../lib/supabaseClient";

type Post = {
  id: string;
  user_id?: string | null;
  message: string;
  created_at: string;
  media_url?: string | null;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (!error && data) setPosts(data as Post[]);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Background polling (no loading spinner)
  useEffect(() => {
    const poll = setInterval(async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (!error && data) {
        // Only update if there are changes
        if (
          data.length !== posts.length ||
          data.some((post, i) => post.id !== posts[i]?.id)
        ) {
          setPosts(data as Post[]);
        }
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [posts]);

  // Optimistically add new post
  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev.slice(0, 49)]);
  };

  return (
    <main className="flex min-h-screen">
      <SidebarSheet />
      <section className="flex-1 ml-0 md:ml-80 p-4">
        <h1 className="pl-12 md:pl-0 text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">News Feed</h1>
        <PostInput onPost={handleAddPost} />
        <PostFeed posts={posts} setPosts={setPosts} loading={loading} />
      </section>
    </main>
  );
}
