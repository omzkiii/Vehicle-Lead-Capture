"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  UserGroupIcon,
  QueueListIcon,
  SignalIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

import LeadModal from "./_list/_modals/LeadModal";
import { fetchSources, fetchStatus, fetchVehicles } from "./_list/utils";
import Modal from "./_list/_modals/Modal";
import Users from "./_list/Users";

const Tab = dynamic(() => import("./_list/Tab"));

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Status");
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const navItems = [
    { name: "Users", icon: UserGroupIcon, tab: true, fetchItem: null },
    { name: "Status", icon: QueueListIcon, tab: true, fetchItem: fetchStatus },
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
              <motion.li
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 cursor-pointer p-2 rounded ${
                  activeTab === item.name ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-6 h-6 text-gray-600" />
                <span className="text-gray-800">{item.name}</span>
              </motion.li>
            ))}
        </ul>

        {/* Bottom buttons */}
        <div className="flex flex-col space-y-2 pb-8 mt-auto">
          {buttonItems
            .filter((item) => !item.tab)
            .map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => item.toggle!(true)}
              >
                {item.name}
              </motion.button>
            ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-0 overflow-y-auto">
        <motion.div
          key={"users"}
          initial={{ opacity: 0 }}
          animate={{ opacity: activeTab === "Users" ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={activeTab === "Users" ? "block" : "hidden"}
        >
          <Users />
        </motion.div>
        {navItems
          .filter((item) => item.tab && item.fetchItem)
          .map((item) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeTab === item.name ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className={activeTab === item.name ? "block" : "hidden"}
            >
              <Tab tab={item.name.toLowerCase()} fetchItem={item.fetchItem!} />
            </motion.div>
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
