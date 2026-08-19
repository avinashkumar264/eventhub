"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createPaymentOrder, verifyPayment } from "@/lib/actions/bookings";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PaymentCheckout({
  bookingId,
  maxAmount,
  customerName,
}: {
  bookingId: string;
  maxAmount: number;
  customerName: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(maxAmount);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("amount", String(amount));
      const order = await createPaymentOrder(bookingId, formData);

      if (order.error || !order.orderId || !order.keyId) {
        setError(order.error ?? "Unable to start payment.");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Couldn't load the payment checkout. Please try again.");
        return;
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: Math.round(order.amount! * 100),
        currency: "INR",
        order_id: order.orderId,
        name: "EventHub",
        description: "Advance payment",
        prefill: { name: customerName },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const result = await verifyPayment(bookingId, response);
          if (result.error) {
            setError(result.error);
            return;
          }
          router.refresh();
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      razorpay.open();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6">
      <label htmlFor="amount" className="text-sm font-medium">
        Advance amount
      </label>
      <input
        id="amount"
        type="number"
        min={1}
        max={maxAmount}
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
      />
      <p className="mt-1 text-xs text-ink/45">
        Up to ${maxAmount.toLocaleString()} (total booking amount).
      </p>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <Button
        variant="primary"
        className="mt-4"
        onClick={handlePay}
        disabled={loading || amount <= 0}
      >
        {loading ? "Processing…" : "Pay advance"}
      </Button>
    </div>
  );
}
