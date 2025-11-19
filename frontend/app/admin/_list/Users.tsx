import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUsers, formatDate, User } from "./utils";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import LeadModal from "./_modals/LeadModal";
import { queryClient } from "@/app/ReactQueryProvider";

const PAGE_SIZE = 4;

export default function Users() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<User | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page, PAGE_SIZE),
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

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      {isLoading && <p className="text-gray-500">Loading users...</p>}
      {isError && <p className="text-red-500">Error fetching users data.</p>}

      {data && (
        <div>
          <ul className="space-y-4">
            {data.map((item: User) => (
              <li
                key={item.id}
                className="p-4 bg-white rounded shadow-sm flex items-start justify-between"
              >
                <div className="pr-4">
                  <h2 className="font-bold">
                    {item.firstName} {item.lastName}
                  </h2>
                  <p>ID: {item.id}</p>
                  <p>Email: {item.email}</p>
                  <p>Phone: {item.phone}</p>
                  <p>Vehicle of Interest: {item.vehicleOfInterest}</p>
                  <p>Status: {item.status}</p>
                  <p>Source: {item.source}</p>
                  <p>Date Received: {formatDate(item.dateReceived)}</p>
                </div>

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
                    onClick={() => {
                      deleteUser.mutate(item);
                    }}
                  >
                    <TrashIcon className="w-5 h-5 text-red-700" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-center space-x-4 mt-6">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page}</span>
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              disabled={data.length < PAGE_SIZE}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>

          <LeadModal
            key={currentItem?.id ?? "new"}
            isOpen={isLeadModalOpen}
            onClose={() => {
              setIsLeadModalOpen(false);
            }}
            initialData={currentItem ?? undefined}
          />
        </div>
      )}
    </main>
  );
}
