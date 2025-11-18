import { useQuery } from "@tanstack/react-query";
import { formatDate, User } from "./utils";

export default function Users() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch data");
      console.log(res);
      return res.json();
    },
  });

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      {isLoading && <p className="text-gray-500">Loading users...</p>}
      {isError && <p className="text-red-500">Error fetching users data.</p>}

      {data && (
        <ul className="space-y-4">
          {data.map((item: User) => (
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
      )}
    </main>
  );
}
