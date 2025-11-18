"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  UserGroupIcon,
  SignalIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import Users from "./_list/Users";
import Sources from "./_list/Sources";
import Vehicles from "./_list/Vehicles";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Sources");

  const navItems = [
    { name: "Users", icon: UserGroupIcon },
    { name: "Sources", icon: SignalIcon },
    { name: "Vehicles", icon: TruckIcon },
  ];

  const activeItem = navItems.find((item) => item.name === activeTab);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col p-4">
        <h1 className="text-xl font-bold mb-6">Dashboard</h1>
        <ul className="space-y-2 flex-1">
          {navItems.map((item) => (
            <li
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center space-x-2 cursor-pointer p-2 rounded ${
                activeTab === item.name ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-6 h-6 text-gray-600" />
              <span className="text-gray-800">{item.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "Users" ? (
          <Users />
        ) : activeTab === "Sources" ? (
          <Sources />
        ) : activeTab === "Vehicles" ? (
          <Vehicles />
        ) : null}
      </main>
    </div>
  );
}
