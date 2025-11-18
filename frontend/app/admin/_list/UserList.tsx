import { useQuery } from "@tanstack/react-query";
import { formatDate, User } from "./utils";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction } from "react";

type UserProp = {
  isModalOpen: string;
  setIsModalOpen: Dispatch<SetStateAction<string>>;
};

type UserListProp = {
  tab: string;
  id: string | null;
  name: string;
};
export default function UserList(prop: UserListProp) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [prop.tab, prop.id],
    queryFn: async () => {
      const res = await fetch(`/api/${prop.tab}/${prop.id}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      console.log(res);
      return res.json();
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
              <li key={item.id} className="p-4 bg-white rounded shadow-sm">
                <h2 className="font-bold">
                  {item.firstName} {item.lastName}
                </h2>
                <p>Email: {item.email}</p>
                <p>Phone: {item.phone}</p>
                <p>Vehicle of Interest: {item.vehicleOfInterest}</p>
                <p>Status: {item.status}</p>
                <p>Source: {item.source}</p>
                <p>Date Received: {formatDate(item.dateReceived)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
