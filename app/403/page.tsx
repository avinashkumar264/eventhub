import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-sm uppercase tracking-[0.25em] text-plum">
        403
      </p>
      <h1 className="mt-3 font-display text-3xl font-medium">
        You don&apos;t have access to this page
      </h1>
      <p className="mt-4 text-ink/60">
        Your account doesn&apos;t have permission to view this section.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-plum underline underline-offset-4"
      >
        Back to home
      </Link>
    </main>
  );
}
