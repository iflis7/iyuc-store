# Plan 2: Gaps to Add + Brand Compliance

**Goal:** (1) List features and data the site is missing (backend + frontend). (2) Check Lovable frontend against IYUC brand guidelines and list fixes.

---

## Part A: Gaps — what we don’t have yet

### Backend (Medusa)

| Gap | Priority | Action |
|-----|----------|--------|
| **Regions seeded** | High | Seed at least Canada (CA) with CAD. Add US, etc. when you expand. |
| **Collections by name** | High | Create collections with handles: `ixulaf`, `azekka`, `imnayen`, `tigejda`. Optional: `new`, `pre-order` or map to tags. |
| **Products with collection_id** | High | Seed or import products and assign to the collections above. |
| **Publishable API key** | High | Create in Admin, attach to sales channel, use in frontend env. |
| **Shipping options** | High | Configure at least one shipping option per region (e.g. Standard, Express) so checkout can fetch and calculate. |
| **Payment provider** | High | Enable at least one (e.g. manual for testing) so “Place order” creates a real order. |
| **n8n webhook** | Medium | Already in README: set `N8N_WEBHOOK_URL` so `order.placed` is sent. Verify it fires. |
| **Tags / product type** | Low | Use product tags or metadata for “New,” “Pre-order,” “Yennayer” if you want filterable badges from backend. |
| **Locales** | Low | Add if you need FR/EN at CMS level. |

### Frontend (Lovable / React)

| Gap | Priority | Action |
|-----|----------|--------|
| **Env for API URL and key** | High | Use `VITE_MEDUSA_BACKEND_URL` and `VITE_MEDUSA_PUBLISHABLE_KEY`; no hardcoding. |
| **Real checkout flow** | High | Replace fake “Order Confirmed” with: load shipping options from Medusa, select option, complete cart → order, show real order id. |
| **Shipping options in checkout** | High | Call store shipping API; display options and price; pass selected option when completing. |
| **Error states** | Medium | When backend fails, show a message instead of silently falling back to mock (or make mock opt-in only). |
| **Country / region selector** | Medium | Optional: allow switching region (e.g. CA vs US) and refresh cart and prices. |
| **Customer login & account** | Medium | Login, register, profile, order history using Medusa customer + orders APIs. |
| **Product badges from backend** | Low | If backend has tags/metadata for “new” / “pre-order,” show them on ProductCard and ProductDetail. |
| **Pre-order copy** | Low | “Pre-order — ships [date]” from product metadata or collection. |
| **Size guide** | Low | Link or modal on product page (can be static or CMS later). |
| **SEO (meta, titles)** | Low | Per-page meta and titles for collections and products. |

---

## Part B: Brand compliance (style, colors, words)

**Reference:** [IYUC/Marketing/Brand/Brand-Guidelines.md](../../Marketing/Brand/Brand-Guidelines.md), [Brand-Colors-Typography.md](../../Marketing/Brand/Brand-Colors-Typography.md), [Lovable-Website-Brief.md](../../Marketing/Lovable-Website-Brief.md).

### Colors

| Brand spec | Frontend (current) | Status / action |
|------------|--------------------|------------------|
| Background sand `#f5f0e8` | `--background: 36 33% 93%` (sand) | OK |
| Text charcoal `#2d2d2d` | `--foreground: 0 0% 18%` | OK |
| Primary (CTAs) indigo `#1e3a5f` | `--primary: 213 52% 24%` (indigo) | OK |
| Terracotta for badges `#c45c3e` | `--badge-new: 14 55% 51%` (terracotta) | OK |
| Gold for Yennayer etc. `#b8860b` | `--badge-gold: 43 86% 38%` (gold) | OK |

**Verdict:** CSS variables already match brand. Ensure all buttons and primary actions use `primary`; badges use `badge-new` / `badge-gold` where appropriate.

### Typography

| Brand spec | Frontend (current) | Status / action |
|------------|--------------------|------------------|
| Headings: strong modern sans | `font-heading: Inter, DM Sans` | OK (brand also allows Clash Display, Satoshi). |
| Body: clean sans | `font-sans: DM Sans, Inter` | OK |
| Wordmark IYUC | Header and checkout use “IYUC” uppercase, tracking | OK. Optional: add ⵣ in footer. |

**Verdict:** Typography aligns. Optional: add a second heading font (e.g. Clash Display) for hero/headlines if desired.

### Copy and wording

| Item | Check | Action |
|------|--------|--------|
| Tagline | Hero or home should use one of: “Wear the story. Anywhere.” / “Amazigh culture, for the world.” / “Streetwear with an Amazigh soul. For everyone, everywhere.” | Confirm Hero/Layout use one of these. |
| Collection names | Ixulaf, Azekka, Imnayen, Tigejda — no “Boys/Girls/Men/Women” as primary label in nav (subtitle OK). | Header and Collections already use Ixulaf, Azekka, Imnayen, Tigejda. |
| Pre-order | Where relevant: “Pre-order — ships [date].” | Add when product/collection is pre-order (from metadata or collection). |
| Our Story | One short line introducing Amazigh for newcomers. | Review OurStory page copy against brand. |
| Tone | Confident, warm, inclusive; no insider-only or Quebec-only refs without context. | Quick audit of OurStory, FAQ, Contact, Returns. |

### Layout and UX

| Brand spec | Frontend (current) | Status / action |
|------------|--------------------|------------------|
| Spacious, minimal, big imagery | Layout and product grid | Confirm product images are prominent; avoid clutter. |
| Pre-order and Drop visible | Badges / links for New, Pre-order | Collections and nav already have New and Pre-order. Ensure product cards show badge when applicable. |
| One main symbol (e.g. ⵣ) | Footer or logo | Optional: add ⵣ in footer or next to wordmark. |

### Checklist (brand)

- [ ] Hero or home shows brand tagline (one of the three).
- [ ] All primary CTAs use indigo (primary).
- [ ] Badges (New, Pre-order, Yennayer) use terracotta/gold only; no extra accent colors.
- [ ] Collection names in nav and collection pages: Ixulaf, Azekka, Imnayen, Tigejda.
- [ ] Our Story (and any culture copy) includes one line that explains Amazigh for a first-time visitor.
- [ ] Pre-order products/pages show “Pre-order — ships [date]” when applicable.
- [ ] Optional: ⵣ in footer or logo; no wallpaper of symbols.

---

## Part C: Suggested order of work

1. **Backend:** Seed regions + collections (ixulaf, azekka, imnayen, tigejda) + products; create publishable key; configure shipping + one payment provider.
2. **Frontend config:** Env vars for backend URL and publishable key; reduce or gate mock fallback.
3. **Frontend checkout:** Integrate shipping options and place-order with Medusa; show real order id.
4. **Brand copy:** Audit Hero, Our Story, FAQ; add tagline and pre-order copy where needed.
5. **Polish:** Error states, optional country switcher, customer account, badges from backend.
