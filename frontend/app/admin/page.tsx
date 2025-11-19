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
import { fetchSources, fetchStatus, fetchVehicles } from "./_list/utils";
import Modal from "./_list/_modals/Modal";

const Tab = dynamic(() => import("./_list/Tab"));

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Status");
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const navItems = [
    { name: "Status", icon: UserGroupIcon, tab: true, fetchItem: fetchStatus },
    { name: "Sources", icon: SignalIcon, tab: true, fetchItem: fetchSources },
    { name: "Vehicles", icon: TruckIcon, tab: true, fetchItem: fetchVehicles },
  ];
  const buttonItems = [
    {
      name: "Add Lead",
      icon: TruckIcon,
      tab: false,
      toggle: setIsLeadModalOpen,
    },
    {
      name: "Add Status",
      icon: TruckIcon,
      tab: false,
      toggle: setIsStatusModalOpen,
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-50 bg-white shadow-md flex flex-col p-4">
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
          {buttonItems
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

      <main className="flex-1 p-6 pt-0 overflow-y-auto">
        {navItems
          .filter((item) => item.tab)
          .map((item) => (
            <div
              key={item.name}
              className={activeTab === item.name ? "block" : "hidden"}
            >
              <Tab tab={item.name.toLowerCase()} fetchItem={item.fetchItem!} />
            </div>
          ))}
        <LeadModal
          isOpen={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
        />
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          tab={"status"}
        />
        <Modal
          isOpen={isSourceModalOpen}
          onClose={() => setIsSourceModalOpen(false)}
          tab={"sources"}
        />
        <Modal
          isOpen={isVehicleModalOpen}
          onClose={() => setIsVehicleModalOpen(false)}
          tab={"vehicles"}
        />
      </main>
    </div>
  );
}
