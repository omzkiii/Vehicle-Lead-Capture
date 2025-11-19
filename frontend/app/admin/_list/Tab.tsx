"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import UserList from "./UserList";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Modal from "./_modals/Modal";
import { queryClient } from "@/app/ReactQueryProvider";
import { useState } from "react";
import { motion } from "framer-motion";

type Item = {
  id: string;
  name: string;
};

type TabProp = {
  tab: string;
  fetchItem: () => Promise<Item[]>;
};

export default function Tab({ tab, fetchItem }: TabProp) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [tab],
    queryFn: () => fetchItem(),
  });

  const [selected, setSelected] = useState<Item | null>(null);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeUserList() {
    setSelected(null);
  }

  const deleteItem = useMutation({
    mutationFn: async (item: Item) => {
      return await fetch(`/api/${tab}/${item.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tab] });
    },
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="flex-1 p-6 pt-0 overflow-y-auto">
      {isLoading && <p className="text-gray-500">Loading {tab}...</p>}
      {isError && <p className="text-red-500">Error fetching {tab}.</p>}

      {selected == null ? (
        data && (
          <div>
            <h1 className="text-3xl font-bold pt-[2vh] pl-10 left-51 right-0 bg-white w-fill absolute">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </h1>
            <motion.ul className="space-y-4 pt-[7vh]">
              {data.map((item: Item) => (
                <motion.div
                  key={item.id}
                  className="p-1 bg-white rounded mx-[1vw] shadow-sm flex items-start justify-between"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                >
                  <li
                    className="w-full h-10 p-2  rounded flex items-start justify-between"
                    onClick={() => setSelected(item)}
                  >
                    <h2 className="font-bold">{item.name}</h2>
                  </li>

                  <div className="flex flex-row space-x-2">
                    <button
                      className="p-2 rounded bg-blue-100 hover:bg-blue-200 flex items-center"
                      onClick={() => {
                        setCurrentItem(item);
                        setIsModalOpen(true);
                      }}
                    >
                      <PencilSquareIcon className="w-5 h-5 text-blue-700" />
                    </button>

                    <button
                      className="p-2 rounded bg-red-100 hover:bg-red-200 flex items-center"
                      onClick={() => deleteItem.mutate(item)}
                    >
                      <TrashIcon className="w-5 h-5 text-red-700" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.ul>

            <Modal
              key={currentItem?.id ?? "new"}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              initialData={currentItem ?? undefined}
              tab={tab}
            />
          </div>
        )
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="font-bold left-51 right-0 p-6 top-0 h-4 pl-2 bg-white absolute">
            <button
              onClick={closeUserList}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back
            </button>
          </div>
          <UserList item={selected} tab={tab} />
        </motion.div>
      )}
    </main>
  );
}
