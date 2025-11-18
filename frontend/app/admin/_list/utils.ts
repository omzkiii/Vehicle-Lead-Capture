import { useMutation } from "@tanstack/react-query";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleOfInterest: string;
  status: string;
  dateReceived: string;
  source: string;
};

export type Source = {
  id: string | null;
  name: string;
};

export type Status = {
  id: string | null;
  name: string;
};

export type Vehicle = {
  id: string | null;
  name: string;
};

export function formatDate(date: string) {
  const d = new Date(date);
  return `${d.getFullYear()} ${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
}

export async function fetchUsers() {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  console.log(res);
  return res.json();
}
export async function fetchVehicles() {
  const res = await fetch("/api/vehicles");
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  console.log(res);
  return res.json();
}
export async function fetchSources() {
  const res = await fetch("/api/sources");
  if (!res.ok) throw new Error("Failed to fetch sources");
  console.log(res);
  return res.json();
}

export async function fetchStatus() {
  const res = await fetch("/api/status");
  if (!res.ok) throw new Error("Failed to fetch status");
  console.log(res);
  return res.json();
}
export async function fetchUserList(
  tab: string,
  id: string | null | undefined,
) {
  const res = await fetch(`/api/${tab}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  console.log(res);
  return res.json();
}
