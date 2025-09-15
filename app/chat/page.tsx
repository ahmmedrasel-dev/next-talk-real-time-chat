"use client";

import { useState } from "react";
import { MessagesSquare, User } from "lucide-react"; // Import icons
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  {
    id: 2,
    name: "Bob",
    photoUrl: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Charlie",
    photoUrl: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "David",
    photoUrl: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Eve",
    photoUrl: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: 6,
    name: "Frank",
    photoUrl: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 7,
    name: "Grace",
    photoUrl: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 8,
    name: "Hannah",
    photoUrl: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: 9,
    name: "Ian",
    photoUrl: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    id: 10,
    name: "Jack",
    photoUrl: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: 11,
    name: "Karen",
    photoUrl: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    id: 12,
    name: "Leo",
    photoUrl: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 13,
    name: "Mona",
    photoUrl: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    id: 14,
    name: "Nina",
    photoUrl: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    id: 15,
    name: "Oscar",
    photoUrl: "https://randomuser.me/api/portraits/men/15.jpg",
  },
];

const messages: Message[] = [
  { id: 1, sender: "Alice", text: "Hi there!" },
  { id: 2, sender: "Me", text: "Hello Alice!" },
  { id: 3, sender: "Alice", text: "How are you?" },
];

export default function ChatRoomPage() {
  // State to hold the search query
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contacts based on the search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: Contacts */}
      <aside className="w-64 bg-white border-r flex flex-col">
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
