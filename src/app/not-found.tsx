import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f7fb] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold tracking-tight text-[#5b33e8]">
          404
        </h1>

        <h2 className="mt-3 text-2xl font-bold text-[#252b3a]">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-[#7b8497] max-w-sm mx-auto">
          Sorry, the page you are looking for doesn't exist or may have been
          moved.
        </p>

        <Link
          href="/"
          className="inline-block mt-7 px-6 py-2.5 rounded-xl bg-[#5b33e8] text-white text-sm font-semibold hover:bg-[#4d29ce] transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
