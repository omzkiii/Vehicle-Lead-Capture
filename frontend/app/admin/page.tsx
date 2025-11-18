"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import {
  UserGroupIcon,
  SignalIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

import LeadModal from "./_list/_modals/LeadModal";
import SourceModal from "./_list/_modals/SourceModal";
import VehicleModal from "./_list/_modals/VehicleModal";
import { User } from "./_list/utils";

const Status = dynamic(() => import("./_list/Status"));
const Users = dynamic(() => import("./_list/Users"));
const Sources = dynamic(() => import("./_list/Sources"));
const Vehicles = dynamic(() => import("./_list/Vehicles"));

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Status");
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const navItems = [
    { name: "Status", icon: UserGroupIcon, tab: true },
    { name: "Sources", icon: SignalIcon, tab: true },
    { name: "Vehicles", icon: TruckIcon, tab: true },
    {
      name: "Add Lead",
      icon: TruckIcon,
      tab: false,
      toggle: setIsLeadModalOpen,
    },
    {
      name: "Add Source",
      icon: TruckIcon,
      tab: false,
      toggle: setIsSourceModalOpen,
    },
    {
      name: "Add Vehicle",
      icon: TruckIcon,
      tab: false,
      toggle: setIsVehicleModalOpen,
    },
  ];

  const activeItem = navItems.find((item) => item.name === activeTab);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col p-4">
        <h1 className="text-xl font-bold mb-6">Dashboard</h1>

        {/* Top navigation */}
        <ul className="space-y-2 flex-1">
          {navItems
            .filter((item) => item.tab)
            .map((item) => (
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

        {/* Bottom buttons */}
        <div className="flex flex-col space-y-2 pb-8 mt-auto">
          {navItems
            .filter((item) => !item.tab)
            .map((item) => (
              <button
                key={item.name}
                className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  item.toggle!(true);
                }}
              >
                {item.name}
              </button>
            ))}
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "Status" ? (
          <Status />
        ) : activeTab === "Sources" ? (
          <Sources />
        ) : activeTab === "Vehicles" ? (
          <Vehicles />
        ) : null}
        <LeadModal
          isOpen={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
        />
        <SourceModal
          isOpen={isSourceModalOpen}
          onClose={() => setIsSourceModalOpen(false)}
        />
        <VehicleModal
          isOpen={isVehicleModalOpen}
          onClose={() => setIsVehicleModalOpen(false)}
        />
      </main>
    </div>
  );
}
