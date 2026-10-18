import Link from "next/link";
import { primaryButton } from "@/Utils/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-7xl font-semibold tracking-tight text-accent sm:text-8xl">
          404
        </h1>

        <h2 className="mt-3 text-xl font-semibold text-ink">Page not found</h2>

        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Sorry, the page you are looking for doesn&apos;t exist or may have
          been moved.
        </p>

        <Link href="/" className={`${primaryButton} mt-6 px-5`}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
