import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <Link
        href="/admin"
        className="px-16 py-10 text-4xl font-bold rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Go to Admin
      </Link>
    </div>
  );
}
