/**
 * Server-verified payment confirmation (Deno / Supabase Edge Function style)
 * ───────────────────────────────────────────────────────────────────────
 * A generalized version of the payment-integrity pattern used in JEETrack.
 * Three rules this follows:
 *
 *   1. Never trust a client-reported "payment succeeded" — verify the
 *      gateway's signature server-side before recording anything.
 *   2. Don't rely solely on the browser callback. If the user's tab closes
 *      right after paying, the payment still happened — a webhook from the
 *      gateway's own servers is the actual source of truth.
 *   3. Both the callback and the webhook path write through the same
 *      idempotent upsert, keyed on the gateway's payment ID — so a retried
 *      or duplicated call can never create a second record.
 */

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toHex(sigBuffer);
}

/**
 * Verifies a payment gateway's signature and idempotently records the
 * payment. Returns whether verification succeeded — callers should never
 * mark something "paid" in the UI without this returning true.
 */
async function verifyAndRecordPayment(opts: {
  orderId: string;
  paymentId: string;
  signature: string;
  amount: number;
  webhookSecret: string;
  recordPayment: (row: {
    paymentId: string;
    orderId: string;
    amount: number;
    status: "paid" | "signature_mismatch";
  }) => Promise<void>;
}): Promise<{ verified: boolean }> {
  const expectedSignature = await hmacSha256Hex(
    opts.webhookSecret,
    `${opts.orderId}|${opts.paymentId}`
  );
  const verified = expectedSignature === opts.signature;

  // Record either way (a mismatch is worth logging), but the row is
  // upserted on paymentId in the caller's `recordPayment` implementation —
  // that's what makes calling this twice for the same payment safe.
  await opts.recordPayment({
    paymentId: opts.paymentId,
    orderId: opts.orderId,
    amount: opts.amount,
    status: verified ? "paid" : "signature_mismatch",
  });

  return { verified };
}

export { verifyAndRecordPayment };
