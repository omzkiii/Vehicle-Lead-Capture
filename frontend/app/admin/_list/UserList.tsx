import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchUserList,
  fetchUsers,
  formatDate,
  Source,
  User,
  Vehicle,
} from "./utils";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useState } from "react";
import { queryClient } from "@/app/ReactQueryProvider";
import LeadModal from "./_modals/LeadModal";

type UserProp = {
  isModalOpen: string;
  setIsModalOpen: Dispatch<SetStateAction<string>>;
};

type UserListProp = {
  tab: string;
  item: Source | Vehicle | null;
  name: string;
};
export default function UserList(prop: UserListProp) {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<User | null>(null);
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
        // queryKey: ["users"],
        predicate: (query) =>
          query.queryKey.some((key) => fields.includes(String(key))),
      });
    },
  });

  return (
    <main>
      {isLoading && <p className="text-gray-500">Loading users...</p>}
      {isError && <p className="text-red-500">Error fetching users data.</p>}
      {data && (
        <div>
          <h1 className="text-3xl font-bold mb-6">{data.name}</h1>
          <ul className="space-y-4">
            {data.users.map((item: User) => (
              <li
                key={item.id}
                className="p-4 bg-white rounded shadow-sm flex items-start justify-between"
              >
                {/* LEFT SIDE CONTENT */}
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
