"use client";

import { useEffect, useState } from "react";
import { User } from "../utils";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../layout";

type ModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: User;
};

export default function LeadModal({
  isOpen,
  onClose,
  initialData,
}: ModalFormProps) {
  const [formData, setFormData] = useState<User>(
    initialData || {
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      vehicleOfInterest: "",
      status: "",
      source: "",
      dateReceived: "",
    },
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  const mutation = useMutation({
    mutationFn: (newUser: User) => {
      return fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {mutation.isPending ? (
        "Saving Lead"
      ) : (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 className="text-xl font-bold mb-4">Lead Form</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Vehicle of Interest
              </label>
              <input
                type="text"
                name="vehicleOfInterest"
                value={formData.vehicleOfInterest}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              >
                <option value="">Select status</option>
                <option value="Follow-Up">Follow-Up</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Source</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Date Received</label>
              <input
                type="datetime-local"
                name="dateReceived"
                value={
                  formData.dateReceived
                    ? new Date(formData.dateReceived).toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
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
            {mutation.isError ? (
              <div>An error occurred: {mutation.error.message}</div>
            ) : null}
          </form>
        </div>
      )}
    </div>
  );
}
