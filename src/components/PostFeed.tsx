"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import PostItem from "./PostItem";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Post = {
  id: string;
  user_id?: string | null;
  message: string;
  created_at: string;
};

export default function PostFeed({
  posts,
  setPosts,
  loading,
}: {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  loading: boolean;
}) {
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel("realtime:posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPosts((prev) => [payload.new as Post, ...prev.slice(0, 49)]);
          } else if (payload.eventType === "UPDATE") {
            setPosts((prev) =>
              prev.map((p) => (p.id === (payload.new as Post).id ? (payload.new as Post) : p))
            );
          } else if (payload.eventType === "DELETE") {
            setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setPosts]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete post.");
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted.");
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
  };

  const handleEditSave = async (updatedMessage: string) => {
    if (!editingPost) return;
    const { error } = await supabase
      .from("posts")
      .update({ message: updatedMessage })
      .eq("id", editingPost.id);
    if (error) {
      toast.error("Failed to update post.");
    } else {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPost.id ? { ...p, message: updatedMessage } : p
        )
      );
      toast.success("Post updated.");
      setEditingPost(null);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-400 font-bold py-8">No posts yet. Be the first!</div>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.id}>
              <PostItem post={post} onDelete={handleDelete} onEdit={handleEdit} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
