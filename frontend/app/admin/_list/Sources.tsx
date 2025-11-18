import { useQuery } from "@tanstack/react-query";

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

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Sources Dashboard</h1>

      {isLoading && <p className="text-gray-500">Loading users...</p>}
      {isError && <p className="text-red-500">Error fetching users data.</p>}

      {data && (
        <ul className="space-y-4">
          {data.map((item: Source) => (
            <li key={item.id} className="p-4 bg-white rounded shadow-sm">
              <h2 className="font-bold">{item.name}</h2>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
