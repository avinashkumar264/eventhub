import crypto from "crypto";
import Razorpay from "razorpay";

/** Public — safe to expose to the client (it's an id, not a secret). */
export function getPublicRazorpayKeyId(): string | null {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null;
}

function isConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  );
}

function getClient(): Razorpay {
  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

/**
 * Creates a real Razorpay order. Returns null (never a fake order) if
 * credentials aren't configured — callers must surface a clear
 * "payment provider not configured" state, not a fabricated success.
 */
export async function createRazorpayOrder(params: {
  amountInPaise: number;
  receipt: string;
}): Promise<{ orderId: string } | null> {
  if (!isConfigured()) return null;

  const order = await getClient().orders.create({
    amount: params.amountInPaise,
    currency: "INR",
    receipt: params.receipt,
  });

  return { orderId: order.id };
}

/** Verifies the signature returned by Razorpay Checkout after payment. */
export function verifyCheckoutSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(params.signature, "utf8")
    );
  } catch {
    return false;
  }
}

/** Verifies the X-Razorpay-Signature header on incoming webhooks. */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}
