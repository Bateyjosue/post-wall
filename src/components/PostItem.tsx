"use client";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

type Post = {
  id: string;
  user_id?: string | null;
  message: string;
  created_at: string;
  media_url?: string | null;
};

function isImage(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

function isVideo(url: string) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

export default function PostItem({ post }: { post: Post }) {
  return (
    <Card className="p-4 rounded-md border bg-white dark:bg-zinc-900 shadow mb-2">
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-gray-900 dark:text-gray-100">
          {post.user_id || "Anonymous"}
        </div>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200">
          <ReactMarkdown>
            {post.message}
          </ReactMarkdown>
        </div>
        {post.media_url && (
          <div className="mt-2">
            {isImage(post.media_url) ? (
              <img
                src={post.media_url}
                alt="Post media"
                className="max-h-64 rounded-md border object-contain"
              />
            ) : isVideo(post.media_url) ? (
              <video
                src={post.media_url}
                controls
                className="max-h-64 rounded-md border object-contain"
              />
            ) : null}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          {new Date(post.created_at).toLocaleString()}
        </div>
      </div>
    </Card>
  );
}
