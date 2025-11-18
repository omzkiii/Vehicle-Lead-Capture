import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UserList from "./UserList";
import { fetchSources, type Source } from "./utils";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function SourceList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sources"],
    queryFn: fetchSources,
  });
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  function closeUserList() {
    setSelectedSource(null);
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      {isLoading && <p className="text-gray-500">Loading users...</p>}
      {isError && <p className="text-red-500">Error fetching users data.</p>}

      {selectedSource == null ? (
        data && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Sources Dashboard</h1>
            <ul className="space-y-4">
              {data.map((item: Source) => (
                <li
                  key={item.id}
                  className="p-4 bg-white rounded shadow-sm"
                  onClick={() => {
                    setSelectedSource(item);
                  }}
                >
                  <h2 className="font-bold">{item.name}</h2>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        <div>
          <button
            onClick={closeUserList}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </button>
          <UserList item={selectedSource} tab="sources" name={data.name} />
        </div>
      )}
    </main>
  );
}
