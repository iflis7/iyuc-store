"use strict";
const fs = require("fs");
const path = require("path");

// Backend root = parent of scripts/api
const backendRoot = path.resolve(__dirname, "..", "..");
const envPath = path.join(backendRoot, ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eq = trimmed.indexOf("=");
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

// Prefer internal URL when set (Docker: one-off container → medusa service). Else tunnel/local.
const BASE = process.env.MEDUSA_API_INTERNAL_URL || process.env.MEDUSA_BACKEND_URL || "http://medusa:9000";
const API_KEY = process.env.MEDUSA_ADMIN_API_KEY;

// Medusa Admin API: secret keys (sk_*) usually use Bearer; Basic = base64(":token").
// If 401: try MEDUSA_USE_BASIC=true (or MEDUSA_USE_BEARER=true) in .env.
function authHeader() {
  if (!API_KEY) return {};
  const useBasic = process.env.MEDUSA_USE_BASIC === "true";
  if (useBasic) {
    const basic = Buffer.from(`:${API_KEY}`).toString("base64");
    return { Authorization: `Basic ${basic}` };
  }
  return { Authorization: `Bearer ${API_KEY}` };
}

function adminFetch(pathname, options = {}) {
  const url = `${BASE.replace(/\/$/, "")}/admin${pathname}`;
  const headers = {
    "Content-Type": "application/json",
    ...authHeader(),
    ...options.headers,
  };
  return fetch(url, { ...options, headers });
}

module.exports = { BASE, API_KEY, adminFetch };
