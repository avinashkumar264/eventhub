"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/lib/actions/bookings";

export function CreateBookingButton({ quotationId }: { quotationId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      // createBooking redirects on success (throws internally), so a
      // returned value here only ever means it failed.
      const result = await createBooking(quotationId);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <Button variant="gold" onClick={handleClick} disabled={pending}>
        {pending ? "Creating booking…" : "Create booking"}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
