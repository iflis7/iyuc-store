#!/usr/bin/env node
"use strict";

const { adminFetch } = require("./load-env.js");

const REFUND_REASONS = [
  { label: "Damaged or defective", code: "damaged_defective" },
  { label: "Wrong item sent", code: "wrong_item" },
  { label: "Customer request", code: "customer_request" },
  { label: "Duplicate order", code: "duplicate" },
  { label: "Quality issue", code: "quality_issue" },
  { label: "Other", code: "other" },
];

function toArray(val) {
  if (Array.isArray(val)) return val;
  if (val && Array.isArray(val.refund_reasons)) return val.refund_reasons;
  if (val && Array.isArray(val.data)) return val.data;
  return [];
}

async function main() {
  const raw = await adminFetch("/refund-reasons").then((r) => r.json()).catch(() => ({}));
  const list = toArray(raw);
  const existingCodes = new Set(list.map((r) => r.code));

  for (const reason of REFUND_REASONS) {
    if (existingCodes.has(reason.code)) {
      console.log("Skip (exists):", reason.code);
      continue;
    }
    const res = await adminFetch("/refund-reasons", {
      method: "POST",
      body: JSON.stringify(reason),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Failed:", reason.code, res.status, err);
      continue;
    }
    console.log("Created:", reason.code);
  }
  console.log("Done: refund reasons.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
