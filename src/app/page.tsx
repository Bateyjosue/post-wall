import Sidebar from "@/components/Sidebar";
import PostInput from "@/components/PostInput";
import PostFeed from "@/components/PostFeed";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row gap-8 p-4 bg-background">
      {/* Sidebar on the left (hidden on mobile) */}
      <aside className="hidden md:block w-80 flex-shrink-0">
        <Sidebar />
      </aside>
      {/* Main wall/feed */}
      <section className="flex-1 max-w-2xl mx-auto w-full">
        <PostInput />
        <PostFeed />
      </section>
    </main>
  );
}
