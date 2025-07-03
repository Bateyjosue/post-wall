"use client";
import { useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";

const MAX_LENGTH = 280;
const BUCKET = "post-media";

export default function PostInput({
  onPost,
}: {
  onPost?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!message.trim() || message.length > MAX_LENGTH) return;
    setLoading(true);

    let media_url = null;
    if (file) {
      const fileExt = file.name.split('.').pop();
      const filePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file);

      if (uploadError) {
        console.error(uploadError);
        setError("Failed to upload photo. Please try again.");
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      media_url = data.publicUrl;
    }

    await supabase.from("posts").insert([{ message, media_url }]);
    setMessage("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(false);
    onPost?.();
  };

  return (
    <Card className="mb-6 p-4 rounded-md border bg-white dark:bg-zinc-900 shadow">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Textarea
          maxLength={MAX_LENGTH}
          placeholder="What's on your mind?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          className="resize-none rounded-md"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={loading}
        />
        {error && <div className="text-red-500 text-xs">{error}</div>}
        <div className="flex justify-between items-center">
          <span className={`text-xs ${message.length > MAX_LENGTH ? "text-red-500" : "text-gray-400"}`}>
            {message.length}/{MAX_LENGTH}
          </span>
        </div>
        {/* Markdown Preview */}
        {message && (
          <div className="mt-4">
            <div className="text-xs font-semibold mb-1 text-gray-500">Preview:</div>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 border rounded p-2 bg-gray-50 dark:bg-zinc-800">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          </div>
        )}
        {/* Image Preview */}
        {file && file.type.startsWith("image/") && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="max-h-40 rounded border"
            />
          </div>
        )}
        {/* Share Button (below preview, green) */}
        <Button
          type="submit"
          disabled={!message.trim() || message.length > MAX_LENGTH || loading}
          className="rounded-md bg-green-600 hover:bg-green-700"
        >
          {loading ? "Sharing..." : "Share"}
        </Button>
      </form>
    </Card>
  );
}
