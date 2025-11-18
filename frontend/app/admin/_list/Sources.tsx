import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UserList from "./UserList";

type Source = {
  id: string;
  name: string;
};

export default function Source() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sources"],
    queryFn: async () => {
      const res = await fetch("/api/sources");
      if (!res.ok) throw new Error("Failed to fetch data");
      console.log(res);
      return res.json();
    },
  });
  const [userListId, setUserListId] = useState<string | null>(null);
  function closeUserList() {
    setUserListId(null);
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      {isLoading && <p className="text-gray-500">Loading users...</p>}
      {isError && <p className="text-red-500">Error fetching users data.</p>}

      {userListId == null ? (
        data && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Sources Dashboard</h1>
            <ul className="space-y-4">
              {data.map((item: Source) => (
                <li
                  key={item.id}
                  className="p-4 bg-white rounded shadow-sm"
                  onClick={() => setUserListId(item.id)}
                >
                  <h2 className="font-bold">{item.name}</h2>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        <UserList id={userListId} tab="sources" close={closeUserList} />
      )}
    </main>
  );
}
