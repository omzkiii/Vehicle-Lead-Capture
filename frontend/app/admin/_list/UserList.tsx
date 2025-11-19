"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUserList, formatDate, User } from "./utils";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { queryClient } from "@/app/ReactQueryProvider";
import LeadModal from "./_modals/LeadModal";
import { motion } from "framer-motion";

type Item = {
  id: string;
  name: string;
};

type UserListProp = {
  tab: string;
  item: Item | null;
};

export default function UserList(prop: UserListProp) {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [prop.item?.name],
    queryFn: () => fetchUserList(prop.tab, prop.item?.id),
  });

  const deleteUser = useMutation({
    mutationFn: async (user: User) => {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: (_data, user) => {
      const fields = [
        "users",
        user.status,
        user.source,
        user.vehicleOfInterest,
      ];
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some((key) => fields.includes(String(key))),
      });
    },
  });

  const filteredUsers = data?.users.filter((u: User) =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.phone} ${u.vehicleOfInterest} ${u.status} ${u.source} ${formatDate(u.dateReceived)}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main>
      {isLoading && <p className="text-gray-500">Loading users...</p>}
      {isError && <p className="text-red-500">Error fetching users data.</p>}
      {data && (
        <div className="pt-[7vh]">
          <div className="absolute top-12 left-51 right-0 px-[2vw] pb-4 bg-white">
            <h1 className="text-3xl font-bold w-full p-3">{data.name}</h1>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <motion.ul className="space-y-4 pt-24">
            {filteredUsers.map((item: User) => (
              <motion.li
                key={item.id}
                className="p-5 mx-[1vw] bg-white rounded shadow-sm flex items-start justify-between"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                {/* LEFT SIDE CONTENT */}
                <div className="pr-4">
                  <h2 className="font-bold">
                    {item.firstName} {item.lastName}
                  </h2>
                  <p>Email: {item.email}</p>
                  <p>Phone: {item.phone}</p>
                  <p>Vehicle of Interest: {item.vehicleOfInterest}</p>
                  <p>Status: {item.status}</p>
                  <p>Source: {item.source}</p>
                  <p>Date Received: {formatDate(item.dateReceived)}</p>
                </div>

                {/* RIGHT SIDE BUTTONS */}
                <div className="flex flex-col space-y-2">
                  <button
                    className="p-2 rounded bg-blue-100 hover:bg-blue-200 flex items-center"
                    onClick={() => {
                      setCurrentItem(item);
                      setIsLeadModalOpen(true);
                    }}
                  >
                    <PencilSquareIcon className="w-5 h-5 text-blue-700" />
                  </button>

                  <button
                    className="p-2 rounded bg-red-100 hover:bg-red-200 flex items-center"
                    onClick={() => deleteUser.mutate(item)}
                  >
                    <TrashIcon className="w-5 h-5 text-red-700" />
                  </button>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          <LeadModal
            key={currentItem?.id ?? "new"}
            isOpen={isLeadModalOpen}
            onClose={() => setIsLeadModalOpen(false)}
            initialData={currentItem ?? undefined}
          />
        </div>
      )}
    </main>
  );
}
