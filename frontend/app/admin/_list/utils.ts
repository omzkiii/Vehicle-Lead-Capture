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

export function formatDate(date: string) {
  const d = new Date(date);
  return `${d.getFullYear()} ${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
}
