"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = [
  { value: "CUSTOMER", label: "Customer — planning an event" },
  { value: "VENDOR", label: "Vendor — event company" },
  { value: "FREELANCER", label: "Freelancer — independent specialist" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "CUSTOMER" as (typeof ROLE_OPTIONS)[number]["value"],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Unable to create your account.");
        return;
      }

      router.push(`/${form.role.toLowerCase()}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl font-medium">Create your account</h1>
      <p className="mt-2 text-sm text-ink/60">
        Join EventHub as a customer, vendor, or freelancer.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="text-sm font-medium">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="text-sm font-medium">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink/45">At least 8 characters.</p>
        </div>

        <div>
          <label htmlFor="role" className="text-sm font-medium">
            I am a...
          </label>
          <select
            id="role"
            required
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value as (typeof ROLE_OPTIONS)[number]["value"],
              })
            }
            className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="text-plum underline underline-offset-4">
          Log in
        </Link>
      </p>
    </main>
  );
}
