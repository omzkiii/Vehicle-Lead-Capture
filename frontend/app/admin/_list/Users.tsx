import { useQuery } from "@tanstack/react-query";
import { fetchUsers, formatDate, User } from "./utils";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import LeadModal from "./_modals/LeadModal";

export default function Users() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<User | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
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
                      setIsLeadModalOpen(true);
                      setCurrentItem(item);
                      console.log(currentItem);
                    }}
                  >
                    <PencilSquareIcon className="w-5 h-5 text-blue-700" />
                  </button>

                  <button
                    className="p-2 rounded bg-red-100 hover:bg-red-200 flex items-center"
                    // onClick={() => handleDelete(item.id)}
                  >
                    <TrashIcon className="w-5 h-5 text-red-700" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <LeadModal
            isOpen={isLeadModalOpen}
            onClose={() => {
              setIsLeadModalOpen(false);
              // setCurrentItem("hello");
            }}
            initialData={currentItem ?? undefined}
          />
        </div>
      )}
    </main>
  );
}
