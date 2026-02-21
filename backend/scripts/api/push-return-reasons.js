#!/usr/bin/env node
"use strict";

const { adminFetch } = require("./load-env.js");

const RETURN_REASONS = [
  { value: "wrong_size", label: "Wrong size" },
  { value: "changed_mind", label: "Changed mind" },
  { value: "damaged_defective", label: "Damaged or defective" },
  { value: "wrong_item", label: "Wrong item received" },
  { value: "not_as_described", label: "Not as described" },
  { value: "other", label: "Other" },
];

function toArray(val) {
  if (Array.isArray(val)) return val;
  if (val && Array.isArray(val.return_reasons)) return val.return_reasons;
  if (val && Array.isArray(val.data)) return val.data;
  return [];
}

async function main() {
  const raw = await adminFetch("/return-reasons").then((r) => r.json()).catch(() => ({}));
  const list = toArray(raw);
  const existingValues = new Set(list.map((r) => r.value));

  for (const reason of RETURN_REASONS) {
    if (existingValues.has(reason.value)) {
      console.log("Skip (exists):", reason.value);
      continue;
    }
    const res = await adminFetch("/return-reasons", {
      method: "POST",
      body: JSON.stringify(reason),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Failed:", reason.value, res.status, err);
      continue;
    }
    console.log("Created:", reason.value);
  }
  console.log("Done: return reasons.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
