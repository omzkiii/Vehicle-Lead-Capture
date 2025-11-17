"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  UserGroupIcon,
  SignalIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Users");

  const navItems = [
    { name: "Users", icon: UserGroupIcon, api: "/api/users" },
    { name: "Source", icon: SignalIcon, api: "/api/source" },
    { name: "Vehicle", icon: TruckIcon, api: "/api/vehicle" },
  ];

  const activeItem = navItems.find((item) => item.name === activeTab);

  const { data, isLoading, isError } = useQuery({
    queryKey: [activeTab],
    queryFn: async () => {
      if (!activeItem) return [];
      const res = await fetch(activeItem.api);
      if (!res.ok) throw new Error("Failed to fetch data");
      console.log(res);

      return res.json();
    },
  });

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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">{activeTab} Dashboard</h1>

        {isLoading && <p className="text-gray-500">Loading {activeTab}...</p>}
        {isError && (
          <p className="text-red-500">Error fetching {activeTab} data.</p>
        )}

        {data && (
          <ul className="space-y-4">
            {data.map((item: any) => (
              <li
                key={item.id}
                className="bg-white p-4 rounded shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-medium">
                  {item.firstName} {item.lastName}
                </h2>
                <p className="text-gray-700">{item.vehicleOfInterest}</p>
                <span className="text-sm text-gray-500">
                  Source: {item.source} - Status: {item.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
