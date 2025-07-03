"use client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaEnvelope, FaCalendar } from "react-icons/fa";

const mockUser = {
  name: "Chad Johnson",
  email: "chad.johnson@email.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  joined: "2023-01-15",
};

export default function Sidebar() {
  return (
    <aside className="sticky top-8 w-full max-w-xs">
      <Card className="flex flex-col items-center gap-4 p-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
          <AvatarFallback>
            {mockUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-xl font-bold">{mockUser.name}</div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <FaEnvelope className="w-4 h-4" />
          <span className="text-sm">{mockUser.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <FaCalendar className="w-4 h-4" />
          <span className="text-sm">
            Joined {new Date(mockUser.joined).toLocaleDateString()}
          </span>
        </div>
      </Card>
    </aside>
  );
}
