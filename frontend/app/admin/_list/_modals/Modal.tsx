"use client";

import { useEffect, useState } from "react";
import { Source } from "../utils";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/ReactQueryProvider";

type Item = {
  id: string;
  name: string;
};
type ModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Item;
  tab: string;
};
const blankForm = {
  id: "",
  name: "",
};

export default function Modal({
  isOpen,
  onClose,
  initialData,
  tab,
}: ModalFormProps) {
  const [formData, setFormData] = useState<Item>(initialData || blankForm);

  useEffect(() => {
    setFormData(initialData ?? blankForm);
  }, [initialData]);

  const insert = useMutation({
    mutationFn: async (newItem: Item) => {
      return await fetch(`/api/${tab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [tab],
      });
      setFormData(blankForm);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    insert.mutate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">
          {tab.charAt(0).toUpperCase() + tab.slice(1)} Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
