"use client";

import { useEffect, useState } from "react";
import { fetchSources, fetchStatus, Source, Status, User } from "../utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/app/ReactQueryProvider";

type ModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: User;
};

const blankForm = {
  // id: initialData?.id ?? "",
  // firstName: "geo",
  // lastName: "san",
  // email: "geo@san",
  // phone: "123",
  // vehicleOfInterest: "2025 Sniper 155",
  // status: "Qualified",
  // source: "SMS",
  // dateReceived: "",
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  vehicleOfInterest: "",
  status: "",
  source: "",
  dateReceived: "",
};
export default function LeadModal({
  isOpen,
  onClose,
  initialData,
}: ModalFormProps) {
  const [formData, setFormData] = useState<User>(initialData ?? blankForm);

  const sourcesQuery = useQuery<Source[]>({
    queryKey: ["sources"],
    queryFn: fetchSources,
  });

  const statusQuery = useQuery<Status[]>({
    queryKey: ["status"],
    queryFn: fetchStatus,
  });

  useEffect(() => {
    setFormData(initialData ?? blankForm);
  }, [initialData]);

  const insertUser = useMutation({
    mutationFn: async (newUser: User) => {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      return true;
    },
    onSuccess: () => {
      console.log(initialData);
      console.log(formData);
      const fields = [
        "users",
        initialData?.status,
        initialData?.source,
        initialData?.vehicleOfInterest,
        formData.status,
        formData.source,
        formData.vehicleOfInterest,
      ];
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some((key) => fields.includes(String(key))),
      });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    insertUser.mutate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {insertUser.isPending ? (
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
                required
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              >
                <option value="">Select status</option>
                {statusQuery.data?.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              >
                <option value="">Select source</option>
                {sourcesQuery.data?.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
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
            {insertUser.isError ? (
              <div>An error occurred: {insertUser.error.message}</div>
            ) : null}
          </form>
        </div>
      )}
    </div>
  );
}
