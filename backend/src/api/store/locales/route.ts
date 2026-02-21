import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const LOCALES = [
  { code: "fr", name: "French" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
]

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.json({ locales: LOCALES })
}
