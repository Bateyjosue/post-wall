"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MAX_LENGTH = 280;

export default function PostInput({
  onPost,
}: {
  onPost?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.length > MAX_LENGTH) return;
    setLoading(true);
    await supabase.from("posts").insert([{ message }]);
    setMessage("");
    setLoading(false);
    onPost?.();
  };

  return (
    <Card className="mb-6 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Textarea
          maxLength={MAX_LENGTH}
          placeholder="What's on your mind?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          className="resize-none"
        />
        <div className="flex justify-between items-center">
          <span className={`text-xs ${message.length > MAX_LENGTH ? "text-red-500" : "text-gray-400"}`}>
            {message.length}/{MAX_LENGTH}
          </span>
          <Button
            type="submit"
            disabled={!message.trim() || message.length > MAX_LENGTH || loading}
          >
            {loading ? "Sharing..." : "Share"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
