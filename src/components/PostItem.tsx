"use client";
import { Card } from "@/components/ui/card";

type Post = {
  id: string;
  user_id?: string | null;
  message: string;
  created_at: string;
};

export default function PostItem({ post }: { post: Post }) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-1">
        <div className="font-semibold text-gray-900 dark:text-gray-100">
          {post.user_id || "Anonymous"}
        </div>
        <div className="text-gray-700 dark:text-gray-200">{post.message}</div>
        <div className="text-xs text-gray-400 mt-1">
          {new Date(post.created_at).toLocaleString()}
        </div>
      </div>
    </Card>
  );
}
