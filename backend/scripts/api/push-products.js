#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { adminFetch } = require("./load-env.js");

const dataDir = path.resolve(__dirname, "data");
const defaultDataPath = path.join(dataDir, "collection-01-products.json");
let products = [];
if (fs.existsSync(defaultDataPath)) {
  products = JSON.parse(fs.readFileSync(defaultDataPath, "utf8"));
}

const customPath = process.argv[2];
if (!products.length && customPath && fs.existsSync(customPath)) {
  products = JSON.parse(fs.readFileSync(customPath, "utf8"));
}

if (!products.length) {
  console.log("No products to push.");
  console.log("Add scripts/api/data/collection-01-products.json or pass a path: node push-products.js <path>");
  process.exit(0);
}

async function main() {
  const salesChannels = await adminFetch("/sales-channels").then((r) => r.json()).catch(() => ({}));
  const channelId = (salesChannels.sales_channels || salesChannels)[0]?.id;
  if (!channelId) {
    console.error("No sales channel found. Run seed first: docker compose run --rm medusa yarn seed");
    process.exit(1);
  }

  for (const product of products) {
    const payload = {
      ...product,
      sales_channels: product.sales_channels || [{ id: channelId }],
    };
    const res = await adminFetch("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Failed:", product.title || product.handle, res.status, err);
      continue;
    }
    const created = await res.json();
    console.log("Created:", created.product?.title ?? product.title ?? product.handle);
  }
  console.log("Done: products.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
