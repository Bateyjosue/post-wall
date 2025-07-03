"use client";
import { useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const MAX_LENGTH = 280;
const BUCKET = "post-media";

export default function PostInput({
  onPost,
}: {
  onPost?: (post: any) => void;
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
        toast.error("Failed to upload photo. Please try again.");
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      media_url = data.publicUrl;
    }

    const { data, error: insertError } = await supabase.from("posts").insert([{ message, media_url }]).select().single();
    if (insertError) {
      toast.error("Failed to share post.");
      setLoading(false);
      return;
    }
    setMessage("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(false);
    toast.success("Your post was shared!");
    if (onPost && data) onPost(data);
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
          className="resize-none rounded-none"
        />
        <label className="block">
          <span className="sr-only">Choose file</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={loading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-node file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              transition"
          />
        </label>
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
        <div className="flex justify-end ">
          <Button
            type="submit"
            disabled={!message.trim() || message.length > MAX_LENGTH || loading}
            className="rounded-none bg-green-600 hover:bg-green-700 px-10 py-2 text-base font-bold "
          >
            {loading ? "Sharing..." : "Share"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
