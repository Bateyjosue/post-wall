import Sidebar from "@/components/Sidebar";
import SidebarSheet from "@/components/SidebarSheet";
import PostInput from "@/components/PostInput";
import PostFeed from "@/components/PostFeed";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row gap-12 p-6 bg-gray-50 dark:bg-zinc-950">
      <SidebarSheet />
      {/* Sidebar on the left (hidden on mobile) */}
      <aside className="hidden md:block w-80 flex-shrink-0">
        <Sidebar />
      </aside>
      {/* Main wall/feed */}
      <section className="flex-1 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">News Feed</h1>
        <PostInput />
        <PostFeed />
      </section>
    </main>
  );
}
