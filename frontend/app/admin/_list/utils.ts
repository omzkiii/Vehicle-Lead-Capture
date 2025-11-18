export type User = {
  id: string | null;
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

export type Vehicle = {
  id: string | null;
  name: string;
};

export function formatDate(date: string) {
  const d = new Date(date);
  return `${d.getFullYear()} ${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
}
