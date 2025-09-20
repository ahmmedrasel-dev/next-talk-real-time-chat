"use client";

import { useState } from "react";
import { MessagesSquare, User, LogOut } from "lucide-react"; // Import icons
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

// Define types for our data for better type safety
type Contact = {
  id: number;
  name: string;
  photoUrl?: string;
};

type Message = {
  id: number;
  sender: string;
  text: string;
};

const contacts: Contact[] = [
  {
    id: 1,
    name: "Alice",
    photoUrl: "https://randomuser.me/api/portraits/women/1.jpg",
  },
];

const messages: Message[] = [
  { id: 1, sender: "Alice", text: "Hi there!" },
  { id: 2, sender: "Me", text: "Hello Alice!" },
  { id: 3, sender: "Alice", text: "How are you?" },
];

export default function ChatRoomPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  // Filter contacts based on the search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: Contacts */}
      <aside className="w-96 bg-white border-r flex flex-col">
        {/* App Logo and Title */}
        <div className="p-4 border-b flex items-center gap-3">
          <MessagesSquare className="h-6 w-6 text-blue-600" />
          <h1 className="font-bold text-xl tracking-tight">Next Talk</h1>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b">
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Contact List */}
        <ul className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <li
              key={contact.id}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b flex items-center gap-3"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 border overflow-hidden">
                {contact.photoUrl ? (
                  <Image
                    src={contact.photoUrl}
                    alt={contact.name + " photo"}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-500" />
                )}
              </span>
              <span>{contact.name}</span>
            </li>
          ))}
        </ul>

        {/* Logged-in User Info and Logout Button */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <Image
                src={loggedInUser.photoUrl}
                alt={loggedInUser.name + " photo"}
                width={36}
                height={36}
                className="w-9 h-9 object-cover rounded-full border"
              /> */}
              <span className="font-semibold text-sm">{user?.full_name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "Me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs shadow text-sm ${
                  msg.sender === "Me"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        {/* Message Input */}
        <form className="flex items-center gap-2 p-4 border-t bg-white">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </main>
    </div>
  );
}
