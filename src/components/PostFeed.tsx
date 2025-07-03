"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Card } from "@/components/ui/card";
import PostItem from "./PostItem";

type Post = {
  id: string;
  user_id?: string | null;
  message: string;
  created_at: string;
};

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest 50 posts
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setPosts(data as Post[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to new posts in real time
    const channel = supabase
      .channel("realtime:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          setPosts((prev) => [payload.new as Post, ...prev.slice(0, 49)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      {loading ? (
        <div className="text-center text-gray-400 font-bold py-8">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-400 font-bold py-8">No posts yet. Be the first!</div>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.id}>
              <PostItem post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
