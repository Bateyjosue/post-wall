"use client";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

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

export default function PostItem({ post, onDelete, onEdit }: { post: Post, onDelete: (id: string) => void, onEdit: (post: Post) => void }) {

  return (
    <Card className="p-4 rounded-md border bg-white dark:bg-zinc-900 shadow mb-2 relative">
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(post)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-gray-900 dark:text-gray-100">
          {post.user_id || "Josue Batey"}
        </div>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200">
          <ReactMarkdown>
            {post.message}
          </ReactMarkdown>
        </div>
        {post.media_url && (
          <div className="mt-2">
            {isImage(post.media_url) ? (
              <Image
                src={post.media_url}
                alt="Post media"
                width={320}
                height={160}
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
